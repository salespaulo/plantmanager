import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { formatDistance } from "date-fns";

import { Header } from "../components/Header";
import { PlantCardSecundary } from "../components/PlantCardSecundary";

import { loadPlant, PlantItem, StoragePlantItem } from "../libs/storage";

import { pt } from "date-fns/locale";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

import waterdrop from "../assets/waterdrop.png";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextWaterd, setNextWatered] = useState<string>();

  function handlePlantRemove(item: any) {
    Alert.alert("Remover", `Deseja remover a ${item.name}?`, [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const data = await AsyncStorage.getItem("@plantmanager:plants");
            const plants = data ? (JSON.parse(data) as StoragePlantItem) : {};

            delete plants[item.id];

            await AsyncStorage.setItem(
              "@plantmanager:plants",
              JSON.stringify(plants)
            );

            setMyPlants((oldValue) => oldValue.filter((v) => v.id !== item.id));
          } catch (e) {
            Alert.alert("Não foi possível remover!");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    async function loadStorageMyPlants() {
      const plants = await loadPlant();
      const dateNotify = new Date(plants[0].dateTimeNotification).getTime();
      const now = new Date().getTime();

      const nextTime = formatDistance(dateNotify, now, { locale: pt });

      setMyPlants(plants);
      setIsLoading(false);
      setNextWatered(
        `Não esqueça de regar a ${plants[0].name} à ${nextTime} horas.`
      );
    }

    loadStorageMyPlants();
  });

  return (
    <View style={styles.container}>
      <Header></Header>
      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImg} />
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas:</Text>
        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={(item) => {
            return (
              <PlantCardSecundary
                data={item as any}
                handleRemove={() => handlePlantRemove(item)}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImg: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
