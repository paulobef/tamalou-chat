import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, RootState, AuthParamList } from "../types";
import BottomTabNavigator, { ChatNavigator } from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { useSelector } from "react-redux";
import SignUpScreen from "../screens/SignUpScreen";
import { isEmpty, isLoaded } from "react-redux-firebase";
import SignInScreen from "../screens/SignInScreen";
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoaded(auth) && !isEmpty(auth) ? (
        <Stack.Screen name="Home" component={ChatNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const AuthStack = createStackNavigator<AuthParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignInScreen" component={SignInScreen} />
      <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}
