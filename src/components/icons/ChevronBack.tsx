import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IIconProps} from '.';

const ChevronBack = (props: IIconProps) => {
  const {width, height, size, color} = props;
  return (
    <Svg
      width={width || size}
      height={height || size}
      viewBox="0 0 16 28"
      fill="none">
      <Path
        d="M14 2 2 14l12 12"
        stroke={color || '#3C3C3C'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronBack;
