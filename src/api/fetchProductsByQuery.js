import { transformParam } from './paramTransformer';
export const fetchProductsByQuery = async function (path, param, accessToken, offset) {
    var _a;
    const options = {
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'credentials': 'include'
        },
        method: 'POST'
    };
    const preparedUrl = path;
    options.body = transformParam(param, offset);
    try {
        const result = await fetch(preparedUrl, options);
        const resultJson = await result.json();
        return (_a = resultJson === null || resultJson === void 0 ? void 0 : resultJson.data) === null || _a === void 0 ? void 0 : _a.products;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
