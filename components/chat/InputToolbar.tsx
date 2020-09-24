import React from "react";
import { Image } from "react-native";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
  InputToolbarProps,
  ActionsProps,
} from "react-native-gifted-chat";
import { IconButton } from "react-native-paper";

export const renderInputToolbar = (props: InputToolbarProps) => (
  <InputToolbar {...props} />
);

interface CustomActionsProps extends ActionsProps {
  onChooseFromLibrary: () => void;
}

export const CustomActions = ({
  onChooseFromLibrary,
  ...props
}: CustomActionsProps) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <IconButton style={{ width: 32, height: 32 }} icon="camera" />}
    options={{
      "Choose From Library": onChooseFromLibrary,
      Cancel: () => {
        console.log("Cancel");
      },
    }}
    optionTintColor="#222B45"
  />
);
