import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {useAxiosRequest} from '../../../utils';
import _ from 'lodash';
import {RootState} from '../../store';

export type Population = {
  index: number;
  tab: string;
  category: string;
  time: number;
  population: number;
  unit: string;
  area: string;
};

export type Time = {
  index: number;
  code: number;
  name: string;
  level: number;
};

export type Area = {
  index: number;
  code: string;
  name: string;
  level: string;
};

export interface IPopulationState {
  areas: Area[];
  population: Population[];
  times: Time[];
  lang: 'E' | 'J';
  status: string;
  error?: string;
}

const initialState: IPopulationState = {
  areas: [],
  population: [],
  times: [],
  status: 'idle',
  lang: 'E',
  error: '',
};

export const fetchPopulation = createAsyncThunk(
  'population/fetchPopulation',
  async (payload: any, {getState}) => {
    const state = getState() as RootState;
    const {Request} = useAxiosRequest();
    const {areaCode, cdTimeFrom, cdTimeTo} = payload;
    return Request({
      method: 'get',
      url: `/getStatsData?statsDataId=0000010101&lang=${state.population.lang}&metaGetFlg=N&cdCat01=A1101&cdArea=${areaCode}&cdTimeFrom=${cdTimeFrom}&cdTimeTo=${cdTimeTo}`,
    }).then(data => data.data);
  },
);

export const fetchArea = createAsyncThunk(
  'population/fetchArea',
  async (_payload: any = {}, {getState}) => {
    const state = getState() as RootState;
    const {Request} = useAxiosRequest();
    return Request({
      method: 'get',
      url: `/getMetaInfo?appId=91b05eec38e37834dfa43b36f840fdb2f6468182&statsDataId=0000010101&lang=${state.population.lang}`,
    }).then(data => data.data);
  },
);

export const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    changeAPILanguage: (state, action) => {
      const {lang} = action.payload;
      state.lang = lang;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPopulation.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(fetchPopulation.fulfilled, (state, action) => {
      const {GET_STATS_DATA} = action.payload;
      const population = GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE.map(
        (e: any, i: number): Population => {
          return {
            index: i,
            tab: e['@tab'],
            category: e['@cat01'],
            time: e['@time'],
            unit: e['@unit'],
            population: e.$,
            area: e['@area'],
          };
        },
      );
      return {
        ...state,
        population,
        status: 'idle',
      };
    });
    builder.addCase(fetchPopulation.rejected, (state, action) => {
      const error = action.error.message;
      return {...state, status: 'idle', error: `${error}`};
    });
    builder.addCase(fetchArea.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(fetchArea.fulfilled, (state, action) => {
      const {GET_META_INFO} = action.payload;
      const classOBJ = GET_META_INFO?.METADATA_INF.CLASS_INF.CLASS_OBJ;
      const findArea = classOBJ.find(
        (obj: any) => _.toLower(obj['@id']) === 'area',
      );
      const findTime = classOBJ.find(
        (obj: any) => _.toLower(obj['@id']) === 'time',
      );
      const areas = findArea?.CLASS?.map((e: any, i: number): Area => {
        return {
          index: i,
          code: e['@code'],
          name: e['@name'],
          level: e['@level'],
        };
      });
      const times = findTime?.CLASS?.map((e: any, i: number): Area => {
        return {
          index: i,
          code: e['@code'],
          name: e['@name'],
          level: e['@level'],
        };
      });
      return {
        ...state,
        areas,
        times,
        status: 'idle',
      };
    });
    builder.addCase(fetchArea.rejected, (state, action) => {
      const error = action.error.message;
      return {...state, status: 'idle', error: `${error}`};
    });
  },
});

export const {changeAPILanguage} = populationSlice.actions;
export default populationSlice.reducer;
