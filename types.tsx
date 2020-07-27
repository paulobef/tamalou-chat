import { StackNavigationProp } from "@react-navigation/stack";
import { FirebaseReducer, FirestoreReducer } from "react-redux-firebase";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

export type BottomTabParamList = {
  Conversations: undefined;
  Settings: undefined;
};

export type ConversationsParamList = {
  ConversationsScreen: undefined;
  ChatScreen: { name: string };
};

export type SettingsParamList = {
  SettingsScreen: undefined;
};

export type NavigationProp = StackNavigationProp<ConversationsParamList>;

export type NavigationProps = {
  navigation: NavigationProp;
};

export interface Profile {
  name: string;
  email: string;
}
export interface RootState {
  firebase: FirebaseReducer.Reducer<Profile>;
  firestore: FirestoreReducer.Reducer; // TODO: specify the firestore state interface
}
