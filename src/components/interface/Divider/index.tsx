import {
  VStack,
  Box,
  Text,
  Divider as NDivider,
  IDividerProps,
  useTheme,
} from 'native-base';
import {IVStackProps} from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React from 'react';

interface IDivider extends IDividerProps {
  label?: string;
  containerProps?: IVStackProps;
  dark?: boolean;
}

const Divider = (props: IDivider) => {
  const theme = useTheme();
  const {label, containerProps, dark, ...rest} = props;
  return (
    <VStack {...containerProps} justifyContent="center" alignItems="center">
      <NDivider
        {...rest}
        orientation="horizontal"
        bg={dark ? 'gray.500' : 'gray.200'}
        rounded="md"
        alignSelf="stretch"
      />
      {label && (
        <VStack
          position="absolute"
          top={-11}
          left={0}
          right={0}
          alignItems="center">
          <Box bg={dark ? '#2F334D' : 'white'} px={3}>
            <Text
              fontWeight="medium"
              color={dark ? theme.colors.text[200] : 'muted.500'}>
              {label}
            </Text>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};

export default Divider;
