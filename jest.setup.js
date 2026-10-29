jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('react-native-webview', () => {
  const {View} = require('react-native');
  return {__esModule: true, default: View};
});
