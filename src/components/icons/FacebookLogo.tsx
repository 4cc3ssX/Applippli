import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {IIconProps} from '.';

const FacebookLogo = (props: IIconProps) => {
  const {width, height, size, color} = props;
  return (
    <Svg
      width={width || size}
      height={height || size}
      viewBox="0 0 114 218"
      fill="none">
      <Path
        d="M73.635 218.001v-99.137h33.277l4.982-38.635H73.635V55.561c0-11.186 3.107-18.809 19.148-18.809l20.459-.009V2.188C109.702 1.717 97.558.665 83.43.665c-29.498 0-49.692 18.005-49.692 51.071v28.493H.376v38.635h33.362v99.137h39.897"
        fill={color || '#fff'}
      />
    </Svg>
  );
};

export default FacebookLogo;
