import { query } from './query';

export const transformParam = (search, offset) => {
    const pageSize = 20;
    const currentPage = offset ? (pageSize + offset) / pageSize : 1; 
    return JSON.stringify({query, variables: {search, pageSize, currentPage}})
}