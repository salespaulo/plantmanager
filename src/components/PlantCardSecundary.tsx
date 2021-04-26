import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Animated from "react-native-reanimated";

import { SvgFromUri } from "react-native-svg";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

type PlantCardSecundaryProps = {
  data: {
    name: string;
    photo: string;
    hour: string;
  };
  handleRemove: () => void;
} & RectButtonProps;

export function PlantCardSecundary({
  data,
  handleRemove,
  ...rest
}: PlantCardSecundaryProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => {
        return (
          <>
            <Animated.View>
              <View>
                <RectButton style={styles.buttomRemove} onPress={handleRemove}>
                  <Feather name="trash" size={32} color={colors.white} />
                </RectButton>
              </View>
            </Animated.View>
          </>
        );
      }}
    >
      <RectButton style={styles.container} {...rest}>
        <SvgFromUri uri={data.photo} width={50} height={50} />
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.details}>
          <Text style={styles.timeLabel}>Regar às</Text>
          <Text style={styles.time}>{data.hour}</Text>
        </View>
      </RectButton>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.shape,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 25,
    alignItems: "center",
    marginVertical: 5,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontFamily: fonts.heading,
    color: colors.heading,
  },
  details: {
    alignItems: "flex-end",
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark,
  },
  buttomRemove: {
    width: 120,
    height: 85,
    backgroundColor: colors.red,
    marginTop: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    right: 20,
    paddingLeft: 10,
  },
});
