import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, ImageSourcePropType } from "react-native";
import { View } from "../components/Themed";
import { ScreenProps, RootState, Profile } from "../types";
import { List, Avatar, Chip, ActivityIndicator, FAB } from "react-native-paper";
import { useSelector } from "react-redux";
import { apps, auth } from "firebase";
import {
  useFirestoreConnect,
  isLoaded,
  useFirestore,
} from "react-redux-firebase";
import { HeaderBackButton } from "@react-navigation/stack";

interface User extends Profile {
  id: string;
}

function containsObject(obj: object, list: Array<object>) {
  for (let i = 0; i < list.length; i++) {
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
}

export default function ContactSelectionScreen({ navigation }: ScreenProps) {
  useFirestoreConnect([{ collection: "users" }]);
  const users: User[] = useSelector(
    (state: RootState) => state.firestore.ordered.users
  );
  const firestore = useFirestore();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile: Profile = useSelector(
    (state: RootState) => state.firebase.profile
  );

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSelectUser = (selectedUser: User) => {
    if (!containsObject(selectedUser, selectedUsers)) {
      setSelectedUsers([...selectedUsers, selectedUser]);
    }
  };

  const handleCreateConv = () => {
    console.log(profile);
    firestore
      .add("conversations", {
        owner: { id: auth.uid, username: profile.username },
        members: [
          ...selectedUsers.map((selectedUser) => selectedUser.id),
          auth.uid,
        ],
        title: selectedUsers.map((user) => user.username).join(", "),
      })
      .then((docRef) => {
        navigation.navigate("ChatScreen", {
          name: selectedUsers.map((user) => user.username).join(", "),
          conversationId: docRef.id,
        });
      });
  };

  if (__DEV__ && isLoaded(users)) users.map((user: User) => console.log(user));

  return (
    <View style={styles.container}>
      <View>
        {selectedUsers.map((user: User, index: number) => (
          <Chip
            key={index}
            avatar={
              user.avatarUrl ? (
                <Avatar.Image size={12} source={{ uri: user.avatarUrl }} />
              ) : (
                <Avatar.Text label={user.username[0].toUpperCase()} />
              )
            }
            onPress={() => console.log("Pressed")}
          >
            {user.username}
          </Chip>
        ))}
      </View>
      {isLoaded(users) ? (
        <List.Section>
          {users.map((user: User, index: number) =>
            user.username === profile.username ? null : (
              <List.Item
                key={index}
                title={user.username}
                left={() =>
                  !user.avatarUrl ? (
                    <Avatar.Text
                      size={55}
                      label={user.username[0].toUpperCase()}
                    />
                  ) : (
                    <Avatar.Image size={55} source={{ uri: user.avatarUrl }} />
                  )
                }
                onPress={() => handleSelectUser(user)}
              />
            )
          )}
        </List.Section>
      ) : (
        <View centerContent={true}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <FAB
        style={styles.fab}
        label={"Create Conversation"}
        icon="plus"
        onPress={handleCreateConv}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
