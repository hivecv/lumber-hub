import {configureStore, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import request, {GET} from "./request";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchData = createAsyncThunk(
  'data/fetch',
  async (act, thunk) => {
    const response = await request(GET, `/some/data`);
    thunk.dispatch(update(response.data))
  }
)

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    inProgress: false,
  },
  reducers: {
    update: (state, action) => {
      Object.assign(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.inProgress = true
    })
  },
})

export const {update} = appSlice.actions;


export default configureStore({
  reducer: {
    app: appSlice.reducer,
  }
})