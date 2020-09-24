import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { RootStackParamList, RootState } from "../types";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.replace(isLoaded(auth) && !isEmpty(auth) ? "Home" : "Auth")
        }
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
