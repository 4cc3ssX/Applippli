import {
  VStack,
  Box,
  Text,
  Divider as NDivider,
  IDividerProps,
} from 'native-base';
import {IVStackProps} from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React from 'react';

interface IDivider extends IDividerProps {
  label?: string;
  containerProps?: IVStackProps;
}

const Divider = (props: IDivider) => {
  const {label, containerProps, ...rest} = props;
  return (
    <VStack {...containerProps} justifyContent="center" alignItems="center">
      <NDivider
        {...rest}
        orientation="horizontal"
        bg="muted.200"
        alignSelf="stretch"
      />
      {label && (
        <VStack
          position="absolute"
          top={-11}
          left={0}
          right={0}
          alignItems="center">
          <Box bg="white" px={3}>
            <Text fontWeight="medium" color="muted.500">
              {label}
            </Text>
          </Box>
        </VStack>
      )}
    </VStack>
  );
};

export default Divider;
