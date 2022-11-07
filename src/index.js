import './index.css';
import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import { useStore } from './api/useStore';

const DIALOG_ID = 'root';
const PER_PAGE = 20;
const { getQueryResult } = useStore();
setup({
  makeCTA: () => 'Select a product',
  name: 'Magento Product -> Contentful Field',
  logo: 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png',
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
    },
    {
      id: 'media',
      type: 'Symbol',
      name: 'Media',
      description: 'Provide the media path',
      required: false,
    }
  ],
  validateParameters,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

async function fetchProductPreviews(skus, parameters) {
  if (!skus.length) {
    return [];
  }

  const result = await getQueryResult(
    parameters.endpoint,
    parameters.apiKey,
    0,
    '',
    true
  );
  const products = result?.items ? result.items : [];
  const previewProducts = products.map((product, index) => ({
    sku: '' + product.sku,
    image: 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png',
    id: '' + product.id,
    name: product.name
  }));
  return previewProducts.filter((product) => skus.includes(product.sku));
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
        products: products
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

async function openDialog(sdk, _currentValue, _config) {
  const skus = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: 'Diptyque Products',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 800,
    allowHeightOverflow: true,
  });

  return Array.isArray(skus) ? skus : [];
}

function validateParameters({ apiKey, endpoint }) {
  if (!apiKey) {
    return 'Please add a API Key';
  }

  if (!endpoint) {
    return 'Please add an endpoint';
  }

  return null;
}
