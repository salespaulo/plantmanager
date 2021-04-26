import React, { useState } from "react";

import {
  Platform,
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Button } from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function UserIdentify() {
  const navigator = useNavigation();
  const [isInputFilled, setIsInputFilled] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  async function handleSubmit() {
    if (isInputFilled) {
      try {
        await AsyncStorage.setItem("@plant_management:user", inputValue);
        return navigator.navigate("Confirmation", {
          icon: "smile",
          title: "Prontinho, " + inputValue,
          subtitle:
            "Agora vamos começar a cuidar das\nsuas plantinhas com muito cuidado.",
          buttonTitle: "Começar",
          nextScreen: "PlantSelect",
        });
      } catch (e) {
        return Alert.alert("Não foi possível salvar seu nome!");
      }
    }
    return Alert.alert("Me diz como chamar você?");
  }

  function handleInputChange(value: string) {
    setIsInputFilled(value !== "" || !!value);
    setInputValue(value);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.header}>
                {isInputFilled ? (
                  <Feather name={"smile"} style={styles.emoji} />
                ) : (
                  <Feather name={"meh"} style={styles.emoji} />
                )}
                <Text style={styles.title}>
                  Como podemos {"\n"}
                  chamar você?
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  isInputFilled && { borderColor: colors.green },
                ]}
                placeholder="Digite seu nome"
                onChangeText={handleInputChange}
              />
              <View style={styles.footer}>
                <Button onPress={handleSubmit}></Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  header: {
    alignItems: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 54,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  emoji: {
    fontSize: 50,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: "100%",
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: "center",
  },
  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
});
