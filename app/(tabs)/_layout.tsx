import { Slot } from "expo-router";

const _Layout = () => {
  const isAuthenticated = true;
  //return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/sign-in"} />;
  return <Slot />;
};

export default _Layout;
