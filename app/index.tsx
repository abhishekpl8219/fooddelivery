// app/index.tsx
import useAuthStore from "@/store/auth.store";
import { Redirect } from "expo-router";

export default function Index() {
  //   const isAuthenticated = false; // replace with real state later
  const { isAuthenticated } = useAuthStore();

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/sign-in"} />;
}
