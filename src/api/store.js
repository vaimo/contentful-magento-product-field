import { fetchProductsByQuery } from './fetchProductsByQuery';

export const useStore = () => {
    const store = {};

    const setQueryResult = (query, result) => {
        if (result) {
            store[query] = result;
        }
    }

    const getQueryResult = (query, path, accessToken) => {
        if (!query) query = 'all';
        if (store.hasOwnProperty(query)) return store[query];
        setQueryResult(query, fetchProductsByQuery(path, query, accessToken));
        return store[query];
    }
}