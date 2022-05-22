import {HStack, Pressable, Text, View} from 'native-base';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import ShadowContainer from '../ShadowContainer';

interface ISettingsRow {
  label: string;
  labelAlign?: 'center' | 'right' | 'left';
  labelStyle?: StyleProp<TextStyle>;
  left?: (props: {style?: StyleProp<ViewStyle>}) => React.ReactNode;
  right?: (props: {style?: StyleProp<ViewStyle>}) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
  dark?: boolean;
}

const SettingsRow = (props: ISettingsRow) => {
  const {
    label,
    labelAlign = 'left',
    labelStyle,
    left,
    right,
    leftStyle,
    rightStyle,
    style,
    dark,
    onPress,
  } = props;
  return (
    <ShadowContainer dark={dark}>
      <Pressable onPress={onPress}>
        <HStack
          alignItems="center"
          justifyContent="center"
          px={4}
          py="4"
          rounded="lg"
          bg="white"
          _dark={{bg: '#292E4E'}}
          style={[{}, style]}>
          {left && (
            <View style={[{}, leftStyle]} mx={2}>
              {left({style: leftStyle})}
            </View>
          )}
          <View flex={2} mx={2}>
            <Text
              fontSize="md"
              fontWeight="medium"
              letterSpacing="md"
              textAlign={labelAlign}
              style={[{}, labelStyle]}>
              {label}
            </Text>
          </View>
          {right && (
            <View style={[{}, rightStyle]} mx={2}>
              {right({style: rightStyle})}
            </View>
          )}
        </HStack>
      </Pressable>
    </ShadowContainer>
  );
};

export default SettingsRow;
