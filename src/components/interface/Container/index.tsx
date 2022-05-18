import {Box, IBoxProps, useTheme} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface IContainer extends IBoxProps {}

const Container = (props: IContainer) => {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.white}]}>
      <Box flex={1} bg="#fff" {...props} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Container;
