import { transformParam } from './paramTransformer';

export const fetchProductsByQuery = async function (path, param, accessToken, offset) {
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
      return resultJson?.data?.products;
    } catch (error) {
      console.log(error)
      return null;
    }
}