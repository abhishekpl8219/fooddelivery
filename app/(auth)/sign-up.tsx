import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const Signup = () => {
  const [issubmitting, setissubmitting] = useState(false);
  const [form, setform] = useState({ name: "", email: "", password: "" });
  const submit = async () => {
    const { email, password, name } = form;
    if (!email || !password || !name)
      return Alert.alert(
        "Error",
        "Please enter valid email address and password"
      );
    setissubmitting(true);
    try {
      Alert.alert("Success", "loggedin");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setissubmitting(false);
    }
  };
  return (
    <View className="gap-10 bg-white p-5">
      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setform((prev) => ({ ...prev, name: text }))}
        label="Full-Name"
      />
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setform((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setform((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign-Up" onPress={submit} isLoading={issubmitting} />
      <View className="flex justify-center mt-1 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default Signup;
