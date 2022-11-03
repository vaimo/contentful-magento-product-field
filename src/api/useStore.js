import { fetchProductsByQuery } from './fetchProductsByQuery';

export const useStore = () => {
    const store = {};

    const setQueryResult = (query, offset, result) => {
        if (result) {
            if (!store.hasOwnProperty(query)) store[query] = {};
            store[query][offset] = result;
        }
    }

    const getQueryResult = async (path, accessToken, offset = 0, query = '', cachedOnly = false) => {
        if (typeof offset == 'undefined') offset = 0;
        if (cachedOnly && Object.keys(store).length !== 0) return getAllStoredItemsForPreview();
        if (store.hasOwnProperty(query) && store[query].hasOwnProperty(offset)) return store[query][offset];
        setQueryResult(query, offset, await fetchProductsByQuery(path, query, accessToken, offset));
        return store[query][offset];
    }

    const getAllStoredItemsForPreview = () => {
        let items = [];
        for (let query in store) {
            for (let offset in store[query]) {
                if (store[query][offset]?.items) {
                    items = items.concat(store[query][offset].items)
                }
            }
        }
        return {
            items: items
        };
    }

    return {
        store,
        getQueryResult
    }
}