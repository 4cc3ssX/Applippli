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
  useColorMode,
  View,
  Fab,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import DatePicker from 'react-native-modern-datepicker';
import {ToastContext, utilities} from '../../utils';
import {Container, Header, ShadowContainer} from '../../components/interface';
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
import {ChevronBack, ChevronForward} from '../../components/icons';

const Home = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const navigation = useNavigation();
  const {width} = Dimensions.get('window');
  const dispatch = useDispatch<any>();
  const {showToast} = useContext(ToastContext);
  const {areas, status, times, population} = useSelector<RootState>(
    s => s.population,
  ) as IPopulationState;
  const [activeIndex, setActiveIndex] = useState(0);
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
    backgroundGradientTo: theme.colors.primary[400],
    backgroundGradientToOpacity: 0.2,
    color: (opacity = 1) => `rgba(116, 93, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.6,
    useShadowColorFromDataset: false, // optional
  };

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
    <Container bg="#f7f7f7">
      <Header
        title="Home"
        canGoBack={false}
        dark={colorMode === 'dark'}
        rightElement={() => (
          <IconButton
            _icon={{
              as: <Ionicons name="settings-outline" />,
              size: 5,
              color:
                colorMode === 'dark'
                  ? theme.colors.text[100]
                  : theme.colors.black,
            }}
            size={8}
            onPress={() => navigation.navigate('Settings')}
          />
        )}
      />
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
      <ScrollView
        px={8}
        py={6}
        _contentContainerStyle={{pb: 20}}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => getPopulation()}
          />
        }
        showsVerticalScrollIndicator={false}>
        <VStack alignItems="center" flex={1}>
          <DropDownPicker
            open={isOpened}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={v => {
              setActiveIndex(0);
              setValue(v);
            }}
            setItems={setItems}
            theme="DARK"
            searchable
            style={{
              borderColor:
                colorMode === 'dark' ? '#ADB9FF' : theme.colors.primary[200],
              backgroundColor: colorMode === 'dark' ? '#292E4E' : 'white',
            }}
            textStyle={{
              fontFamily: theme.fontConfig.Poppins[400].normal,
              fontSize: theme.fontSizes.sm,
              color: colorMode === 'dark' ? '#F5F5F5' : theme.colors.black,
            }}
            dropDownContainerStyle={{
              borderColor:
                colorMode === 'dark' ? '#ADB9FF' : theme.colors.primary[200],
              backgroundColor: colorMode === 'dark' ? '#292E4E' : 'white',
            }}
            searchContainerStyle={{borderBottomWidth: 0}}
            searchTextInputStyle={{
              borderColor:
                colorMode === 'dark' ? '#ADB9FF' : theme.colors.primary[200],
            }}
            searchPlaceholder="Search..."
            flatListProps={{showsVerticalScrollIndicator: false}}
          />
          <HStack justifyContent="center" alignItems="center" mt={2} space={2}>
            <HStack
              alignItems="center"
              bg="white"
              _dark={{bg: '#292E4E'}}
              px={4}
              py={3}
              rounded="lg"
              flex={1}>
              <Box flex={2}>
                <Text
                  fontWeight="medium"
                  _dark={{color: theme.colors.text[100]}}>
                  From {time?.cdTimeFrom}
                </Text>
              </Box>
              <IconButton
                bg="primary.50"
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
            <HStack
              alignItems="center"
              bg="white"
              _dark={{bg: '#292E4E'}}
              px={4}
              py={3}
              rounded="lg"
              flex={1}>
              <Box flex={2}>
                <Text
                  fontWeight="medium"
                  _dark={{color: theme.colors.text[100]}}>
                  To {time?.cdTimeTo}
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
          </HStack>
        </VStack>
        <VStack justifyContent="center" alignItems="center">
          <ScrollView
            horizontal
            my={5}
            rounded="md"
            showsHorizontalScrollIndicator={false}>
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
                const {value: v, index} = d;
                setActiveIndex(index);
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
          <Box my={2} mb={5}>
            <Text color="gray.400">Tap on dots to view population.</Text>
          </Box>
          <ShadowContainer
            dark={colorMode === 'dark'}
            style={{marginVertical: 8}}>
            <Box bg="white" _dark={{bg: '#292E4E'}} p={6} rounded="lg">
              <VStack>
                <HStack alignItems="center">
                  <HStack
                    justifyContent="center"
                    alignItems="center"
                    width="40%"
                    height={70}
                    bg="#f9f9f9"
                    _dark={{bg: '#4E5476'}}
                    rounded="lg"
                    flex={1}>
                    <View>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        letterSpacing="lg"
                        _dark={{color: theme.colors.text[50]}}
                        numberOfLines={1}>
                        {areas.find(a => a.code === value)?.name}
                      </Text>
                    </View>
                    <View position="absolute" bottom={1} right={2}>
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        color="#969696"
                        _dark={{color: theme.colors.text[300]}}>
                        {value}
                      </Text>
                    </View>
                  </HStack>
                  <HStack justifyContent="center" alignItems="center" flex={1}>
                    <Text
                      color="#969696"
                      fontWeight="medium"
                      fontSize="lg"
                      _dark={{color: theme.colors.text[300]}}
                      letterSpacing="lg">
                      at
                    </Text>
                    <View ml={2}>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        letterSpacing="lg">
                        {
                          times.find(
                            t => t.code === population[activeIndex]?.time,
                          )?.name
                        }
                      </Text>
                    </View>
                  </HStack>
                </HStack>
                <HStack flex={1} alignItems="center">
                  <VStack space={3} mt={5}>
                    <View>
                      <Text
                        fontWeight="medium"
                        color="#969696"
                        fontSize="sm"
                        _dark={{color: theme.colors.text[300]}}
                        letterSpacing="lg">
                        Total Population
                      </Text>
                    </View>
                    <HStack alignItems="center" space={2}>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        _dark={{color: theme.colors.text[200]}}
                        letterSpacing="lg">
                        {utilities.getCommaDelimit(
                          population[activeIndex]?.population,
                        )}
                      </Text>
                      <Text
                        fontWeight="medium"
                        color="#969696"
                        _dark={{color: theme.colors.text[300]}}
                        fontSize="md">
                        {nFormatter(population[activeIndex]?.population).prefix}
                      </Text>
                    </HStack>
                  </VStack>
                  <HStack
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    bottom="0"
                    right="0">
                    <Button
                      variant="ghost"
                      colorScheme="danger"
                      _text={{
                        textTransform: 'uppercase',
                        fontWeight: 'medium',
                        _dark: {
                          color: theme.colors.red[400],
                        },
                      }}
                      onPress={() => {
                        setValue('00000');
                        setTime({cdTimeFrom: '', cdTimeTo: ''});
                        setActiveIndex(0);
                      }}>
                      Reset All
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </ShadowContainer>
        </VStack>
      </ScrollView>
    </Container>
  );
};

export default Home;
