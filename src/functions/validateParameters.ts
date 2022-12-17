import { Config } from "@contentful/ecommerce-app-base";

export function validateParameters({ apiKey, endpoint }: Config): string | null {
  if (!apiKey) {
    return 'Please add an API Key';
  }
  
  if (!endpoint) {
    return 'Please add an endpoint';
  }
  
  return null;
}