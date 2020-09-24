import * as React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type Hide = {
  hide?: boolean;
  centerContent?: boolean;
  standardPadding?: boolean;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = Hide & ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  if (props.hide) {
    return null;
  }

  return (
    <DefaultView
      style={[
        { backgroundColor },
        style,
        props.centerContent
          ? { alignItems: "center", justifyContent: "center", flex: 1 }
          : null,
        props.standardPadding
          ? {
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 20,
              paddingBottom: 10,
            }
          : null,
      ]}
      {...otherProps}
    />
  );
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
