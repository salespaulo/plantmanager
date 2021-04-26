import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

import photo from "../assets/user.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Header() {
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    async function loadUserName() {
      const user = await AsyncStorage.getItem("@plant_management:user");
      setUserName(user || "");
    }

    loadUserName();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greetings}>Olá</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image source={photo} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 80 / 2,
  },
  greetings: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
});
