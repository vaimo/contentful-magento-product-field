export type MagentoProduct = {
    id: string,
    name: string,
    sku: string,
    media_gallery_entries: Array<{
        id: number,
        disabled: boolean,
        label: string,
        position: number,
        types: Array<string>,
        file: string
    }>
}