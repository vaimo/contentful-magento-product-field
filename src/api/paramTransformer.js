export const transformParam = (param) => {
    const usedAttributes = ['name', 'sku'];
    const res = [
        ['fields', 'items[id,sku,name]'],
        ['searchCriteria[sortOrders][0][field]', 'id']
    ];
    if (param) {
        usedAttributes.forEach((attr, index) => {
            res.push([
                `searchCriteria[filter_groups][0][filters][${index}][field]`, attr
            ]);
            res.push([
                `searchCriteria[filter_groups][0][filters][${index}][value]`, param
            ]);
            res.push([
                `searchCriteria[filter_groups][0][filters][${index}][condition_type]`, "like"
            ])
        });
    } else {
        res
    } 

    return new URLSearchParams(res).toString();
}