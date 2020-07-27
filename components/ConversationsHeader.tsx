import * as React from "react";
import { Appbar } from "react-native-paper";
import {
  Platform,
  LayoutChangeEvent,
  TextStyle,
  StyleProp,
  Animated,
} from "react-native";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

export interface HeaderBarProps {
  onLayout: (e: LayoutChangeEvent) => void;
  allowFontScaling?: boolean | undefined;
  tintColor?: string | undefined;
  children?: string | undefined;
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>> | undefined;
}

export interface ConversationsHeaderProps {
  title?: string;
}

const ConversationsHeader = (
  props: HeaderBarProps & ConversationsHeaderProps
) => (
  <Appbar.Header>
    <Appbar.Content title={props.title} />
    <Appbar.Action icon="plus" onPress={() => {}} />
    <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
  </Appbar.Header>
);

export default ConversationsHeader;
