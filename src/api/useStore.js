import { fetchProductsByQuery } from './fetchProductsByQuery';
export const useStore = () => {
    const store = {};
    const setQueryResult = (query, offset, result) => {
        if (result) {
            if (!store.hasOwnProperty(query))
                store[query] = {};
            store[query][offset] = result;
        }
    };
    const getQueryResult = async (path, accessToken, offset = 0, query = '') => {
        if (typeof offset == 'undefined')
            offset = 0;
        if (store.hasOwnProperty(query) && store[query].hasOwnProperty(offset))
            return store[query][offset];
        setQueryResult(query, offset, await fetchProductsByQuery(path, query, accessToken, offset));
        return store[query][offset];
    };
    return {
        store,
        getQueryResult
    };
};
