import { search } from '@metrichor/jmespath-plus';

export const query = async (expression: string, json: any) => {
  return search(json, expression);
};
