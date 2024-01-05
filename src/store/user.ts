import { getFirebaseApp } from '@/lib/firebase'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getAuth, type User } from 'firebase/auth'
import { store } from '.'
import { collectionSlice, fetchCollection } from './collection'

export type SerializedUser = {
  uid: string
  displayName: string | null
  photoURL: string | null
  email: string | null
}

export type UserState = {
  currentUser: SerializedUser | null
}

const initialState: UserState = {
  currentUser: null,
}

export type PayloadSetUser = SerializedUser | null

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<PayloadSetUser>) {
      state.currentUser = action.payload
    },
  },
})

getAuth(getFirebaseApp()).onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(
      userSlice.actions.setUser({
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      })
    )
    store.dispatch(fetchCollection())
  } else {
    store.dispatch(userSlice.actions.setUser(null))
    store.dispatch(collectionSlice.actions.reset())
  }
})
