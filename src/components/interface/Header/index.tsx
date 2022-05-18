import {useNavigation} from '@react-navigation/native';
import {Heading, HStack, View} from 'native-base';
import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

interface IHeader {
  title: string;
  style?: StyleProp<ViewStyle>;
  safeArea?: boolean;
  titleAlign?: 'center' | 'right' | 'left';
  leftElement?: () => React.ReactNode;
  rightElement?: () => React.ReactNode;
  onBackPress?: () => void;
  canGoBack?: boolean;
}

const Header = (props: IHeader) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    title,
    style,
    titleAlign = 'left',
    leftElement,
    rightElement,
    safeArea = false,
    onBackPress = navigation.goBack,
    canGoBack = true,
  } = props;
  return (
    <HStack
      justifyContent="space-around"
      alignItems="center"
      bgColor="white"
      pt={safeArea ? insets.top + 14 : 14}
      pb={3.5}
      px={4}
      style={style}>
      {!leftElement && canGoBack ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onBackPress}>
          <View padding={1}>
            <Icon name="chevron-back" size={18} />
          </View>
        </TouchableOpacity>
      ) : (
        leftElement && leftElement()
      )}
      <View flex={2} mx={2}>
        <Heading size="md" textAlign={titleAlign}>
          {title}
        </Heading>
      </View>
      <View mx={2}>{rightElement && rightElement()}</View>
    </HStack>
  );
};

export default Header;
