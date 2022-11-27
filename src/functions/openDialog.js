export async function openDialog(sdk, currentValue, config) {
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