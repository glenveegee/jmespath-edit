// import jmespath from 'jmespath';

export const query = async (json: any, expression: string) => {
  console.info({json, expression})
  return [{FOO: "bar"}]
  // return jmespath.search(expression, json)
}
