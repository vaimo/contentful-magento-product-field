import { MagentoProduct } from "../types/magentoProduct";
import { Product } from "@contentful/ecommerce-app-base";

export function mapData(products: MagentoProduct[]): Product[] {
  return products.map((product: MagentoProduct, index: number) => {
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