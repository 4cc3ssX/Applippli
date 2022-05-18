import {Image, Text, View, VStack} from 'native-base';
import React, {useEffect, useMemo} from 'react';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {
  fetchPopulation,
  IPopulationState,
} from '../../redux/features/population/populationSlice';
import {Dimensions} from 'react-native';
import logo from '../../assets/images/logo_res.png';

const Splash = () => {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const {areas, status, population} = useSelector<RootState>(
    s => s.population,
  ) as IPopulationState;
  const user: any =
    useSelector<RootState>(s => s.user.data) || auth().currentUser;
  const insets = useSafeAreaInsets();
  // const appName = useMemo(() => DeviceInfo.getApplicationName(), []);

  useEffect(() => {
    let isMounted = true;
    SplashScreen.hide();
    if (Object.keys(user).length === 0) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } else {
      if (!population || population?.length === 0) {
        const value = areas[0] && areas?.[0].code;
        if (value && isMounted) {
          dispatch(
            fetchPopulation({
              areaCode: value,
              ...{cdTimeFrom: '', cdTimeTo: ''},
            }),
          );
        }
      }
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
    return () => {
      isMounted = false;
    };
  }, [areas, dispatch, navigation, population, status, user]);
  return (
    <VStack bg="white" flex={1} justifyContent="center" alignItems="center">
      <Image
        source={logo}
        alt="Logo"
        resizeMode="contain"
        width={width}
        height={height}
      />
      <View position="absolute" bottom={insets.bottom + 10}>
        <Text letterSpacing={1} color="gray.500">
          Made with ❤️
        </Text>
      </View>
    </VStack>
  );
};

export default Splash;
