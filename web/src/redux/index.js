import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import request, {DELETE, GET, POST, PUT} from "./request";
import {get, save} from './localstorage';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleError(e, thunk) {
  if(!e || !e.response) {
    return
  }

  if(e.response.status === 401) {
    save("auth_token", null)
    thunk.dispatch(updateAuth({
      access_token: null,
      token_type: null,
      error: null,
    }))
  }
}

const getAuthConfig = (thunk, extraHeaders = {}) => {
  const token = authTokenSelector(thunk.getState());
  return {headers: {Authorization: `Bearer ${token}`, ...extraHeaders}}
}


export const fetchLogs = createAsyncThunk(
  'logs/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/api/users/me/devices/${act}/logs/`, {}, getAuthConfig(thunk));
    thunk.dispatch(updateLogs(response.data.reverse()))
  }
)


export const fetchActions = createAsyncThunk(
  'actions/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/api/users/me/devices/${act}/actions/`, {}, getAuthConfig(thunk));
    thunk.dispatch(updateActions(response.data))
  }
)

export const fetchDevices = createAsyncThunk(
  'devices/fetch',
  async (act, thunk) => {
    try {
      const response = await request(GET, `/api/users/me/devices/`, {}, getAuthConfig(thunk));
      thunk.dispatch(updateDevices(response.data))
    } catch (e) {
      handleError(e, thunk);
    }
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
export const addAction = createAsyncThunk(
  'actions/add',
  async (act, thunk) => {
    const response = await request(POST, `/api/users/me/devices/${act['id']}/actions/`, act['data'], getAuthConfig(thunk));
    thunk.dispatch(fetchActions(act['id']))
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
    logs: [],
    actions: [],
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
    updateActions: (state, action) => {
      state.actions = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLogs.pending, (state, action) => {
      state.logs = []
    })
  },
})

export const authTokenSelector = state => state.app.auth.access_token;
export const devicesSelector = state => state.app.devices;
export const logsSelector = state => state.app.logs;
export const actionsSelector = state => state.app.actions;

export const {updateAuth, updateDevices, updateLogs, updateActions} = appSlice.actions;


export default configureStore({
  reducer: {
    app: appSlice.reducer,
  }
})