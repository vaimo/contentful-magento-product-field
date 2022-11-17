import { transformParam } from './paramTransformer';

export const fetchProductsByQuery = async function (path, param, accessToken, offset) {
    const options = {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'credentials': 'include'
        },
        method: 'GET'
    };
    const preparedUrl = path += '?' + transformParam(param, offset);
    try {
      const result = await fetch(preparedUrl, options);
      return await result.json();
    } catch (error) {
      console.log(error)
      return null;
    }
}