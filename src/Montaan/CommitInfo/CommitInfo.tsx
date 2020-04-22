// src/components/CommitInfo/CommitInfo.tsx

import React from 'react';
import {
	span,
	formatDiff,
	createCalendar,
	CalendarMouseEventHandler,
	CalendarElement,
	Commit,
	CommitFile,
} from '../CommitParser/parse-diff';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Editor, { DiffEditor, monaco, Monaco } from '@monaco-editor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { editor } from 'monaco-editor';

import styles from './CommitInfo.module.scss';
import { TreeLink, CommitFilter, FileContents, ActiveCommitData } from '../MainApp';
import { CommitData } from '../CommitParser/parse_commits';

monaco.config({
	urls: {
		monacoLoader: '/vs/loader.js',
		monacoBase: '/vs',
	},
});

declare global {
	interface Window {
		monaco: Monaco;
	}
}

export interface CommitInfoProps {
	loadFileDiff(
		repo: string,
		sha: string,
		previousSha: string,
		path: string,
		el?: HTMLElement
	): void;
	loadFile(repo: string, sha: string, path: string, el: HTMLElement): void;

	searchQuery: string;

	diffsLoaded: number;

	addLinks(links: TreeLink[]): void;
	setLinks(links: TreeLink[]): void;
	links: TreeLink[];

	commitFilter: CommitFilter;
	setCommitFilter(repo: string, commitFilter: CommitFilter): void;

	navigationTarget: string;
	repoPrefix: string;
	branch: string;

	closeFile(): void;
	loadDiff(repo: string, commit: Commit): Promise<void>;

	activeCommitData?: ActiveCommitData;

	commitData?: CommitData;

	fileContents?: FileContents;

	commitsVisible: boolean;
	setCommitsVisible: (visible: boolean) => void;

	path: string;
}

interface CommitInfoState {
	authorSort: string;
	commitFilter?: CommitFilter;
	diffEditor: any;
	editor: any;
}

export class CommitInfo extends React.Component<CommitInfoProps, CommitInfoState> {
	searchTimeout: number;

	constructor(props: CommitInfoProps) {
		super(props);
		this.state = {
			diffEditor: null,
			editor: null,
			authorSort: 'commits',
			commitFilter: undefined,
		};
		this.searchTimeout = 0;
	}

	showFile = (sha: string, previousSha: string, path: string, el: HTMLElement) => {
		if (previousSha) this.props.loadFileDiff(this.props.repoPrefix, sha, previousSha, path, el);
		else this.props.loadFile(this.props.repoPrefix, sha, path, el);
	};

	pad2(v: string) {
		if (v.length === 1) return '0' + v;
		return v;
	}

