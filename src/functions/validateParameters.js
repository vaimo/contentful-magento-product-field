export function validateParameters({ apiKey, endpoint }) {
    if (!apiKey) {
      return 'Please add an API Key';
    }
  
    if (!endpoint) {
      return 'Please add an endpoint';
    }
  
    return null;
  }