import React, { useCallback } from "react";
import {
  FSDirEntry,
  getOrCreateDir,
  createDir,
  createFile,
  Filesystem,
  getFullPath,
  FSEntry,
  getPathEntry
} from "../../Montaan/Filesystems";
import { SwedenCOVIDCases, SwedenRegions } from "./SwedenCOVIDCases";

import { TreeLink, FSState } from "../../Montaan/MainApp";
import Button from "react-bootstrap/Button";
import utils from "../../Montaan/Utils/utils";

import Form from "react-bootstrap/Form";

class CasesFilesystem extends Filesystem {
  graphVisible: boolean = false;
  currentDate: string;
  dates: string[];
  trees: Map<string, FSDirEntry>;

  constructor(mountPoint: FSEntry) {
    super(undefined);
    this.mountPoint = mountPoint;
    this.dates = Array.from(SwedenCOVIDCases.keys());
    this.currentDate = this.dates[this.dates.length - 1];
    this.trees = new Map();
    // this.dates.forEach((d) => this.trees.set(d, this.getDayTree(d)));
    this.useDayTree(this.currentDate);
  }

  async readDir(path: string) {
    return null;
  }

  setLinks = (links: TreeLink[]) => {};
  navigationTarget = "";

  onClick = () => {
    this.graphVisible = !this.graphVisible;
    if (this.graphVisible) {
      this.setLinks(SwedenCOVIDCaseLinks);
    } else {
      this.setLinks([]);
    }
  };

  requestFrame() {}

