import React from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  Avatar,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { View } from "./Themed";
import { StyleSheet } from "react-native";

export default function AvatarUploader({
  avatarUrl,
  storage,
  storeDocument,
  textAvatar,
  onSuccess,
  onFailure,
}: {
  avatarUrl: string | undefined;
  storage: { url: string; name: string };
  storeDocument: { collection: string; id: string; property?: string };
  textAvatar: string;
  onSuccess: () => any;
  onFailure: (e: Error) => any;
}) {
  const [avatar, uploading, transferred, handlePickAvatar] = useImageUpload(
    () => onSuccess(),
    (e) => onFailure(e),
    { url: storage.url, name: storage.name },
    {
      collection: storeDocument.collection,
      id: storeDocument.id,
      property: storeDocument.property || "avatarUrl",
    },
    true // don't use save button and directly save after selecting the picture
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Avatar.Image
            style={{ width: 120, height: 120 }}
            size={120}
            source={avatar}
          />
        ) : avatarUrl ? (
          <Avatar.Image
            style={{ width: 120, height: 120 }}
            size={120}
            source={{ uri: avatarUrl }}
          />
        ) : (
          <Avatar.Text
            style={{ width: 120, height: 120 }}
            size={120}
            label={textAvatar}
          />
        )}
        {uploading ? (
          <IconButton
            style={styles.iconButton}
            icon={() => <ActivityIndicator animating={true} />}
          />
        ) : (
          <IconButton
            style={styles.iconButton}
            icon="camera"
            onPress={handlePickAvatar}
          >
            Choose avatar
          </IconButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "relative",
    flex: 1,
    marginBottom: 20,
  },
  iconButton: {
    position: "absolute",
    right: 1,
    bottom: 1,
    backgroundColor: "white",
  },
});
