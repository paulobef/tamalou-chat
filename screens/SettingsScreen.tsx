import * as React from "react";
import {
  StyleSheet,
  Platform,
  ImageSourcePropType,
  ImageURISource,
} from "react-native";

import { Text, View } from "../components/Themed";
import { Button, ActivityIndicator, Snackbar } from "react-native-paper";
import { useFirebase } from "react-redux-firebase";
import * as ImagePicker from "expo-image-picker";
import { ScreenProps, RootState } from "../types";
import { Avatar } from "react-native-paper";
import * as Permissions from "expo-permissions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackBar } from "../hooks/useSnackbar";
import { useImageUpload } from "../hooks/useImageUpload";
import AvatarUploader from "../components/AvatarUploader";

export default function SettingsScreen({ navigation }: ScreenProps) {
  const [snackbarState, toggleSnackBar, dismissSnackBar] = useSnackBar();
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  return (
    <View style={styles.container} standardPadding={true}>
      <AvatarUploader
        textAvatar={profile.username[0].toUpperCase()}
        avatarUrl={profile.avatarUrl}
        onSuccess={() => toggleSnackBar("Avatar sucessfully updated !")}
        onFailure={(e) =>
          toggleSnackBar("Error uploading avatar: " + e.message)
        }
        storage={{ url: `avatars/${auth.uid}`, name: "avatar.jpg" }}
        storeDocument={{ collection: "users", id: auth.uid }}
      />
      <View style={styles.centeredContainer}>
        <Button
          onPress={() => {
            firebase.logout();
            //navigation.replace("Auth");
          }}
        >
          Log out
        </Button>
      </View>
      <Snackbar visible={snackbarState.visible} onDismiss={dismissSnackBar}>
        {snackbarState.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
