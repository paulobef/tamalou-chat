import * as React from "react";
import { StyleSheet, Button } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { NavigationProps } from "../types";
import { List, Avatar } from "react-native-paper";

export default function ConversationsScreen({ navigation }: NavigationProps) {
  const titles = ["First Conversation", "Second Conversation"];
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title={titles[0]}
          left={() => <Avatar.Text size={55} label="XD" />}
          onPress={() => navigation.navigate("ChatScreen", { name: titles[0] })}
        />
        <List.Item
          title={titles[1]}
          left={() => <Avatar.Text size={55} label="XD" />}
          onPress={() => navigation.navigate("ChatScreen", { name: titles[1] })}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
