import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import request, {DELETE, GET, POST, PUT} from "./request";
import {get, remove} from './localstorage';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getAuthConfig = (thunk, extraHeaders = {}) => {
  const token = authTokenSelector(thunk.getState());
  return {headers: {Authorization: `Bearer ${token}`, ...extraHeaders}}
}


export const fetchLogs = createAsyncThunk(
  'logs/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/api/devices/${act}/logs/`, {}, getAuthConfig(thunk));
    thunk.dispatch(updateLogs(response.data))
  }
)

export const fetchDevices = createAsyncThunk(
  'devices/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/api/devices/`, {}, getAuthConfig(thunk));
    thunk.dispatch(updateDevices(response.data))
  }
)

export const updateConfig = createAsyncThunk(
  'devices/update',
  async (act, thunk) => {
    const response = await request(PUT, `/api/devices/${act["device_uuid"]}/configs/${act["id"]}/`, {"config": act["config"]}, getAuthConfig(thunk));
    thunk.dispatch(fetchDevices());
    if(act.callback) {
      act.callback(response.data)
    }
  }
)

export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async (act, thunk) => {
    const response = await request(DELETE, `/api/devices/${act['id']}/`, {}, getAuthConfig(thunk));
    thunk.dispatch(fetchDevices());
    if(act.callback) {
      act.callback(response.data)
    }
  }
)
export const login = createAsyncThunk(
  'auth/login',
  async (act, thunk) => {
    const response = await request(POST, `/api/login/`, act);
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
    logs: [],
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
    updateLogs: (state, action) => {
      state.logs = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDevices.rejected, (state, action) => {
      if(action.error && (action.error.message.includes("401") || action.error.message.includes("403"))) {
        state.auth.token = null;
        remove("auth_token");
      }
    })
    builder.addCase(fetchLogs.pending, (state, action) => {
      state.logs = []
    })
  },
})

export const authTokenSelector = state => state.app.auth.access_token;
export const devicesSelector = state => state.app.devices;
export const logsSelector = state => state.app.logs;

export const {updateAuth, updateDevices, updateLogs} = appSlice.actions;


export default configureStore({
  reducer: {
    app: appSlice.reducer,
  }
})