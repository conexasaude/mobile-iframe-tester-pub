import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {IframeTester} from './src';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <IframeTester />
    </SafeAreaProvider>
  );
};

export default App;
