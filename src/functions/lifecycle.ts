import { MagentoProductsResponse } from './../types/magentoProductsResponse';
import { renderSkuPicker } from '@contentful/ecommerce-app-base';
import { useStore } from '../api/useStore';
import { mapData } from './mapData';
import { validateParameters } from './validateParameters';
import { Product } from '@contentful/ecommerce-app-base';
import { Config } from '@contentful/ecommerce-app-base';
import { Pagination } from '@contentful/ecommerce-app-base';

const { getQueryResult } = useStore();
const PER_PAGE = 20;
const DIALOG_ID = 'root';

async function fetchProductPreviews(skus: string[], parameters: Config): Promise<Product[]> {
  if (!skus.length) {
    return [];
  }
  let previewProducts : Product[] = [];
  for (const sku of skus) {
    let products = await getQueryResult(
      parameters.endpoint,
      parameters.apiKey,
      0,
      sku
    );
    previewProducts = previewProducts.concat(
      mapData(
        products?.items ? products.items : [],
        parameters?.mediaPath ? parameters.mediaPath : ''
      )
    );
  }
  let filteredResult = previewProducts.filter((product: Product) => skus.includes(product.sku));
  return filteredResult;
}

async function renderDialog(sdk) {
  const container = document.getElementById(DIALOG_ID);
  if (container) {
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
  }
  
  renderSkuPicker(DIALOG_ID, {
    sdk,
    fetchProductPreviews,
    fetchProducts: async (search: string, pagination?: Partial<Pagination>): Promise<{pagination:Pagination,products:Product[]}> => {
      const result = await fetchSKUs(sdk.parameters.installation, search, pagination);
      const products = result?.items ? result.items : [];
  
      return {
        pagination: {
          count: PER_PAGE,
          limit: PER_PAGE,
          total: result?.total_count ? result.total_count : 0,
          offset: pagination?.offset as number,
        },
        products: mapData(products, sdk.parameters.installation.mediaPath)
      };
    },
  });
  
  sdk.window.startAutoResizer();
}
  
async function fetchSKUs(installationParams: {endpoint: string, apiKey: string, mediaPath: string}, search: string, pagination?: Partial<Pagination>): Promise<MagentoProductsResponse | null> {
  const validationError = validateParameters(installationParams);
  if (validationError) {
    throw new Error(validationError);
  }
  const products = await getQueryResult(
    installationParams.endpoint,
    installationParams.apiKey,
    pagination?.offset,
    search
  );
  
  return products;
}

export { fetchProductPreviews, renderDialog }