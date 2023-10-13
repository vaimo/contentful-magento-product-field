import { Config } from "@contentful/ecommerce-app-base";

export function validateParameters({ apiKey, endpoint, mediaPath }: Config): string | null {
  if (!apiKey) {
    return 'Please add an API Key';
  }
  
  if (!endpoint) {
    return 'Please add an endpoint';
  }

  if (!mediaPath) {
    return 'Please add the media path';
  }
  
  return null;
}