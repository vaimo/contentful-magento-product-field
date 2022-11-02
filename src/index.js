import './index.css';
import { setup, renderSkuPicker } from '@contentful/ecommerce-app-base';
import { EntityList } from '@contentful/f36-components';
import { render } from 'react-dom';
import { useEffect, useState } from 'react';
import { fetchProductsByQuery } from './api/fetchProductsByQuery';

const DIALOG_ID = 'root';
const PER_PAGE = 20;

setup({
  makeCTA: () => 'Select a product',
  name: 'Contentful E-Commerce Demo App',
  logo: 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png',
  color: '#036FE3',
  description:
    'This is a sample Application to demonstrate how to make a custom E-commerce application on top of Contentful.',
  parameterDefinitions: [
    {
      id: 'apiKey',
      type: 'Number',
      name: 'API Id',
      description: 'Provide the API Key here',
      required: true,
    },
    {
      id: 'projectId',
      type: 'Number',
      name: 'Project Id',
      description: 'Provide the Project Id here',
      required: true,
    },
  ],
  validateParameters,
  fetchProductPreviews,
  renderDialog,
  openDialog,
  isDisabled: () => false,
});

/**function DialogLocation({ sdk }) {
  const apiKey = sdk.parameters.installation.apiKey;
  const projectId = sdk.parameters.installation.projectId;

  const [products, setProducts] = useState();
  useEffect(async () => {
    const fetchProducts = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );
      return response.json();
    };

    fetchProducts().then(setProducts);
  }, [apiKey, projectId]);

  if (products === undefined) {
    return <div>Please wait</div>;
  }

  return (
    <EntityList>
      {products.map((product) => (
        <EntityList.Item
          key={product.id}
          title={product.title}
          description="Description"
          onClick={() => sdk.close([product.id])}
        />
      ))}
    </EntityList>
  );
}*/

async function fetchProductPreviews(skus, parameters) {
  console.log('<--- preview endpoint --->');
  console.log(skus);
  const apiKey = parameters.apiKey;
  const projectId = parameters.projectId;

  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts'
  );
  const products = await response.json();
  const result = products.map((product, index) => ({
    sku: '' + product.id,
    image: 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png',
    id: '' + product.id,
    name: product.title
  }));
  return result.filter((product) => skus.includes(''+product.id));
}

async function renderDialog(sdk) {
  //render(<DialogLocation sdk={sdk} />, document.getElementById('root'));
  console.log('<-- render dialog section --->')

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
      console.log('<--- fetch Products section --->');
      console.log(result);
      const testImg = 'https://images.ctfassets.net/fo9twyrwpveg/6eVeSgMr2EsEGiGc208c6M/f6d9ff47d8d26b3b238c6272a40d3a99/contentful-logo.png';
      const testLink = 'https://www.diptyqueparis.com/fr_fr/p/bougie-neige-190g-edition-limitee.html';

      return {
        pagination: {
          count: PER_PAGE,
          limit: PER_PAGE,
          total: 100,
          offset: 1,
        },
        products: result.map((product) => ({
          id: '' + product.id,
          image: testImg,
          name: product.title,
          sku: '' + product.id,
          externalLink: testLink
        })),
      };
    },
  });

  sdk.window.startAutoResizer();
}

async function fetchSKUs(installationParams, search, pagination) {
  /**const validationError = validateParameters(installationParams);
  if (validationError) {
    throw new Error(validationError);
  }*/
  console.log('<--- Fetch SKUs --->')
  console.log(search);
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts'
  );
  let products = await response.json();
  if (search) {
    products = products.filter((product) => {
      return product.id == search;
    })
  }

  return products;
}

async function openDialog(sdk, _currentValue, _config) {
  const skus = await sdk.dialogs.openCurrentApp({
    position: 'center',
    title: 'Sample E-Commerce Demo App',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscapePress: true,
    width: 400,
    allowHeightOverflow: true,
  });

  return Array.isArray(skus) ? skus : [];
}

function validateParameters({ apiKey, projectId }) {
  if (!apiKey) {
    return 'Please add a API Key';
  }

  if (!projectId) {
    return 'Please add a Project Id';
  }

  return null;
}
