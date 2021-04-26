import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";

import DateTimePicker, { Event } from "@react-native-community/datetimepicker";

import { useNavigation, useRoute } from "@react-navigation/core";
import { SvgFromUri } from "react-native-svg";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { format, isBefore } from "date-fns";

import { Button } from "../components/Button";

import { PlantItem, plantSave } from "../libs/storage";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

import waterdrop from "../assets/waterdrop.png";

type PlantSaveParams = {
  plant: PlantItem;
};

export function PlantSave() {
  const navigator = useNavigation();
  const route = useRoute();
  const { plant } = route.params as PlantSaveParams;

  const [dateTimeValue, setDateTimeValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  async function handlePlantSave() {
    try {
      await plantSave({
        ...plant,
        dateTimeNotification: dateTimeValue,
      });
      navigator.navigate("MyPlants", {
        icon: "smile",
        title: "Tudo certo",
        subtitle:
          "Agora vamos começar a cuidar das suas plantinhas com bastante\nplantinhas com muito cuidado.",
        buttonTitle: "Muito Obrigado por confiar em nós (todo)",
        nextScreen: "MyPlants",
      });
    } catch (e) {
      Alert.alert("Nao foi possível salvar!");
    }
  }

  function handleChangeTime(_event: Event, dateTime: Date | undefined) {
    if (Platform.OS === "android") {
      setShowDatePicker((oldValue) => !oldValue);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setDateTimeValue(new Date());
      return Alert.alert(`Escolha uma hora no futuro!`);
    }

    if (dateTime) {
      setDateTimeValue(dateTime);
    }
  }

  function openDateTimePickerForAndroid() {
    setShowDatePicker((oldValue) => !oldValue);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri uri={plant.photo} height={150} width={150} />
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantAbout}>{plant.about}</Text>
        </View>
        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image source={waterdrop} style={styles.tipImage} />
            <Text style={styles.tipText}>{plant.water_tips}</Text>
          </View>
        </View>
        <Text>Escolha o melhor horário para ser lembrado:</Text>

        {showDatePicker && (
          <DateTimePicker
            value={dateTimeValue}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}

        {Platform.OS === "android" && (
          <TouchableOpacity
            style={styles.dateTimePickerButton}
            onPress={openDateTimePickerForAndroid}
          >
            <Text style={styles.dateTimePickerText}>{`Mudar ${format(
              dateTimeValue,
              "HH:mm"
            )}`}</Text>
          </TouchableOpacity>
        )}
        <Button title="Cadastrar Planta" onPress={handlePlantSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.shape,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipImage: {
    width: 50,
    height: 50,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: "justify",
  },
  alertLabel: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
