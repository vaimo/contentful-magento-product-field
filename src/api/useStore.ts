import { fetchProductsByQuery } from './fetchProductsByQuery';
import { MagentoProductsResponse } from '../types/magentoProductsResponse';

export const useStore = () => {
  const store: object = {};

  const setQueryResult = (query: string, offset: number, result: MagentoProductsResponse | null): void => {
    if (result) {
      if (!store.hasOwnProperty(query)) store[query] = {};
      store[query][offset] = result;
    }
  }

  const getQueryResult = async (path: string, accessToken: string, offset: number = 0, query: string = ''): Promise<MagentoProductsResponse | null> => {
    if (typeof offset == 'undefined') offset = 0;
    if (store.hasOwnProperty(query) && store[query].hasOwnProperty(offset)) return store[query][offset];
    setQueryResult(query, offset, await fetchProductsByQuery(path, query, accessToken, offset));
    return store[query][offset];
  }

  return {
    store,
    getQueryResult
  }
}