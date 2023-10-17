import { transformParam } from './paramTransformer';
import { QueryOptions } from '../types/queryOptions';
import { MagentoProductsResponse } from '../types/magentoProductsResponse';

export const fetchProductsByQuery = async function (path: string, param: string, accessToken: string, offset: number): Promise<MagentoProductsResponse | null> {
  const options: QueryOptions = {
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