import { MagentoProduct } from "./magentoProduct"

export type MagentoProductsResponse = {
    total_count: number,
    items: MagentoProduct[]
}