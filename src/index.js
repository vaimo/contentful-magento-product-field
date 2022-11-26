import './index.css';
import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import { init } from '@contentful/app-sdk';
import { useStore } from './api/useStore';
import logo from './magento-icon.svg';

const DIALOG_ID = 'root';
const PER_PAGE = 20;
const { getQueryResult } = useStore();

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

function mapData(products) {
  return products.map((product, index) => {
    let image = '';
    if (product?.small_image?.url) {
      image = product.small_image.url;
    }
    return {
      sku: '' + product.sku,
      image: image,
      id: '' + product.uid,
      name: product.name
    }
  });
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

async function openDialog(sdk, currentValue, config) {
  const skus = await sdk.dialogs.openCurrentApp({
    parameters: { config, value: currentValue },
    position: 'center',
    title: 'Magento Products',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 800,
    allowHeightOverflow: true,
  });
  let result = Array.isArray(skus) ? skus : [];
  return Array.isArray(currentValue) ? [...result, ...currentValue] : result;
}

function validateParameters({ apiKey, endpoint }) {
  if (!apiKey) {
    return 'Please add an API Key';
  }

  if (!endpoint) {
    return 'Please add an endpoint';
  }

  return null;
}

init ((sdk) => {
  sdk.parameters.installation.skuTypes =
    sdk.parameters.installation.skuTypes ?? sdk.parameters.installation.fieldsConfig;

    setup({
      makeCTA: () => 'Select a product',
      name: 'Magento Product -> Contentful Field',
      logo: logo,
      color: '#036FE3',
      description:
        'Search and insert product SKU from Magento in Contentful',
      parameterDefinitions: [
        {
          id: 'apiKey',
          type: 'Symbol',
          name: 'API Key',
          description: 'Provide the API Key here',
          required: true,
        },
        {
          id: 'endpoint',
          type: 'Symbol',
          name: 'API Endpoint URL',
          description: 'Provide the Project API Endpoint URL',
          required: true,
        }
      ],
      validateParameters,
      fetchProductPreviews,
      renderDialog,
      openDialog,
      isDisabled: () => false,
    });
});
