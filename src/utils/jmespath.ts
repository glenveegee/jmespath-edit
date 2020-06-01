import jmespath from 'jmespath';

export const query = async (expression: string, json: any) => {
  return jmespath.search(json, expression)
}
