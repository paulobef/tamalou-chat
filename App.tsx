import { StatusBar } from "expo-status-bar";
import React, { ReactChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Reducer, applyMiddleware } from "redux";
import { Provider, useSelector } from "react-redux";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// import "firebase/functions"; // <- needed if using httpsCallable
import { createStore, combineReducers, compose } from "redux";
import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  FirebaseReducer,
  FirestoreReducer,
  isLoaded,
  getFirebase,
} from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import firebaseConfig from "./config/firebase";
import { View, Text } from "react-native";
import { RootState } from "./types";
import thunk from "redux-thunk";

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};
const middlewares = [thunk.withExtraArgument(getFirebase)];

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

// Initialize other services on firebase instance
firebase.firestore();
// firebase.functions() // <- needed if using httpsCallable

// Add firebase to reducers
const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  firebase: firebaseReducer,
  firestore: firestoreReducer as Reducer, // TODO: get rid of the type inference
});

// Create store with reducers and initial state
const initialState: RootState = {
  firebase: Object.create(null),
  firestore: Object.create(null),
};
const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middlewares))
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

function AuthScreen({ children }: { children: JSX.Element }) {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <View>
        <Text>splash screen...</Text>
      </View>
    );
  return children;
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <AuthScreen>
              <Navigation colorScheme={colorScheme} />
            </AuthScreen>
          </ReactReduxFirebaseProvider>
        </Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
