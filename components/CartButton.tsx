import { images } from "@/constants";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CartButton = () => {
  const totalitems = 10;
  return (
    <TouchableOpacity className="cart-btn">
      <Image source={images.bag} className="size-5" resizeMode="contain" />
      {totalitems > 0 && (
        <View className="cart-badge">
          <Text className="text-white small-bold">{totalitems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;

const styles = StyleSheet.create({});
