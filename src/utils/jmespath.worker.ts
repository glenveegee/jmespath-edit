import jmespath from 'jmespath';

export const query = async (json: any, expression: string) => {
  return jmespath.search(expression, json)
}