  getDayTree(date: string) {
    const tree = new FSDirEntry("");
    const cases = SwedenCOVIDCases.get(date);
    if (!cases) return tree;
    const dayCases = new Map<string, { cases: number; deaths: number }>(
      cases.entries()
    );
    const caseList: string[] = [];
    let populationCounter = 0;
    const populationBlockSize = 1000;
    for (let region of SwedenRegions.entries()) {
      const lauName = region[0];
      const population = region[1];
      const covidCounts = dayCases.get(lauName);
      let covidCount = covidCounts ? covidCounts.cases : 0;
      if (covidCount > population) {
        throw new Error("More cases than people");
      }
      if (covidCount > 0) {
        dayCases.delete(lauName);
      }
      const lauEntry = createDir(tree, lauName.replace(/\//g, "|"));
      if (lauEntry.lastIndex < 0) lauEntry.lastIndex = 0;
      lauEntry.lastIndex += covidCount;
      lauEntry.color = [
        (lauEntry.lastIndex > 0 ? 0.1 : 0) +
          Math.min(0.4, (1000 * lauEntry.lastIndex) / population),
        lauEntry.lastIndex <= 0
          ? 0.2
          : 0 +
            Math.max(
              0,
              Math.min(0.4, 1 - (1000 * lauEntry.lastIndex) / population)
            ),
        0.0
      ];
      for (let i = 0; i < population; i += populationBlockSize) {
        const populationEntry = createDir(lauEntry, i.toString());
        populationEntry.color = [
          (covidCount > 0 ? 0.2 : 0) +
            0.5 * Math.min(populationBlockSize, covidCount) * 0.01,
          0.0,
          0.0
        ];
        populationEntry.filesystem = new PeopleFilesystem(
          populationCounter,
          Math.min(populationBlockSize, population - i),
          covidCount
        );
        populationEntry.filesystem.mountPoint = populationEntry;
        // addCasesToCaseList(
        // 	caseList,
        // 	getFullPath(populationEntry),
        // 	populationCounter,
        // 	Math.min(populationBlockSize, covidCount)
        // );
        covidCount -= populationBlockSize;
        covidCount = Math.max(0, covidCount);

        populationCounter += Math.min(populationBlockSize, population - i);
      }
    }
    utils.traverseFSEntry(
      tree,
      fsEntry => (fsEntry.fetched = fsEntry.filesystem === undefined),
      ""
    );
    // SwedenCOVIDCaseLinks.splice(0);
    // const caseLinks = convertCaseListToLinks(caseList);
    // for (let i = 0; i < caseLinks.length; i++) {
    // 	SwedenCOVIDCaseLinks.push(caseLinks[i]);
    // }
    return tree;
  }

  useDayTree(date: string) {
    let dayTree = this.trees.get(date);
    if (!dayTree) {
      dayTree = this.getDayTree(date);
      this.trees.set(date, dayTree);
    }
    if (this.mountPoint) {
      this.mountPoint.entries = dayTree.entries;
    }
  }

  setDate = (date: string) => {
    this.currentDate = date;
    this.useDayTree(date);
    this.requestFrame();
  };

  getUIComponents(state: FSState) {
    this.setLinks = state.setLinks;
    this.navigationTarget = state.navigationTarget;
    this.requestFrame = state.requestFrame;
    return (
      <div
        style={{ position: "fixed", top: "80px", left: "10px", zIndex: 10000 }}
        key={this.mountPoint ? getFullPath(this.mountPoint) : "cases"}
      >
        {/* <Button onClick={this.onClick}>Show graph</Button> */}
        <DateSlider
          dates={this.dates}
          currentDate={this.currentDate}
          setDate={this.setDate}
        />
      </div>
    );
  }
}

const DateSlider = ({
  dates,
  currentDate,
  setDate
}: {
  dates: string[];
  currentDate: string;
  setDate: (date: string) => void;
}) => {
  const dateIndex = dates.indexOf(currentDate);
  const noPreviousDate = dateIndex <= 0;
  const noNextDate = dateIndex >= dates.length - 1;
  const setDateCallback = useCallback(
    ev => setDate(dates[parseInt(ev.target.value)]),
    [dates, setDate]
  );
  const previousDate = useCallback(ev => setDate(dates[dateIndex - 1]), [
    dates,
    setDate,
    dateIndex
  ]);
  const nextDate = useCallback(ev => setDate(dates[dateIndex + 1]), [
    dates,
    setDate,
    dateIndex
  ]);
  return (
    <Form>
      <Form.Group controlId="formBasicRangeCustom">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="range"
          min={0}
          max={dates.length - 1}
          step={1}
          value={dateIndex.toString()}
          onChange={setDateCallback}
        />
        <Form.Label>{currentDate}</Form.Label>
        <Form.Group>
          <Button size="sm" onClick={previousDate} disabled={noPreviousDate}>
            Previous
          </Button>
          &nbsp;
          <Button size="sm" onClick={nextDate} disabled={noNextDate}>
            Next
          </Button>
        </Form.Group>
      </Form.Group>
    </Form>
  );
};

class PeopleFilesystem extends Filesystem {
  startIndex: number;
  count: number;
  covidCount: number;

  constructor(startIndex: number, count: number, covidCount: number) {
    super(undefined);
    this.startIndex = startIndex;
    this.count = count;
    this.covidCount = covidCount;
  }

  async readDir(path: string): Promise<FSDirEntry | null> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tree = new FSDirEntry();
        const segments = path.split("/");
        if (segments.length === 1) {
          for (
            let i = this.startIndex, l = this.startIndex + this.count, j = 0;
            i < l;
            i += 10, j += 10
          ) {
            const tenEntry = createDir(tree, i.toString());
            tenEntry.color = j < this.covidCount ? [0.5, 0, 0] : [0, 0, 0];
          }
        } else if (segments.length === 2) {
          for (
            let i = parseInt(segments[1]),
              l = this.startIndex + this.count,
              j = i - this.startIndex,
              k = 0;
            i < l && k < 10;
            i++, j++, k++
          ) {
            const personEntry = createFile(tree, i.toString());
            personEntry.color = j < this.covidCount ? [0.75, 0, 0] : [0, 0, 0];
            // 		0.65 + 0.35 * Math.sin(i * 0.2),
            // 		0.65 + 0.35 * Math.cos(i * 0.17418),
            // 		0.65 + 0.35 * Math.sin(i * 0.041),
            //   ];
          }
        }
        resolve(tree);
      }, 5 + 10 * Math.random());
    });
  }

  okResponses = ["o_o", "^_^", "~_^", "@_@", "o_~", "~_o", "T_T", ">_<", "^.^"];
  caseResponses = ["=_=", "-,-", "U_U", "-_-", "._.", "+_+", "o.o", "\\o/"];
  async readFile(path: string) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      setTimeout(() => {
        let response = this.okResponses[
          Math.floor(Math.random() * this.okResponses.length)
        ];
        if (this.mountPoint) {
          const fsEntry = getPathEntry(this.mountPoint, path);
          if (fsEntry && fsEntry.color && fsEntry.color[0] > 0) {
            response = this.caseResponses[
              Math.floor(Math.random() * this.caseResponses.length)
            ];
          }
        }
        resolve(new TextEncoder().encode(response).buffer);
      }, 10);
    });
  }
}

function addCasesToCaseList(
  caseList: string[],
  pathPrefix: string,
  startIndex: number,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    const path = "/NUTS" + pathPrefix + "/" + (startIndex + i).toString();
    caseList.push(path);
  }
}

function convertCaseListToLinks(caseList: string[]): TreeLink[] {
  const links: TreeLink[] = [];
  for (let i = 0, j = 1; i < caseList.length && j < caseList.length; i++) {
    for (let k = 0; k < 3 && j < caseList.length; k++, j++) {
      links.push({
        src: caseList[i],
        dst: caseList[j],
        color: {
          r: 0.2 + 0.03 * Math.pow(j, 1 / 3),
          g: 0.3,
          b: 0.7 - 0.03 * Math.pow(j, 1 / 3)
        }
      });
    }
  }
  return links;
}

const tree = new FSDirEntry("Sweden");
tree.filesystem = new CasesFilesystem(tree);
tree.fetched = true;
export const SwedenCOVIDCaseLinks: TreeLink[] = [];
export const SwedenCOVIDTree = tree;
