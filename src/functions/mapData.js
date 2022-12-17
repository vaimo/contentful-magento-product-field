export function mapData(products) {
    return products.map((product, index) => {
        var _a;
        let image = '';
        if ((_a = product === null || product === void 0 ? void 0 : product.small_image) === null || _a === void 0 ? void 0 : _a.url) {
            image = product.small_image.url;
        }
        return {
            sku: product.sku,
            image: image,
            id: product.uid,
            name: product.name
        };
    });
}
