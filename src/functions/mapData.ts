import { MagentoProduct } from "../types/magentoProduct";
import { Product } from "@contentful/ecommerce-app-base";

export function mapData(products: MagentoProduct[], mediaPath: string): Product[] {
  return products.map((product: MagentoProduct, index: number) => {
    let image = '';
    if (product?.media_gallery_entries) {
      firstLoop: for (const mediaGalleryEntry of product?.media_gallery_entries) {
        if (!mediaGalleryEntry.disabled) {
          secondLoop:  for (const mediaGalleryType of mediaGalleryEntry.types) {
            if (mediaGalleryType == 'thumbnail') {
              image = mediaPath + mediaGalleryEntry.file;
              break secondLoop;
            }
          }
        }
        if (image) {
          break firstLoop;
        }
      }
    }
    return {
      sku: product.sku,
      image: image,
      id: product.id,
      name: product.name
    }
  });
}