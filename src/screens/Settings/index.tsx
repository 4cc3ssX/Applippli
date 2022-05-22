import {Button, useColorMode, useTheme, View, VStack} from 'native-base';
import React, {useCallback, useContext} from 'react';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {
  Container,
  Header,
  SettingsRow,
  Switch,
} from '../../components/interface';
import {removeAuth} from '../../redux/features/user/userSlice';
import {ToastContext} from '../../utils';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {toggleColorMode, colorMode} = useColorMode();
  const {showToast} = useContext(ToastContext);
  const LogOutHandler = useCallback(async () => {
    dispatch(removeAuth());
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }, [dispatch]);

  const onSignOutHandler = useCallback(() => {
    auth()
      .signOut()
      .then(() => {
        LogOutHandler();
        showToast({
          message: 'Logged Out!',
          backgroundColor: theme.colors.gray[50],
          color: theme.colors.black,
        });
      })
      .catch(_e => {
        LogOutHandler();
      });
  }, [LogOutHandler, showToast, theme.colors.black, theme.colors.gray]);
  return (
    <Container bg="#F7F7F7">
      <Header
        title="Settings"
        titleAlign="center"
        dark={colorMode === 'dark'}
      />
      <VStack alignItems="center" space="3" py="6" px="3.5" flex={1}>
        <SettingsRow
          label="Dark Mode"
          onPress={() => toggleColorMode()}
          dark={colorMode === 'dark'}
          right={() => (
            <Switch
              value={colorMode === 'dark'}
              onValueChange={() => toggleColorMode()}
              disabled={!colorMode}
              dark={colorMode === 'dark'}
            />
          )}
        />
        <View position="absolute" bottom={15} left={15} right={15}>
          <Button
            bg="red.500"
            _dark={{bg: theme.colors.red[400]}}
            _pressed={{bg: theme.colors.red[300]}}
            onPress={() => onSignOutHandler()}>
            Log Out
          </Button>
        </View>
      </VStack>
    </Container>
  );
};

export default Settings;
