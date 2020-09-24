import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ConversationsScreen from "../screens/ConversationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import {
  BottomTabParamList,
  ConversationsParamList,
  SettingsParamList,
  ChatParamList,
} from "../types";
import ChatScreen from "../screens/ChatScreen";
import ConversationsHeader, {
  HeaderBarProps,
} from "../components/ConversationsHeader";
import ContactSelectionScreen from "../screens/ContactSelectionScreen";
import { Button, IconButton } from "react-native-paper";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Conversations"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Conversations"
        component={ConversationsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ChatStack = createStackNavigator<ChatParamList>();

export function ChatNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name={"Conversations"}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name={"ChatScreen"}
        component={ChatScreen}
        options={({ route }) => ({
          headerTitle: route.params.name,
        })}
      />
      <ChatStack.Screen
        name={"ChatSettingsScreen"}
        component={ChatSettingsScreen}
        options={{ headerTitle: "Conversation Settings" }}
      />
      <ChatStack.Screen
        name={"ContactSelection"}
        component={ContactSelectionScreen}
        options={{ headerTitle: "Select Contacts" }}
      />
    </ChatStack.Navigator>
  );
}

const SettingsStack = createStackNavigator<SettingsParamList>();

export function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
    </SettingsStack.Navigator>
  );
}

const ConversationsStack = createStackNavigator<ConversationsParamList>();

export function ConversationsNavigator() {
  return (
    <ConversationsStack.Navigator>
      <ConversationsStack.Screen
        name="ConversationsScreen"
        component={ConversationsScreen}
        options={{ headerTitle: "Conversations" }}
      />
    </ConversationsStack.Navigator>
  );
}
