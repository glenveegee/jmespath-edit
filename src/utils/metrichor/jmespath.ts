import { search } from '@metrichor/jmespath';

export const query = async (expression: string, json: any) => {
  return search(json, expression);
};
