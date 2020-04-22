# Montaan/TreeView

The TreeView component is a zoomable dynamic view to the Montaan filesystem tree for navigating and manipulating the contents of the tree.

The TreeView component is used by the MainApp component.

The primary reviewer for TreeView is Ilmari Heikkinen <hei@heichen.hk>.

## Usage

```tsx
<TreeView ... />
```

## Styling

The TreeView component uses [CSS Modules](https://github.com/css-modules/css-modules) for styling. The component stylesheet is at [TreeView.module.css].

Example of using the stylesheet:

```css
.TreeView {
	display: inline-block;

	:global(.hidden) {
		display: block;
		opacity: 0.1;
	}
}

.title {
	color: red;
}
```

```tsx
<div className={this.styles.TreeView}>
	<h1 className={this.styles.title}>Hello from {this.styles.title}!</h1>
	<p className="hidden">
		This P is using the global class <code>.hidden</code>
	</p>
</div>
```

## Assets

Any assets (images, fonts, 3D models, static files, etc.) used by the component are in [assets/]. Import the asset into your script file to get the post-build URL.

```jsx
import myImage from './assets/myImage.svg';
// ...
<img src={myImage}>
```

## API

### Props

```tsx
export interface TreeViewProps extends RouteComponentProps {
	api: QFrameAPI;
	repoPrefix: string;
	fileTree: FileTree;
	commitData: null | CommitData;
	activeCommitData: null | ActiveCommitData;
	commitFilter: any;
	navigationTarget: string;
	searchResults: SearchResult[];
	searchLinesRequest: number;
	diffsLoaded: number;
	addLinks(links: TreeLink[]): void;
	setLinks(links: TreeLink[]): void;
	links: TreeLink[];
	navUrl?: string;
	frameRequestTime: number;
	setNavigationTarget(target: string): void;
	searchQuery: string;
	requestDirs(paths: string[]): void;
	requestDitchDirs(fsEntries: any[]): void;
}
```

### Interfaces

```tsx
export interface TreeViewProps extends RouteComponentProps {
	api: QFrameAPI;
	repoPrefix: string;
	fileTree: FileTree;
	commitData: null | CommitData;
	activeCommitData: null | ActiveCommitData;
	commitFilter: any;
	navigationTarget: string;
	searchResults: SearchResult[];
	searchLinesRequest: number;
	diffsLoaded: number;
	addLinks(links: TreeLink[]): void;
	setLinks(links: TreeLink[]): void;
	links: TreeLink[];
	navUrl?: string;
	frameRequestTime: number;
	setNavigationTarget(target: string): void;
	searchQuery: string;
	requestDirs(paths: string[]): void;
	requestDitchDirs(fsEntries: any[]): void;
}
```

### Declares

```tsx
declare global {
	// eslint-disable-next-line
	namespace JSX {
		interface IntrinsicElements {
			renderPass: any;
			unrealBloomPass: any;
			instancedBufferAttribute: any;
			instancedMesh: any; //ReactThreeFiber.Object3DNode<THREE.InstancedMesh, typeof THREE.InstancedMesh>;
			effectComposer: any; //ReactThreeFiber.Node<EffectComposer, typeof EffectComposer>;
		}
	}
}
```
