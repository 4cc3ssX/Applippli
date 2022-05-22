import React from 'react';
import {Switch as NSwitch, SwitchProps} from 'react-native-switch';

interface ISwitch extends SwitchProps {
  dark?: boolean;
}

const Switch = (props: ISwitch) => {
  const {dark} = props;
  return (
    <NSwitch
      circleSize={20}
      barHeight={24}
      backgroundInactive={dark ? '#E7E1FF' : '#f4f4f4'}
      backgroundActive={dark ? '#E7E1FF' : '#f4f4f4'}
      renderActiveText={false}
      renderInActiveText={false}
      circleInActiveColor="#142382"
      circleActiveColor="#142382"
      circleBorderWidth={0}
      switchWidthMultiplier={2}
      changeValueImmediately={true}
      switchBorderRadius={20}
      containerStyle={{
        borderWidth: 0.4,
        borderColor: '#ADB9FF',
      }}
      switchLeftPx={3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
      switchRightPx={3}
      {...props}
    />
  );
};

export default Switch;
