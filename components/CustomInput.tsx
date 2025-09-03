import { CustomInputProps } from "@/type";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder = "Enter text",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
}: CustomInputProps) => {
  const [isFocused, setisFocused] = useState(false);
  return (
    <View>
      <Text className="label">{label}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setisFocused(true)}
        onBlur={() => setisFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#888"
        className={
          isFocused ? "border-primary" : "border-gray-300 bg-white-100"
        }
      />
    </View>
  );
};

export default CustomInput;
