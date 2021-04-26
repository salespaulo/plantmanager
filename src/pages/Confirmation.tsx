import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Button } from "../components/Button";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useNavigation, useRoute } from "@react-navigation/core";

type ConfirmationParams = {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: "smile" | "meh";
  nextScreen: string;
};

export function Confirmation() {
  const navigation = useNavigation();
  const routes = useRoute();

  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen,
  } = routes.params as ConfirmationParams;

  function handleMoveOn() {
    navigation.navigate(nextScreen);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Feather name={icon} style={styles.emoji} />

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.footer}>
          <Button title={buttonTitle} onPress={handleMoveOn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: "center",
    color: colors.heading,
    lineHeight: 38,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 10,
    color: colors.heading,
  },
  emoji: {
    fontSize: 78,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 20,
  },
});
