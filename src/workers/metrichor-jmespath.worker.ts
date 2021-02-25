import jmespath, { TreeInterpreter } from '@metrichor/jmespath';

const EXPRESSION_CACHE = {};
export const query = async (path: string, json: string): Promise<string> => {
  if (!(path in EXPRESSION_CACHE)) {
    EXPRESSION_CACHE[path] = jmespath.compile(path);
  }
  const result =  TreeInterpreter.search(EXPRESSION_CACHE[path], JSON.parse(json));
  return JSON.stringify(result, null, 2)
};
