import { StackNavigationProp } from "@react-navigation/stack";
import { FirebaseReducer, FirestoreReducer } from "react-redux-firebase";
import { RouteProp } from "@react-navigation/native";
import { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
  Home: { screen: string } | undefined;
  NotFound: undefined;
  Auth: { screen: string } | undefined;
};

export type BottomTabParamList = {
  Conversations: undefined;
  Settings: undefined;
};

export type AuthParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

export type ChatParamList = {
  Conversations: undefined;
  ChatScreen: { name: string; conversationId: string };
  ChatSettingsScreen: { conversationId: string };
  ContactSelection: undefined;
};

export type ConversationsParamList = {
  ConversationsScreen: undefined;
};

export type SettingsParamList = {
  SettingsScreen: undefined;
};

export type ParamList = ConversationsParamList &
  ChatParamList &
  AuthParamList &
  BottomTabParamList &
  RootStackParamList;

export type NavigatorAndScreenNames = "Conversations" &
  "ChatScreen" &
  "Settings" &
  "Auth" &
  "Home" &
  "NotFound" &
  "SignInScreen" &
  "SignUpScreen" &
  "ContactSelection" &
  "ConversationsScreen" &
  "SettingsScreen" &
  "ChatSettingsScreen";

export type NavigationProp = StackNavigationProp<ParamList>;

export type RoutesProp = RouteProp<ParamList, any>;
// TODO FIXME:
// Had to use 'any' type because it doesn't work when using extended type NavigatorAndScreenNames,
// see https://reactnavigation.org/docs/typescript to solve the issue.
// Types might need a bit of decomposition. Maybe you can't have a generic ScreenProps like here :'(

export type ScreenProps = {
  route: RoutesProp;
  navigation: NavigationProp;
};

export interface Profile {
  username: string;
  email: string;
  avatarUrl?: string;
}
export interface RootState {
  firebase: FirebaseReducer.Reducer<Profile>;
  firestore: FirestoreReducer.Reducer; // TODO: specify the firestore state interface
}
