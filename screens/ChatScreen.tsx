import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { StyleSheet, Platform } from "react-native";
import { GiftedChat, ActionsProps } from "react-native-gifted-chat";
import { ScreenProps, RootState, Profile } from "../types";
import {
  useFirestoreConnect,
  isLoaded,
  useFirestore,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { Conversation } from "./ConversationsScreen";
import { useFocusEffect } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import { View, Text } from "../components/Themed";
import { CustomActions } from "../components/chat/InputToolbar";
import { useImageUpload } from "../hooks/useImageUpload";

export interface User {
  _id: string;
  name: string;
  avatar: string;
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

interface Reply {
  title: string;
  value: string;
  messageId?: any;
}

interface QuickReplies {
  type: "radio" | "checkbox";
  values: Reply[];
  keepIt?: boolean;
}

export default function ChatScreen({ route, navigation }: ScreenProps) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.navigate("Conversations");
            console.log("should navigate to Conversations");
          }}
        />
      ),
      headerRight: () => (
        <IconButton
          icon="dots-vertical"
          size={20}
          onPress={() =>
            navigation.navigate("ChatSettingsScreen", {
              conversationId: route.params?.conversationId,
            })
          }
        />
      ),
    });
  }, [navigation]);
  const firestore = useFirestore();
  useFirestoreConnect([
    {
      collection: "conversations",
      doc: route.params?.conversationId,
      subcollections: [{ collection: "messages" }],
      orderBy: ["createdAt", "asc"],
      storeAs: "messages",
    },
  ]);
  useFirestoreConnect([
    {
      collection: "conversations",
      doc: route.params?.conversationId,
    },
  ]);
  const messageHistory = useSelector(
    ({ firestore: { ordered } }: RootState) => ordered.messages
  );
  const conversation: Conversation = useSelector(
    ({ firestore: { data } }: RootState) =>
      data.conversations && data.conversations[route.params?.conversationId]
  );
  console.log(conversation);

  const formattedMessages = messageHistory
    ? messageHistory.map((message) => ({
        _id: message.id,
        text: message.text,
        createdAt: message.createdAt.toDate(),
        user: message.user,
      }))
    : [];
  formattedMessages.reverse();

  // TODO: We should use reselect to compose selectors to get a complete User
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile: Profile = useSelector(
    (state: RootState) => state.firebase.profile
  );

  const user: User = {
    _id: auth.uid,
    name: profile.username,
    avatar: "https://placeimg.com/140/140/any",
  };

  const onSend = (messages: Array<IMessage>) => {
    console.log(GiftedChat.append(messageHistory, messages));
    firestore.add(
      {
        collection: "conversations",
        doc: route.params?.conversationId,
        subcollections: [{ collection: "messages" }],
      },
      messages[0] // message user just wrote
    );
  };

  // the title needs to be updated from here so the settings change are taken into account
  const LoadTitle = (conversation: any) =>
    isLoaded(conversation)
      ? conversation.title
      : () => <ActivityIndicator animating={true} />;

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: LoadTitle(conversation),
    });
  });

  const [
    image,
    uploading,
    transferred,
    handlePickImage,
    handleSendImage,
  ] = useImageUpload(
    () => console.log("success"),
    () => console.log("error sending image"),
    {
      url: `shared/${route.params?.conversationId}`,
      name: Date.now().toString(),
    },
    {
      collection: "conversations",
    }
  );

  return !isLoaded(messageHistory) ? (
    <View centerContent={true}>
      <ActivityIndicator animating={true} />
    </View>
  ) : (
    <View style={styles.container}>
      <GiftedChat
        messages={formattedMessages}
        onSend={(messages) => onSend(messages)}
        renderActions={(props: ActionsProps) => (
          <CustomActions onChooseFromLibrary={handlePickImage} />
        )}
        user={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
