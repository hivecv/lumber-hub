import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import request, {DELETE, GET, POST, PUT} from "./request";
import {get} from './localstorage';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getAuthConfig = (thunk, extraHeaders = {}) => {
  const token = authTokenSelector(thunk.getState());
  return {headers: {Authorization: `Bearer ${token}`, ...extraHeaders}}
}


export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/some/data`);
    thunk.dispatch(updateAuth(response.data))
  }
)

export const fetchDevices = createAsyncThunk(
  'devices/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/api/users/me/devices/`, {}, getAuthConfig(thunk));
    thunk.dispatch(updateDevices(response.data))
  }
)

export const updateDevice = createAsyncThunk(
  'devices/update',
  async (act, thunk) => {
    const response = await request(PUT, `/api/users/me/devices/${act['id']}/`, act, getAuthConfig(thunk));
    thunk.dispatch(fetchDevices());
    if(act.callback) {
      act.callback(response.data)
    }
  }
)

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async (act, thunk) => {
    const response = await request(DELETE, `/api/users/me/devices/${act['id']}/`, {}, getAuthConfig(thunk));
    thunk.dispatch(fetchDevices());
    if(act.callback) {
      act.callback(response.data)
    }
  }
)
export const login = createAsyncThunk(
  'auth/login',
  async (act, thunk) => {
    const response = await request(POST, `/api/token/`, act);
    thunk.dispatch(updateAuth(response.data))
    if(act.callback) {
      act.callback(response.data)
    }
  }
)
export const register = createAsyncThunk(
  'auth/register',
  async (act, thunk) => {
    const response = await request(POST, `/api/users/`, act);
    if(act.callback) {
      act.callback(response.data)
    }
  }
)

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    // inProgress: false,
    devices: [],
    auth: {
      access_token: get("auth_token") || null,
      token_type: null,
      error: null,
    },
  },
  reducers: {
    updateAuth: (state, action) => {
      state.auth = action.payload
    },
    updateDevices: (state, action) => {
      state.devices = action.payload
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchData.pending, (state, action) => {
    //   state.inProgress = true
    // })
  },
})

export const authTokenSelector = state => state.app.auth.access_token;
export const devicesSelector = state => state.app.devices;

export const {updateAuth, updateDevices} = appSlice.actions;


export default configureStore({
  reducer: {
    app: appSlice.reducer,
  }
})