import * as React from "react";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  StyleSheet,
  Animated,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { View, Text } from "../components/Themed";
import { ScreenProps, RootState, Profile } from "../types";
import {
  List,
  Avatar,
  Title,
  FAB,
  ActivityIndicator,
} from "react-native-paper";
import { useSelector } from "react-redux";
import {
  useFirestoreConnect,
  useFirestore,
  FirebaseReducer,
} from "react-redux-firebase";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useRef, useState } from "react";

export interface Conversation {
  id: string;
  members: string[];
  owner: { id: string; name: string };
  title: string;
  avatarUrl?: string;
}

// ConversationsScreen wraps the ConversationList component to avoid errors due to missing auth state when logging out
export default function ConversationsScreen(props: ScreenProps) {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  if (!isLoaded(auth) || isEmpty(auth) || auth === undefined) {
    return (
      <View centerContent={true}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }
  return <ConversationList auth={auth} {...props} />;
}

interface ConversationListProps extends ScreenProps {
  auth: FirebaseReducer.AuthState;
}

/** MAIN CONVERSATION COMPONENT */
const ConversationList = ({ navigation, auth }: ConversationListProps) => {
  // Suppressed because the deletion will happen in the ChatSettingsScreen
  // const firestore = useFirestore();
  /*const handleDeleteConv = (id: string) =>
    firestore.delete({
      collection: "conversations",
      doc: id,
    });*/
  const profile: Profile = useSelector(
    (state: RootState) => state.firebase.profile
  );
  useFirestoreConnect([
    {
      collection: "conversations",
      where: ["members", "array-contains", auth.uid],
      storeAs: "myConversations",
    },
  ]);

  const conversations: Conversation[] = useSelector(
    (state: RootState) => state.firestore.ordered.myConversations
  );
  console.log(conversations);

  const handleGoToContactSelectionScreen = () =>
    navigation.navigate("ContactSelection");

  return (
    <View style={styles.container}>
      {isLoaded(conversations) ? (
        <ScrollView>
          <Title style={styles.title}>Hello, {profile.username}</Title>
          {conversations ? (
            <List.Section>
              {conversations.map(
                (conversation: Conversation, index: number) => (
                  <List.Item
                    key={index}
                    title={conversation.title || "Untitled"}
                    left={() =>
                      !conversation.avatarUrl ? (
                        <Avatar.Text
                          style={{ width: 55, height: 55 }}
                          size={55}
                          label={conversation.title[0].toUpperCase()}
                        />
                      ) : (
                        <Avatar.Image
                          style={{ width: 55, height: 55 }}
                          size={55}
                          source={{ uri: conversation.avatarUrl }}
                        />
                      )
                    }
                    onPress={() =>
                      navigation.navigate("ChatScreen", {
                        name: conversation.title,
                        conversationId: conversation.id,
                      })
                    }
                  />
                )
              )}
            </List.Section>
          ) : (
            <Text>Sorry, you don't have any conversations yet</Text>
          )}
        </ScrollView>
      ) : (
        <View centerContent={true}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleGoToContactSelectionScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    paddingLeft: 12,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#E40518",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
});
