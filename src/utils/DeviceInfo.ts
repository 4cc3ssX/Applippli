import DeviceInfo from 'react-native-device-info';

export const getAppName = () => {
  return DeviceInfo.getApplicationName();
};

export const getVersion = () => {
  return DeviceInfo.getVersion();
};
