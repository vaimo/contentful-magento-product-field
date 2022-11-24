export const query = `query products($search: String, $pageSize: Int, $currentPage: Int) {
    products(search: $search, pageSize: $pageSize, currentPage: $currentPage) {
      total_count
      items {
        uid
        name
        sku
        small_image {
          disabled
          label
          position
          url
        }
      }
    }
  }`