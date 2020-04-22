import * as Comlink from 'comlink';
import { PrettyPrintGeometry } from './PrettyPrinter.worker';
import Text from '../Text/Text';
import * as THREE from 'three';

/* eslint-disable import/no-webpack-loader-syntax */
import PrettyPrintWorker from 'worker-loader!./PrettyPrinter.worker';
// eslint-disable-next-line
import { PrettyPrinter as ForcePrettyPrinterTypeCheck } from './PrettyPrinter.worker';

export class PrettyPrinter {
	workers: any[] = [];
	workerIndex: number = 0;
	fontInitialized: boolean = false;

	constructor(workerCount: number = 10) {
		for (let i = 0; i < workerCount; i++) {
			this.workers.push(Comlink.wrap(new PrettyPrintWorker()));
		}
	}

	getWorker() {
		const worker = this.workers[this.workerIndex++];
		if (this.workerIndex >= this.workers.length) {
			this.workerIndex = 0;
		}
		return worker;
	}

	async prettyPrint(
		buffer: ArrayBuffer,
		filename: string,
		mimeType?: string
	): Promise<PrettyPrintGeometry> {
		if (!Text.font) throw new Error('Font not loaded');
		if (!this.fontInitialized) {
			this.fontInitialized = true;
			this.workers.forEach((w) => w.setFont(Text.font));
		}
		const result = await this.getWorker().prettyPrint(
			Comlink.transfer(buffer, [buffer]),
			filename,
			mimeType
		);
		if (result.palette) {
			result.palette = result.palette.map(
				(v: { x: number; y: number; z: number }) => new THREE.Vector3(v.x, v.y, v.z)
			);
		}
		return result;
	}
}

export default new PrettyPrinter();
