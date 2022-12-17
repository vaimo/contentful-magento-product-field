export type MagentoProduct = {
    uid: string,
    name: string,
    sku: string,
    small_image: {
        disabled: boolean,
        label: string,
        position: number,
        url: string
    }
}