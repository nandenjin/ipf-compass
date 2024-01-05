import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit'
import { userSlice } from './user'
import { collectionSlice } from './collection'

const rootReducer = combineReducers({
  collection: collectionSlice.reducer,
  user: userSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({ reducer: rootReducer })

export type AppDispatch = typeof store.dispatch
