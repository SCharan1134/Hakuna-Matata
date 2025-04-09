// import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  //   const { user } = useAuth();

  //   if (user) {
  //     return <Redirect href={"/(home)/(tabs)"} />;
  //   }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      {/* <Stack.Screen name="otp" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
