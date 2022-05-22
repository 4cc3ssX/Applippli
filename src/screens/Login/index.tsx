import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Pressable,
  Text,
  useColorMode,
  useTheme,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FacebookLogo, GoogleLogo} from '../../components/icons';
import {Container, Divider} from '../../components/interface';
import {DeviceInfo, ToastContext} from '../../utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {setAuth} from '../../redux/features/user/userSlice';

GoogleSignin.configure({
  webClientId:
    '202628239211-0srlbe9r3ugctqbnqabk5pre12fbovbk.apps.googleusercontent.com',
});

const Login = () => {
  const theme = useTheme();
  const {showToast} = useContext(ToastContext);
  const {colorMode} = useColorMode();
  const navigation = useNavigation<any>();
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const user: any = useSelector<RootState>(s => s.user.data);
  const dispatch = useDispatch();

  const onGoogleButtonPress = React.useCallback(() => {
    // Get the users ID token
    GoogleSignin.signIn()
      .then(({idToken}) => {
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      })
      .catch((e: any) => {
        showToast({
          message: e.message || e,
          backgroundColor: theme.colors.red['400'],
        });
      });
  }, [showToast, theme.colors.red]);

  const onFacebookLoginPress = React.useCallback(() => {
    // Attempt login with permissions
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(async res => {
        if (res.isCancelled) {
          throw 'Login cancelled!';
        }
        try {
          const data = await AccessToken.getCurrentAccessToken();
          if (!data) {
            throw 'Something went wrong obtaining authentication token';
          }
          // Create a Firebase credential with the AccessToken
          const facebookCredential = auth.FacebookAuthProvider.credential(
            data.accessToken,
          );
          return await auth().signInWithCredential(facebookCredential);
        } catch (e: any) {
          showToast({
            message: e?.message || e,
            backgroundColor: theme.colors.red['400'],
          });
        }
      })
      .catch((e: any) => {
        showToast({
          message: e.message || e,
          backgroundColor: theme.colors.red['400'],
        });
      });
  }, [showToast, theme.colors.red]);
  useEffect(() => {
    auth().onAuthStateChanged(u => {
      if (u) {
        dispatch(setAuth(u));
      }
      if (isLoading) {
        setLoading(false);
      }
    });
  }, [dispatch, isLoading, navigation]);
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }, [navigation, user]);
  return (
    <Container p={12}>
      <VStack alignItems="flex-start" space={1}>
        <Text fontWeight="medium" letterSpacing={1} color="muted.400">
          Welcome to
        </Text>
        <Heading size="xl" letterSpacing={1}>
          {DeviceInfo.getAppName()}!
        </Heading>
      </VStack>
      <Box mt={3} mb={12}>
        <Text
          fontWeight="medium"
          color="primary.400"
          _dark={{color: 'primary.200'}}>
          Log In to your account and explore with us!
        </Text>
      </Box>
      <VStack space={8}>
        <VStack space={5}>
          <Input
            variant="unstyled"
            bg={colorMode === 'dark' ? '#292E4E' : 'gray.50'}
            rounded="full"
            type="text"
            py="2.5"
            placeholderTextColor={
              colorMode === 'dark'
                ? theme.colors.text[200]
                : theme.colors.text[700]
            }
            InputLeftElement={
              <Icon
                as={<Ionicons name="at" />}
                size={5}
                ml="5"
                color={
                  colorMode === 'dark' ? theme.colors.text[50] : 'gray.600'
                }
                onPress={() => setShow(!show)}
              />
            }
            _focus={{
              bg: colorMode === 'dark' ? '#292E4E' : theme.colors.gray['100'],
            }}
            placeholder="What's your email address?"
          />
          <Input
            variant="unstyled"
            bg={colorMode === 'dark' ? '#292E4E' : 'gray.50'}
            rounded="full"
            py="2.5"
            placeholderTextColor={
              colorMode === 'dark'
                ? theme.colors.text[200]
                : theme.colors.text[700]
            }
            type={show ? 'text' : 'password'}
            InputLeftElement={
              <Icon
                as={<Ionicons name="key" />}
                size={5}
                ml="5"
                color={
                  colorMode === 'dark' ? theme.colors.text[50] : 'gray.600'
                }
                onPress={() => setShow(!show)}
              />
            }
            InputRightElement={
              <Icon
                as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
                size={5}
                mr="5"
                color={
                  colorMode === 'dark' ? theme.colors.text[50] : 'gray.600'
                }
                onPress={() => setShow(!show)}
              />
            }
            _focus={{
              bg: colorMode === 'dark' ? '#292E4E' : theme.colors.gray['100'],
            }}
            placeholder="Password"
          />
        </VStack>
        <Box>
          <Button
            py="2.5"
            _text={{fontWeight: 'semibold', fontSize: 'md'}}
            rounded="full">
            Log In
          </Button>
        </Box>
      </VStack>
      <VStack justifyContent="center" alignItems="center" my={6}>
        <Pressable onPress={() => {}}>
          <Text color="primary.400" _dark={{color: 'primary.200'}} underline>
            Forgot your password?
          </Text>
        </Pressable>
      </VStack>
      <Divider
        dark={colorMode === 'dark'}
        containerProps={{my: 8, mx: 10}}
        label="or"
      />
      <HStack mt={6} justifyContent="center" alignItems="center" space={6}>
        <HStack alignItems="center">
          <IconButton
            onPress={() => onGoogleButtonPress()}
            variant="ghost"
            size={7}
            icon={<Icon as={<GoogleLogo />} />}
            rounded="full"
            _pressed={{bg: 'transparent'}}
          />
        </HStack>
        <HStack alignItems="center">
          <IconButton
            onPress={() => onFacebookLoginPress()}
            variant="ghost"
            size={8}
            p={1}
            icon={<Icon as={<FacebookLogo />} />}
            _icon={{color: '#fff'}}
            bg="#1778F2"
            rounded="full"
          />
        </HStack>
      </HStack>
    </Container>
  );
};

export default Login;
