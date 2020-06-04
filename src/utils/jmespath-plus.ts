import jmespath from 'jmespath-plus';

export const query = async (expression: string, json: any) => {
  return jmespath.search(json, expression);
};
