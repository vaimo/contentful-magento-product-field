# Magento product field based on Contentful E-Commerce Demo App


Learn more about how to use [`@contentful/ecommerce-app-base`](https://www.npmjs.com/package/@contentful/ecommerce-app-base) in Contentful [documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/libraries/).



# Usage
after cloning or downloading the main branches code, go to the root directory of current package, and perform npm run build command,
then during the installation of custom app in contentful adminpanel just move build dir to the source for custom app (drag and drop or just selecting the directory in uploader popup). ALso don't forget to set a proper location for this app (it was build for Short Text and Short Text List in scope of Entry Field)

After installation you will need to configure your custom app to add a REST API endpoint from your Magento 2 installation and integration API key (Access Token) (where you need to add an access to at least products resource).

After app will be installed you will need to decide a SKUs field in needed content type where you actually want to insert product SKUs and then change the appearance for this field to use current extension instead of default one.

After you will be able to use current extension to search by name or sku using a search field and select needed products, so in result all selected SKUs will be added to the current field so later you will be able to use these fields on your frontend application (or whatewer place where you will get data from Contentful)
