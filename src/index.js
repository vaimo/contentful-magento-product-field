import './index.css';
import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import { useStore } from './api/useStore';
import logo from './magento-icon.svg';

const DIALOG_ID = 'root';
const PER_PAGE = 20;
const { getQueryResult } = useStore();
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
  let products = await getCachedPreviews(parameters);
  let filteredResult = products.filter((product) => skus.includes(product.sku));
  if (products.length === 0 || filteredResult.length !== skus.length) {
    for (const element of skus) {
      await getQueryResult(
        parameters.endpoint,
        parameters.apiKey,
        0,
        element
      );
    }
    products = await getCachedPreviews(parameters);
  }
  const previewProducts = mapData(products, parameters);
  filteredResult = previewProducts.filter((product) => skus.includes(product.sku));
  return filteredResult;
}

function mapData(products, parameters) {
  return products.map((product, index) => {
    let image = '';
    for (const galleryItem of product.media_gallery_entries) {
      if (galleryItem.file) {
        image = parameters.media + galleryItem.file;
        break;
      }
    }
    return {
      sku: '' + product.sku,
      image: image,
      id: '' + product.id,
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

async function openDialog(sdk, _currentValue, _config) {
  const skus = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: 'Magento Products',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 800,
    allowHeightOverflow: true,
  });

  return Array.isArray(skus) ? skus : [];
}

function validateParameters({ apiKey, endpoint, media }) {
  if (!apiKey) {
    return 'Please add a API Key';
  }

  if (!endpoint) {
    return 'Please add an endpoint';
  }

  if (!media) {
    return 'Please add media path';
  }

  return null;
}
