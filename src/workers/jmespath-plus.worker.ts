import jmespath from 'jmespath-plus';
export const query = async (path: string, json: string): Promise<string> => {
    const result = jmespath.search(JSON.parse(json), path);
    return JSON.stringify(result, null, 2)
};
