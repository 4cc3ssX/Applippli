import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {
  Text,
  Box,
  extendTheme,
  NativeBaseProvider,
  useTheme,
  useToast,
  IBoxProps,
  ITextProps,
  useColorMode,
} from 'native-base';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Stack} from './src/navigations';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';
import {store} from './src/redux';
import CustomTheme from './src/themes/base';
import {ToastContext} from './src/utils';
import { IShowToastProps } from './src/utils/ToastContext';
enableScreens();

const NBApp = () => {
  const toast = useToast();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const isDarkMode = useColorScheme() === 'dark' || colorMode === 'dark';
  const showToast = React.useCallback(
    ({
      message,
      color,
      backgroundColor,
      containerProps,
      textProps,
    }: IShowToastProps) => {
      toast.show({
        placement: 'bottom',
        duration: 2000,
        render: () => {
          return (
            <Box
              bg={backgroundColor || 'primary.400'}
              px="4"
              py="2"
              rounded="full"
              mb={5}
              {...containerProps}>
              <Text color={color || '#fff'} {...textProps}>
                {message}
              </Text>
            </Box>
          );
        },
      });
    },
    [toast],
  );
  return (
    <ToastContext.Provider value={{showToast}}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={isDarkMode ? '#292E4E' : theme.colors.white}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <Stack />
      </NavigationContainer>
    </ToastContext.Provider>
  );
};

const App = () => {
  const NativeBaseTheme = extendTheme(CustomTheme);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NativeBaseProvider theme={NativeBaseTheme}>
          <NBApp />
        </NativeBaseProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
