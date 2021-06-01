import { c as createWorker } from './jmespath-edit-compare-5996f5bd.js';
import './index-83385c20.js';
import './index-b0322d8c.js';

const workerName = 'metrichor-jmespath.worker';
const workerMsgId = 'stencil.metrichor-jmespath.worker';
const workerPath = /*@__PURE__*/new URL('metrichor-jmespath.worker-fa927162.js', import.meta.url).href;
const blob = new Blob(['importScripts("' + workerPath + '")'], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
const worker = /*@__PURE__*/createWorker(url, workerName, workerMsgId);
URL.revokeObjectURL(url);

export { worker, workerMsgId, workerName, workerPath };
