import './index.css';
import { setup} from '@contentful/ecommerce-app-base';
import { init } from '@contentful/app-sdk';
import logo from './magento-icon.svg';
import { openDialog } from './functions/openDialog';
import { validateParameters } from './functions/validateParameters';
import { fetchProductPreviews, renderDialog } from './functions/lifecycle';

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
      },
      {
        id: 'mediaPath',
        type: 'Symbol',
        name: 'Path of the Magento media dir',
        description: 'Provide the path of the Magento media dir',
        required: true
      }
    ],
    validateParameters,
    fetchProductPreviews,
    renderDialog,
    openDialog,
    isDisabled: () => false,
  });
});