	setDateFilter(date: string) {
		if (this.props.commitFilter.date === date)
			this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
				...this.props.commitFilter,
				date: undefined,
			});
		else
			this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
				...this.props.commitFilter,
				date,
			});
	}

	onYearClick: CalendarMouseEventHandler = (ev) => {
		const target = ev.target as CalendarElement;
		if (target.classList.contains('calendar-year')) {
			this.setDateFilter(target.dataset.year || '');
		}
	};
	onMonthClick: CalendarMouseEventHandler = (ev) => {
		const target = ev.target as CalendarElement;
		if (target.classList.contains('calendar-month') && target.parentElement) {
			this.setDateFilter(
				(target.parentElement.dataset.year || '') +
					'-' +
					this.pad2(target.dataset.month || '')
			);
		}
	};
	onDayClick: CalendarMouseEventHandler = (ev) => {
		const target = ev.target as CalendarElement;
		this.setDateFilter(target.dataset.fullDate || '');
	};

	getFileURL = (file: CommitFile) => {
		return this.props.path + '/' + (file.renamed || file.path);
	};

	updateActiveCommitSetDiffs(activeCommits: Commit[]) {
		const el = document.getElementById('commitList');
		if (!el) return;
		while (el.firstChild) el.removeChild(el.firstChild);
		if (!activeCommits) return;
		el.dataset.count = activeCommits.length.toString();

		const calendar = createCalendar(
			activeCommits,
			this.onYearClick,
			this.onMonthClick,
			this.onDayClick
		);
		el.appendChild(calendar);

		const commitHeight = 30;

		const commitsEl = document.createElement('div');
		commitsEl.className = styles['commits'];
		commitsEl.style.position = 'relative';
		commitsEl.style.height = commitHeight * activeCommits.length + 'px';

		var visible: { [propType: number]: HTMLElement } = {};

		// If div height > 1Mpx, switch over to 1Mpx high scroll div for jumping big chunks + onwheel to fine-tune.
		// The scroll is pretty useless at that point anyhow, so it doesn't need "scroll this for long enough and you'll see all the commits"
		// Deal with showing diff details, show them in a different element.

		if (!el.parentElement) return;

		el.parentElement.onscroll = function(ev) {
			if (!el.parentElement) return;
			var bbox = el.parentElement.getBoundingClientRect();
			var startIndex =
				Math.max(0, bbox.top - commitsEl.getBoundingClientRect().top) / commitHeight;
			var startIndexInt = Math.floor(startIndex);
			var endIndexInt = Math.min(
				activeCommits.length - 1,
				Math.ceil(startIndex + bbox.height / commitHeight)
			);
			for (var i = startIndexInt; i <= endIndexInt; i++) {
				if (!visible[i]) {
					visible[i] = makeCommit(
						activeCommits[i],
						i * commitHeight,
						activeCommits[i + 1]
					);
					commitsEl.appendChild(visible[i]);
				}
			}
			for (var n in visible) {
				const ni = parseInt(n);
				if (ni < startIndexInt || ni > endIndexInt) {
					visible[n].remove();
					delete visible[n];
				}
			}
		};

		const trackedPaths = [
			this.props.navigationTarget.slice(
				this.props.repoPrefix.length + this.props.branch.length + 2
			),
		];
		const trackedIndex: { [propType: string]: boolean } = {};
		trackedIndex[this.props.navigationTarget] = true;

		for (var i = 0; i < activeCommits.length; i++) {
			const files = activeCommits[i].files;
			for (var j = 0; j < files.length; j++) {
				const file = files[j];
				if (file.renamed === 'dev/null') continue;
				const dstPath = file.renamed || file.path;
				for (var k = 0; k < trackedPaths.length; k++)
					if (dstPath.startsWith(trackedPaths[k])) break;
				const inPath = k !== trackedPaths.length;
				if (inPath) {
					var path = dstPath;
					if (!trackedIndex[path]) {
						trackedPaths.push(path);
						trackedIndex[path] = true;
					}
					if (file.renamed) {
						path = file.path;
						if (!trackedIndex[path]) {
							trackedPaths.push(path);
							trackedIndex[path] = true;
						}
					}
				}
			}
		}

		const makeCommit = (c: Commit, top: number, previousCommit: Commit) => {
			var div = document.createElement('div');
			div.style.position = 'absolute';
			div.style.top = top + 'px';
			var hashSpan = span(styles['commit-hash'], c.sha);
			var dateSpan = span(styles['commit-date'], c.date.toUTCString());
			var authorSpan = span(styles['commit-author'], c.author);
			var messageSpan = span(styles['commit-message'], c.message);
			var toggleDiffs = span(styles['commit-toggle-diffs'], 'All changes');
			div.onmouseenter = (ev) => {
				this.props.setLinks(
					c.files.map((f) => ({
						src: div,
						dst: this.getFileURL(f),
						color: { r: 0, g: 1, b: 0 },
					}))
				);
			};
			div.onmouseleave = (ev) => {
				this.props.setLinks([]);
			};
			div.onmousedown = async (ev) => {
				ev.preventDefault();
				const diffView = document.getElementById('diffView');
				if (!diffView) return;
				this.props.closeFile();
				if (
					diffView.firstChild &&
					diffView.firstChild.textContent === hashSpan.textContent
				) {
					while (diffView.firstChild) diffView.removeChild(diffView.firstChild);
					return;
				}
				while (diffView.firstChild) diffView.removeChild(diffView.firstChild);
				if (c.diff === undefined) await this.props.loadDiff(this.props.repoPrefix, c);
				diffView.classList.remove(styles['expanded-diffs']);
				diffView.classList.add(styles['expanded']);
				const diffSpan = span(styles['commit-diff']);
				diffSpan.appendChild(
					formatDiff(
						c.sha,
						c.diff || '',
						trackedPaths,
						previousCommit && previousCommit.sha,
						this.showFile
					)
				);
				diffView.append(
					hashSpan.cloneNode(true),
					dateSpan.cloneNode(true),
					authorSpan.cloneNode(true),
					messageSpan.cloneNode(true),
					toggleDiffs,
					diffSpan
				);
			};
			toggleDiffs.onmousedown = function(ev) {
				ev.preventDefault();
				if (!toggleDiffs.parentElement) return;
				toggleDiffs.parentElement.classList.toggle(styles['expanded-diffs']);
			};
			div.append(hashSpan, dateSpan, authorSpan, messageSpan);
			return div;
		};

		el.appendChild(commitsEl);
		setTimeout(() => {
			if (el && el.parentElement && el.parentElement.onscroll) {
				el.parentElement.onscroll(new MouseEvent('scroll'));
			}
		}, 10);
	}

	updateActiveCommitSetAuthors(
		authors: string[],
		authorCommitCounts: { [propType: string]: number },
		activeCommits: Commit[],
		authorSort = this.state.authorSort
	) {
		var el = document.getElementById('authorList')!;
		while (el.firstChild) el.removeChild(el.firstChild);
		if (!authors) return;
		el.dataset.count = authors.length.toString();
		switch (authorSort) {
			case 'name':
				authors.sort((a, b) => a.localeCompare(b));
				break;
			case 'email':
				authors.sort((a, b) => a.localeCompare(b));
				break;
			case 'commits':
				authors.sort((a, b) => authorCommitCounts[b] - authorCommitCounts[a]);
				break;
			case 'date':
				authors.sort((a, b) => a.localeCompare(b));
				break;
			default:
				authors.sort((a, b) => a.localeCompare(b));
		}
		var runningCommitCount = 0;
		var added50 = false,
			added80 = false,
			added95 = false;
		let authorCount50 = 0,
			authorCount80 = 0,
			authorCount95 = 0;
		authors.forEach((author, i) => {
			const div = document.createElement('div');
			div.dataset.commitCount = authorCommitCounts[author].toString();
			const nameSpan = span(styles['author-name'], author);
			div.append(nameSpan);
			div.onmousedown = (ev) => {
				ev.preventDefault();
				if (this.props.commitFilter.author === author)
					this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
						...this.props.commitFilter,
						author: undefined,
					});
				else
					this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
						...this.props.commitFilter,
						author,
					});
			};
			el.appendChild(div);
			runningCommitCount += authorCommitCounts[author];
			if (authorSort === 'commits') {
				if (runningCommitCount >= activeCommits.length * 0.95 && !added95) {
					added50 = added80 = added95 = true;
					authorCount95 = i + 1;
					el.appendChild(span(styles.commits95Pct));
				} else if (runningCommitCount >= activeCommits.length * 0.8 && !added80) {
					added50 = added80 = true;
					authorCount80 = i + 1;
					el.appendChild(span(styles.commits80Pct));
				} else if (runningCommitCount >= activeCommits.length * 0.5 && !added50) {
					added50 = true;
					authorCount50 = i + 1;
					el.appendChild(span(styles.commits50Pct));
				}
			}
		});
		if (authorCount95 === 0) authorCount95 = authors.length;
		if (authorCount80 === 0) authorCount80 = authorCount95;
		if (authorCount50 === 0) authorCount50 = authorCount80;
		el.dataset.pct50 =
			(Math.round((authorCount50 / authors.length) * 1000) / 10).toString() + '%';
		el.dataset.pct80 =
			(Math.round((authorCount80 / authors.length) * 1000) / 10).toString() + '%';
		el.dataset.pct95 =
			(Math.round((authorCount95 / authors.length) * 1000) / 10).toString() + '%';
	}

	toggleVisible = (ev: MouseEvent) => {
		this.props.setCommitsVisible(!this.props.commitsVisible);
	};

	shouldComponentUpdate(nextProps: CommitInfoProps, nextState: CommitInfoState) {
		if (nextProps.activeCommitData && nextProps.commitData) {
			if (nextProps.activeCommitData !== this.props.activeCommitData) {
				const { authors, commits, authorCommitCounts } = nextProps.activeCommitData;
				const diffView = document.getElementById('diffView')!;
				while (diffView.firstChild) diffView.removeChild(diffView.firstChild);
				this.updateActiveCommitSetAuthors(authors, authorCommitCounts, commits);
				this.updateActiveCommitSetDiffs(commits);
			} else if (nextState.authorSort !== this.state.authorSort) {
				const { authors, commits, authorCommitCounts } = nextProps.activeCommitData;
				this.updateActiveCommitSetAuthors(
					authors,
					authorCommitCounts,
					commits,
					nextState.authorSort
				);
			}
		} else {
			this.updateActiveCommitSetAuthors([], {}, []);
			this.updateActiveCommitSetDiffs([]);
		}
		if (nextProps.fileContents !== this.props.fileContents && nextProps.fileContents) {
			if (nextState.diffEditor && nextProps.fileContents.original) {
				const model = nextState.diffEditor.getModel();
				model.original.setValue(this.arrayBufferToString(nextProps.fileContents.original));
				model.modified.setValue(this.arrayBufferToString(nextProps.fileContents.content));
			} else if (nextState.editor && nextProps.fileContents.content) {
				nextState.editor
					.getModel()
					.setValue(this.arrayBufferToString(nextProps.fileContents.content));
			}
		}
		return true;
	}

	arrayBufferToString(buffer: ArrayBuffer | undefined): string {
		if (buffer === undefined) return '';
		return new TextDecoder().decode(buffer);
	}

	handleDiffEditorDidMount = (_: any, _editor: any, diffEditor: any) => {
		if (!this.props.fileContents) return;
		const original = window.monaco.editor.createModel(
			this.arrayBufferToString(this.props.fileContents.original),
			undefined,
			window.monaco.Uri.file('a/' + this.props.fileContents.path)
		);
		const modified = window.monaco.editor.createModel(
			this.arrayBufferToString(this.props.fileContents.content),
			undefined,
			window.monaco.Uri.file('b/' + this.props.fileContents.path)
		);
		diffEditor.setModel({ original, modified });
		diffEditor.onDidDispose(() => {
			this.setState({ diffEditor: null });
			original.dispose();
			modified.dispose();
		});
		this.setState({ diffEditor, editor: null });
	};

	handleEditorDidMount = (_: any, editor: any) => {
		if (!this.props.fileContents) return;
		const model = window.monaco.editor.createModel(
			this.arrayBufferToString(this.props.fileContents.content),
			undefined,
			window.monaco.Uri.file(this.props.fileContents.path)
		);
		editor.setModel(model);
		editor.onDidDispose(() => {
			model.dispose();
			this.setState({ editor: null });
		});
		this.setState({ diffEditor: null, editor });
	};

	authorSearchOnChange = (event: React.FormEvent<any>): void => {
		const authorSearch = (event.target! as HTMLInputElement).value;
		clearTimeout(this.searchTimeout);

		this.searchTimeout = setTimeout(
			(() =>
				this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
					...this.state.commitFilter,
					authorSearch,
				})) as TimerHandler,
			200
		);
	};

	commitSearchOnChange = (event: React.FormEvent<any>): void => {
		const search = (event.target! as HTMLInputElement).value;
		clearTimeout(this.searchTimeout);
		this.searchTimeout = setTimeout(
			(() =>
				this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
					...this.state.commitFilter,
					search,
				})) as TimerHandler,
			200
		);
	};

	sortByName = () => this.setState({ authorSort: 'name' });
	sortByEmail = () => this.setState({ authorSort: 'email' });
	sortByCommits = () => this.setState({ authorSort: 'commits' });
	sortByDate = () => this.setState({ authorSort: 'date' });
	hideCommitsPane = () => this.props.setCommitsVisible(false);

	onShowFileCommits = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		this.props.setCommitsVisible(true);
		this.props.setCommitFilter(this.props.repoPrefix + '/' + this.props.branch, {
			path: this.props.navigationTarget,
		});
	};

	getFileCommits(path: string, hash: string): { path: string; commit: Commit }[] {
		if (!this.props.commitData) return [];
		const arr = [];
		const commits = this.props.commitData.commits;
		let currentPath = path;
		for (let i = 0; i < commits.length; i++) {
			const c = commits[i];
			if (c.sha === hash) {
				for (let j = i; j >= 0; j--) {
					const cc = commits[j];
					for (let k = 0; k < cc.files.length; k++) {
						const f = cc.files[k];
						if (f.renamed && f.path === currentPath) {
							currentPath = f.renamed;
						}
					}
				}
				break;
			}
		}
		for (let i = 0; i < commits.length; i++) {
			const c = commits[i];
			for (let j = 0; j < c.files.length; j++) {
				const f = c.files[j];
				if (f.renamed !== undefined && f.renamed === currentPath) {
					currentPath = f.path;
				}
				if (f.path === currentPath) {
					arr.push({ path: currentPath, commit: c });
					break;
				}
			}
		}
		return arr;
	}

	previousFileVersion = (): void => {
		if (!this.props.fileContents) return;
		const fileCommits = this.getFileCommits(
			this.props.fileContents.path,
			this.props.fileContents.hash
		);
		const hash = this.props.fileContents.hash;
		const idx = fileCommits.findIndex(({ commit }) => commit.sha === hash);
		if (idx < fileCommits.length - 1) {
			const { path, commit } = fileCommits[idx + 1];
			const previous = idx + 2 <= fileCommits.length ? fileCommits[idx + 2] : undefined;
			this.props.loadFileDiff(
				this.props.repoPrefix,
				commit.sha,
				previous ? previous.commit.sha : '00000000',
				path
			);
		}
	};

	nextFileVersion = (): void => {
		if (!this.props.fileContents) return;
		const fileCommits = this.getFileCommits(
			this.props.fileContents.path,
			this.props.fileContents.hash
		);
		const hash = this.props.fileContents.hash;
		const idx = fileCommits.findIndex(({ commit }) => commit.sha === hash);
		if (idx > 0) {
			const { path, commit } = fileCommits[idx];
			const previous = fileCommits[idx - 1];
			this.props.loadFileDiff(
				this.props.repoPrefix,
				previous ? previous.commit.sha : '00000000',
				commit.sha,
				path
			);
		}
	};

	render() {
		const { authorSort } = this.state;
		return (
			<>
				<Button
					id="showFileCommits"
					className={styles.showFileCommits}
					onClick={this.onShowFileCommits}
					data-filename={'frontend/' + __filename.replace(/\\/g, '/')}
				>
					Show commits
				</Button>
				<div
					id="commitInfo"
					className={
						styles.CommitInfo +
						' ' +
						(this.props.commitsVisible ? styles.visible : styles.hidden)
					}
					data-filename={'frontend/' + __filename.replace(/\\/g, '/')}
				>
					<div className="close" onClick={this.hideCommitsPane}>
						<FontAwesomeIcon icon={faTimes} />
					</div>
					<div id="authors" className={styles.authors}>
						<h3>Authors</h3>
						<Form.Group id="authorSearch">
							<Form.Control onChange={this.authorSearchOnChange} />
						</Form.Group>
						<div id="authorSort" className={styles.authorSort}>
							Sort by
							<span
								onClick={this.sortByName}
								className={authorSort === 'name' ? styles.selected : undefined}
							>
								Name
							</span>
							<span
								onClick={this.sortByEmail}
								className={authorSort === 'email' ? styles.selected : undefined}
							>
								Email
							</span>
							<span
								onClick={this.sortByCommits}
								className={authorSort === 'commits' ? styles.selected : undefined}
							>
								Commits
							</span>
							<span
								onClick={this.sortByDate}
								className={authorSort === 'date' ? styles.selected : undefined}
							>
								Date
							</span>
						</div>
						<div id="authorList" className={styles.authorList} />
					</div>
					<div id="activeCommits" className={styles.activeCommits}>
						<h3>Commits</h3>
						<Form.Group id="commitSearch" className={styles.commitSearch}>
							<Form.Control onChange={this.commitSearchOnChange} />
						</Form.Group>
						<div id="commitList" className={styles.commitList} />
					</div>
					<div id="diffView" className={styles.diffView} />
				</div>
				{this.props.fileContents && (
					<div id="fileView" className={styles.fileView}>
						<h4>
							<span className="hash">{this.props.fileContents.hash}</span>
							&mdash;
							<span className="message">
								{this.props.commitData
									? this.props.commitData.commitIndex[
											this.props.fileContents.hash
									  ].message.split('\n')[0]
									: ''}
							</span>
						</h4>
						<h3>{this.props.fileContents.path}</h3>
						<div className="file-version-nav">
							<button onClick={this.previousFileVersion}>
								<FontAwesomeIcon icon={faArrowDown} />
							</button>
							<button onClick={this.nextFileVersion}>
								<FontAwesomeIcon icon={faArrowUp} />
							</button>
						</div>
						<div className="close" onClick={this.props.closeFile}>
							<FontAwesomeIcon icon={faTimes} />
						</div>
						{this.props.fileContents.original ? (
							<DiffEditor
								editorDidMount={this.handleDiffEditorDidMount}
								options={
									{
										model: null,
									} as editor.IDiffEditorConstructionOptions
								}
							/>
						) : (
							<Editor
								editorDidMount={this.handleEditorDidMount}
								options={
									{
										model: null,
									} as editor.IEditorConstructionOptions
								}
							/>
						)}
					</div>
				)}
			</>
		);
	}
}

export default CommitInfo;
