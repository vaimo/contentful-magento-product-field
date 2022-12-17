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