import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createSlice} from '@reduxjs/toolkit';

export interface IUserState {
  data: FirebaseAuthTypes.User | {};
}

const initialState: IUserState = {
  data: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.data = action.payload;
    },
    removeAuth: state => {
      state.data = {};
    },
  },
});

export const {setAuth, removeAuth} = userSlice.actions;

export default userSlice.reducer;
