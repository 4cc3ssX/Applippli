import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IIconProps} from '.';

const ChevronForward = (props: IIconProps) => {
  const {width, height, size, color} = props;
  return (
    <Svg
      width={width || size}
      height={height || size}
      viewBox="0 0 22 40"
      fill="none">
      <Path
        d="m2 2 18 18L2 38"
        stroke={color || '#3C3C3C'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronForward;
