import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Home, Login, Settings, Splash} from '../screens';

type ScreenOptions = {
  title?: string;
  headerShown?: boolean;
  header?: any;
  [key: string]: any;
};

export interface IScreen {
  name: string;
  component: any;
  options?: ScreenOptions;
}

const Screens: IScreen[] = [
  {
    name: 'Home',
    component: Home,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Settings',
    component: Settings,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Splash',
    component: Splash,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Login',
    component: Login,
    options: {
      headerShown: false,
    },
  },
];

const NStack = createStackNavigator();

const Stack = () => {
  return (
    <NStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      {Screens.map((e, i) => {
        return <NStack.Screen key={i.toString()} {...e} />;
      })}
    </NStack.Navigator>
  );
};

export default Stack;
