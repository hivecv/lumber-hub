import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import request, {GET, POST} from "./request";
import {get} from './localstorage';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchData = createAsyncThunk(
  'data/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/some/data`);
    thunk.dispatch(updateAuth(response.data))
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
    inProgress: false,
    profile: {},
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.inProgress = true
    })
  },
})

export const authTokenSelector = state => state.app.auth.access_token

export const {updateAuth} = appSlice.actions;


export default configureStore({
  reducer: {
    app: appSlice.reducer,
  }
})