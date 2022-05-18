import {
  useTheme,
  Pressable,
  Icon,
  Box,
  VStack,
  ScrollView,
  HStack,
  Text,
  IconButton,
  Modal,
  Button,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import DatePicker from 'react-native-modern-datepicker';
import {ToastContext} from '../../utils';
import {Container, Header} from '../../components/interface';
import {useDispatch, useSelector} from 'react-redux';
import {removeAuth} from '../../redux/features/user/userSlice';
import {RootState} from '../../redux/store';
import {
  fetchArea,
  fetchPopulation,
  IPopulationState,
} from '../../redux/features/population/populationSlice';
import {LineChart} from 'react-native-chart-kit';
import {nFormatter} from '../../utils/utils';
import {Dimensions, RefreshControl} from 'react-native';
import _ from 'lodash';

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {width} = Dimensions.get('window');
  const dispatch = useDispatch<any>();
  const {showToast} = useContext(ToastContext);
  const {areas, status, times, population} = useSelector<RootState>(
    s => s.population,
  ) as IPopulationState;
  const [value, setValue] = useState('00000');
  const [isOpened, setOpen] = useState(false);
  const [items, setItems] = useState<{label: string; value: string}[]>([]);
  const [datePick, setDatePick] = useState({
    index: 0,
    date: new Date(),
    isShown: false,
  });

  const [time, setTime] = useState({
    cdTimeFrom: '',
    cdTimeTo: '',
  });
  const [data, setData] = useState<{
    labels: string[];
    datasets: {data: number[]}[];
  }>({
    labels: new Array(10).fill(0).map((_v, i) => _.toString(2010 + i)),
    datasets: [
      {
        data: new Array(10).fill(0).map((_v, i) => _.toNumber(2010 * i)),
      },
    ],
  });
  const chartConfig = {
    backgroundGradientFrom: theme.colors.primary[50],
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: theme.colors.primary[100],
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(116, 93, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.6,
    useShadowColorFromDataset: false, // optional
  };
  const LogOutHandler = useCallback(async () => {
    dispatch(removeAuth());
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }, [dispatch, navigation]);

  const onSignOutHandler = useCallback(() => {
    auth()
      .signOut()
      .then(() => {
        LogOutHandler();
        showToast({
          message: 'Logged Out!',
          backgroundColor: theme.colors.gray[50],
          color: theme.colors.black,
        });
      })
      .catch(_e => {
        LogOutHandler();
      });
  }, [LogOutHandler, showToast, theme.colors.black, theme.colors.gray]);

  const onDateTimeHandler = useCallback(
    date => {
      const cdTime = moment(date, 'YYYY MM').format('YYYY');
      if (datePick.index === 0) {
        setTime({
          ...time,
          cdTimeFrom: cdTime,
        });
      } else {
        setTime({
          ...time,
          cdTimeTo: cdTime,
        });
      }
      setDatePick({
        ...datePick,
        isShown: false,
      });
    },
    [datePick, time],
  );

  const getPopulation = useCallback(() => {
    if (value || (time.cdTimeFrom && time.cdTimeTo)) {
      dispatch(
        fetchPopulation({
          areaCode: value,
          ...time,
        }),
      );
    }
  }, [dispatch, time, value]);

  useEffect(() => {
    let isMounted = true;
    if (!areas || areas?.length === 0) {
      dispatch(fetchArea({}));
    }
    const dropdownArea = areas?.map(d => ({
      label: d.name,
      value: d.code,
    }));
    if (dropdownArea && isMounted) {
      setItems(dropdownArea);
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, areas]);
  useEffect(() => {
    if (value || (time.cdTimeFrom && time.cdTimeTo)) {
      getPopulation();
    }
  }, [dispatch, getPopulation, time, value]);
  useEffect(() => {
    let isMounted = true;
    if (!population || population?.length === 0) {
      if (value && isMounted) {
        getPopulation();
      }
    }

    const populationData = population?.map(d => _.round(d.population));
    if (isMounted && populationData?.length > 0) {
      setData({
        labels: population?.map((_, i) => {
          return (
            times?.find(t => {
              return t.code === population[i].time;
            })?.name || ''
          );
        }),
        datasets: [{data: populationData}],
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    getPopulation,
    population,
    theme.colors.red,
    time,
    times,
    value,
  ]);
  return (
    <Container bg="#f9f7ff">
      <Header
        title="Home"
        canGoBack={false}
        rightElement={() => (
          <Pressable onPress={onSignOutHandler}>
            <Box bg="red.400" p={1} rounded="full">
              <Icon
                as={<Ionicons name="power-outline" />}
                size={6}
                color={theme.colors.white}
              />
            </Box>
          </Pressable>
        )}
      />
      <ScrollView
        px={8}
        py={3}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => getPopulation()}
          />
        }
        showsVerticalScrollIndicator={false}>
        <VStack alignItems="center">
          <DropDownPicker
            open={isOpened}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            searchable
            style={{borderColor: theme.colors.primary[200]}}
            textStyle={{
              fontFamily: theme.fontConfig.Poppins[400].normal,
              fontSize: theme.fontSizes.sm,
            }}
            dropDownContainerStyle={{
              borderColor: theme.colors.primary[200],
            }}
            searchContainerStyle={{borderBottomWidth: 0}}
            searchTextInputStyle={{borderColor: theme.colors.primary[200]}}
            searchPlaceholder="Search..."
            flatListProps={{showsVerticalScrollIndicator: false}}
          />
          <ScrollView horizontal my={5} showsHorizontalScrollIndicator={false}>
            <LineChart
              data={data}
              width={
                time.cdTimeFrom &&
                time.cdTimeTo &&
                Math.abs(
                  _.toNumber(time.cdTimeFrom) - _.toNumber(time.cdTimeTo),
                ) < 20
                  ? width
                  : 2400
              }
              height={340}
              yAxisLabel=""
              yAxisSuffix=""
              yLabelsOffset={4}
              xLabelsOffset={12}
              formatYLabel={yvalue => {
                const nFormat = nFormatter(yvalue);
                return `${nFormat.amount} ${nFormat.prefix}`;
              }}
              onDataPointClick={d => {
                const {value: v} = d;
                const nFormat = nFormatter(v);
                showToast({
                  message: `${nFormat.amount}${nFormat.prefix} population`,
                  backgroundColor: theme.colors.white,
                  color: theme.colors.black,
                  containerProps: {
                    borderWidth: 0.5,
                    borderColor: theme.colors.primary[100],
                  },
                });
              }}
              chartConfig={chartConfig}
              // fromZero
              style={{borderRadius: 10, paddingHorizontal: 20}}
              verticalLabelRotation={-70}
              horizontalLabelRotation={-20}
            />
          </ScrollView>
          <Box my={2}>
            <Text color="gray.400">Tap on dots to view population.</Text>
          </Box>
          <VStack
            justifyContent="center"
            flexWrap="wrap"
            alignItems="center"
            mt={2}
            space={2}>
            <HStack alignItems="center" bg="white" px={4} py={3} rounded="lg">
              <Box flex={2}>
                <Text fontWeight="medium">
                  {time.cdTimeFrom?.length > 0
                    ? `From ${time?.cdTimeFrom}`
                    : 'Select started date'}
                </Text>
              </Box>
              <IconButton
                bg="primary.100"
                rounded="full"
                _icon={{
                  as: <Ionicons name="add" />,
                  size: 5,
                  color: theme.colors.primary[500],
                }}
                size={8}
                onPress={() =>
                  setDatePick({...datePick, index: 0, isShown: true})
                }
              />
            </HStack>
            <HStack alignItems="center" bg="white" px={4} py={3} rounded="lg">
              <Box flex={2}>
                <Text fontWeight="medium">
                  {time.cdTimeTo?.length > 0
                    ? `To ${time?.cdTimeTo}`
                    : 'Select ended date'}
                </Text>
              </Box>
              <IconButton
                bg="red.100"
                rounded="full"
                _icon={{
                  as: <Ionicons name="add" />,
                  size: 5,
                  color: theme.colors.red[600],
                }}
                size={8}
                onPress={() =>
                  setDatePick({...datePick, index: 1, isShown: true})
                }
              />
            </HStack>
          </VStack>
          <Box alignSelf="stretch" mt={4}>
            <Button
              variant="outline"
              disabled={!time.cdTimeFrom || !time.cdTimeTo}
              style={{borderColor: theme.colors.red[200]}}
              colorScheme="danger"
              _text={{
                textTransform: 'uppercase',
                fontWeight: 'medium',
              }}
              onPress={() => {
                setValue('00000');
                setTime({cdTimeFrom: '', cdTimeTo: ''});
              }}>
              Reset
            </Button>
          </Box>
          <Modal
            isOpen={datePick.isShown}
            px={5}
            onClose={() => setDatePick({...datePick, isShown: false})}>
            <DatePicker
              mode="monthYear"
              style={{borderRadius: 10}}
              current={moment(
                `${_.max(
                  times.map(t => {
                    return _.toNumber(t.name);
                  }),
                )}-12`,
                'YYYY-MM',
              ).format('YYYY-MM-DD')}
              minimumDate={moment(
                `${
                  datePick.index === 1 && time.cdTimeFrom
                    ? time.cdTimeFrom
                    : _.min(
                        times?.map(t => {
                          return _.toNumber(t.name);
                        }),
                      )
                }-12`,
                'YYYY-MM',
              ).format('YYYY-MM-DD')}
              maximumDate={moment(
                `${_.max(
                  times.map(t => {
                    return _.toNumber(t.name);
                  }),
                )}-12`,
                'YYYY-MM',
              ).format('YYYY-MM-DD')}
              options={{
                defaultFont: 'Poppins-Regular',
                headerFont: 'Poppins-Medium',
              }}
              onMonthYearChange={onDateTimeHandler}
            />
          </Modal>
        </VStack>
      </ScrollView>
    </Container>
  );
};

export default Home;
