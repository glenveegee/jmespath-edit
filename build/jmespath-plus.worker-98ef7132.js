import { c as createWorker } from './jmespath-edit-compare-5996f5bd.js';
import './index-83385c20.js';
import './index-b0322d8c.js';

const workerName = 'jmespath-plus.worker';
const workerMsgId = 'stencil.jmespath-plus.worker';
const workerPath = /*@__PURE__*/new URL('jmespath-plus.worker-51a33b40.js', import.meta.url).href;
const blob = new Blob(['importScripts("' + workerPath + '")'], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
const worker = /*@__PURE__*/createWorker(url, workerName, workerMsgId);
URL.revokeObjectURL(url);

export { worker, workerMsgId, workerName, workerPath };
