import React, { useLayoutEffect } from "react";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import {
  useFirestoreConnect,
  useFirestore,
  isEmpty,
  isLoaded,
} from "react-redux-firebase";
import { ScreenProps, RootState } from "../types";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextInput, Button } from "react-native-paper";
import { Conversation } from "./ConversationsScreen";
import { HeaderBackButton } from "@react-navigation/stack";
import { View, Text } from "../components/Themed";
import AvatarUploader from "../components/AvatarUploader";
import { useSnackBar } from "../hooks/useSnackbar";

export default function ChatSettingsScreen({ route, navigation }: ScreenProps) {
  const [snackbarState, toggleSnackBar, dismissSnackBar] = useSnackBar();
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "conversations",
      doc: route.params?.conversationId,
    },
  ]);
  const conversation: Conversation = useSelector(
    ({ firestore: { data } }: RootState) =>
      data.conversations && data.conversations[route.params?.conversationId]
  );

  const formik = useFormik({
    initialValues: { name: isLoaded(conversation) ? conversation.title : "" },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required()
        .max(255, "Conversation title can not be more than 255 character long"),
    }),
    onSubmit: ({ name }) =>
      firestore.update(
        {
          collection: "conversations",
          doc: route.params?.conversationId,
        },
        { title: name }
      ),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.navigate("ChatScreen", {
              name: isLoaded(conversation) ? conversation.title : "",
              conversationId: route.params?.conversationId,
            });
          }}
        />
      ),
    });
  }, [navigation]);

  const { handleChange, handleBlur, handleSubmit, errors, values } = formik;
  return (
    <View style={{ flex: 1 }}>
      {!isLoaded(conversation) && isEmpty(conversation) ? (
        <View centerContent={true}>
          <ActivityIndicator animating={true} />
        </View>
      ) : (
        <View standardPadding={true}>
          <AvatarUploader
            textAvatar={conversation.title[0].toUpperCase()}
            avatarUrl={conversation.avatarUrl}
            onSuccess={() => toggleSnackBar("Avatar sucessfully updated !")}
            onFailure={(e) =>
              toggleSnackBar("Error uploading avatar: " + e.message)
            }
            storage={{ url: `avatars/${conversation.id}`, name: "avatar.jpg" }}
            storeDocument={{
              collection: "conversations",
              id: route.params?.conversationId,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={{ flexBasis: 300 }}
              label="Name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={
                typeof errors.name === null ||
                typeof errors.name === undefined ||
                errors.name === ""
              }
              value={values.name}
            />
            <View centerContent={true}>
              <Button onPress={handleSubmit}>Save</Button>
            </View>
          </View>
        </View>
      )}
      <Snackbar visible={snackbarState.visible} onDismiss={dismissSnackBar}>
        {snackbarState.message}
      </Snackbar>
    </View>
  );
}
