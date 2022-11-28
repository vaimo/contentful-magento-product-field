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
    return getValue(skus, currentValue, config);
  }

  function getValue(newValue, currentValue, config) {
    const SYMBOL_TYPE_NAME = 'Symbol';
    let result = Array.isArray(newValue) ? newValue : [];
    return (Array.isArray(currentValue) && config.fieldType !== SYMBOL_TYPE_NAME) ?
     [...currentValue, ...result] : [result.shift()];
  }