import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

import { EnvButton } from "../components/EnvButton";

import api from "../services/api";
import { Header } from "../components/Header";

import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import { PlantItem } from "../libs/storage";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

type EnvItem = {
  key: string;
  title: string;
};

export function PlantSelect() {
  const navigation = useNavigation();

  const [plantData, setPlantData] = useState<PlantItem[]>([]);
  const [plantFiltered, setPlantFiltered] = useState<PlantItem[]>([]);
  const [envData, setEnvData] = useState<EnvItem[]>([]);
  const [envSelected, setEnvSelected] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(1);

  async function fetchEnvs() {
    const { data } = await api.get(
      "/plants_environments?_sort=title&_order=asc"
    );
    setEnvData([{ key: "all", title: "Todos" }, ...data]);
  }

  async function fetchPlants() {
    const { data } = await api.get(
      `/plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );

    if (!data) {
      return setIsLoading(true);
    }

    if (page > 1) {
      setPlantData((oldValue) => [...oldValue, ...data]);
      setPlantFiltered((oldValue) => [...oldValue, ...data]);
    } else {
      setPlantData(data);
      setPlantFiltered(data);
    }

    setIsLoading(false);
    setIsLoadMore(false);
  }

  function handleEnvSelected(envKey: string) {
    setEnvSelected(envKey);

    if (envKey === "all") {
      return setPlantFiltered(plantData);
    }

    const filtered = plantData.filter((plant) =>
      plant.environments.includes(envKey)
    );

    setPlantFiltered(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setIsLoadMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantItem) {
    navigation.navigate("PlantSave", { plant });
  }

  useEffect(() => {
    fetchEnvs();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (isLoading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual hambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          data={envData}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => {
            return (
              <EnvButton
                title={item.title}
                active={item.key === envSelected}
                onPress={() => handleEnvSelected(item.key)}
              />
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.envList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={plantFiltered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            return (
              <PlantCardPrimary
                data={item}
                onPress={() => handlePlantSelect(item)}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            isLoadMore ? <ActivityIndicator color="green" /> : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  envList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});
