export const transformParam = (param, offset) => {
  const usedAttributes = ['name', 'sku'];
  const PAGE_SIZE = 20;
  const currentPage = offset ? (PAGE_SIZE + offset) / PAGE_SIZE : 1; 
  const res = [
    ['fields', 'items[id,sku,name,media_gallery_entries]total_count'],
    ['searchCriteria[sortOrders][0][field]', 'id'],
    ['searchCriteria[pageSize]', PAGE_SIZE],
    ['searchCriteria[currentPage]', currentPage]
  ];
  if (param) {
    usedAttributes.forEach((attr, index) => {
      res.push([
        `searchCriteria[filter_groups][0][filters][${index}][field]`, attr
      ]);
      res.push([
        `searchCriteria[filter_groups][0][filters][${index}][value]`, `%${param}%`
      ]);
      res.push([
        `searchCriteria[filter_groups][0][filters][${index}][condition_type]`, "like"
      ])
    });
  } else {
    res
  } 
  //@ts-ignore
  return new URLSearchParams(res).toString();
}