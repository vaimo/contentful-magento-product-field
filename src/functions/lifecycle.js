import { renderSkuPicker } from '@contentful/ecommerce-app-base';
import { useStore } from '../api/useStore';
import { mapData } from './mapData';
import { validateParameters } from './validateParameters';

const { getQueryResult } = useStore();
const PER_PAGE = 20;
const DIALOG_ID = 'root';

async function fetchProductPreviews(skus, parameters) {
    if (!skus.length) {
        return [];
    }
    let products = await getQueryResult(
        parameters.endpoint,
        parameters.apiKey,
        0,
        skus.join(' ')
    )
    const previewProducts = mapData(products?.items ? products.items : []);
    let filteredResult = previewProducts.filter((product) => skus.includes(product.sku));
    return filteredResult;
  }

async function getCachedPreviews(parameters) {
    const result = await getQueryResult(
      parameters.endpoint,
      parameters.apiKey,
      0,
      '',
      true
    );
    return result?.items ? result.items : [];
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
      fetchProducts: async (search, pagination) => {
        const result = await fetchSKUs(sdk.parameters.installation, search, pagination);
        const products = result?.items ? result.items : [];
  
        return {
          pagination: {
            count: PER_PAGE,
            limit: PER_PAGE,
            total: result?.total_count ? result.total_count : 0,
            offset: pagination.offset,
          },
          products: mapData(products, sdk.parameters.installation)
        };
      },
    });
  
    sdk.window.startAutoResizer();
  }
  
  async function fetchSKUs(installationParams, search, pagination) {
    const validationError = validateParameters(installationParams);
    if (validationError) {
      throw new Error(validationError);
    }
    const products = await getQueryResult(
      installationParams.endpoint,
      installationParams.apiKey,
      pagination.offset,
      search
    );
  
    return products;
  }

  export { fetchProductPreviews, renderDialog }