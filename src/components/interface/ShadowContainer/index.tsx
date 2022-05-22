import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Shadow, ShadowProps} from 'react-native-shadow-2';

interface IShadowContainer extends ShadowProps {
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ShadowContainer = (props: IShadowContainer) => {
  const {dark, children, style, ...rest} = props;
  return (
    <Shadow
      distance={15}
      radius={5}
      startColor={dark ? 'rgba(0, 0, 0, 0)' : '#f4f4f499'}
      offset={[0, 4]}
      viewStyle={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...rest}>
      <View style={[{flex: 1}, style]}>{children}</View>
    </Shadow>
  );
};

export default ShadowContainer;
