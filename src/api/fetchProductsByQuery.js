import { transformParam } from './paramTransformer';

export const fetchProductsByQuery = async function (path, param, accessToken) {
    const options = {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    };
    const preparedUrl = param ? path += '?' + transformParam(param) : path;
    try {
      const result = await fetch(preparedUrl, options);
      const items = await result.json()?.items;
      return items;
    } catch (error) {
      console.log(error)
      return null;
    }
}