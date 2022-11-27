export function mapData(products) {
    return products.map((product, index) => {
      let image = '';
      if (product?.small_image?.url) {
        image = product.small_image.url;
      }
      return {
        sku: product.sku,
        image: image,
        id: product.uid,
        name: product.name
      }
    });
  }