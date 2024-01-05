import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  DocumentSnapshot,
  FirestoreDataConverter,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { RootState } from '.'

type ColletionOnDB = {
  events: number[]
}

type CollectionState = {
  events: number[]
}

const initialState: CollectionState = {
  events: [],
}

const getUid = (state: RootState) => {
  const uid = state.user.currentUser?.uid

  if (!uid) {
    throw new Error('User is not logged in')
  }

  return uid
}

const getRef = (uid: string) => {
  const db = getFirestore()
  const collectionRef = collection(db, 'eventCollectionIPF')
  return doc(collectionRef, uid)
}

export const addEvent = createAsyncThunk<
  number,
  number,
  {
    state: RootState
  }
>('collection/addEvent', async (eventId: number, thunkAPI) => {
  const uid = getUid(thunkAPI.getState())
  const docRef = getRef(uid)
  console.log(uid, docRef)

  await setDoc(
    docRef,
    {
      events: arrayUnion(eventId),
    },
    { merge: true }
  )
  return eventId
})

export const deleteEvent = createAsyncThunk<number, number>(
  'collection/deleteEvent',
  async (eventId: number, thunkAPI) => {
    const uid = getUid(thunkAPI.getState() as RootState)
    const docRef = getRef(uid)

    await updateDoc(docRef, {
      events: arrayRemove(eventId),
    })

    return eventId
  }
)

export const fetchCollection = createAsyncThunk<number[], void>(
  'collection/fetchCollection',
  async (_, thunkAPI) => {
    const uid = getUid(thunkAPI.getState() as RootState)
    const docRef = getRef(uid)

    const docSnap = (await getDoc(docRef)) as DocumentSnapshot<ColletionOnDB>
    return docSnap.data()?.events || []
  }
)

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEvent.pending, (state, action) => {
        if (!state.events.includes(action.meta.arg)) {
          state.events.push(action.meta.arg)
        }
      })
      .addCase(addEvent.rejected, (state, action) => {
        const index = state.events.indexOf(action.meta.arg)
        if (index !== -1) {
          state.events.splice(index, 1)
        }
      })
      .addCase(deleteEvent.pending, (state, action) => {
        const index = state.events.indexOf(action.meta.arg)
        if (index !== -1) {
          state.events.splice(index, 1)
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        if (!state.events.includes(action.meta.arg)) {
          state.events.push(action.meta.arg)
        }
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.events.length = 0
        state.events.push(...action.payload)
      })
  },
})
