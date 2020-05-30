import jmespath from 'jmespath';

export const query = async (json: any, expression: string) => {
  console.debug('LIBRARY::JMESPATH', {expression, json});
  return jmespath.search(expression, json)
}
