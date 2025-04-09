import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { TabBar } from "@/components/TabBar";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

export default function HomeLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false, // Disable global header for all screens
        tabBarStyle: {
          display: getRouteName(route),
        },
      })}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="(index)"
        options={{
          title: "Home",
        }}
      />

      {/* Explore Screen */}
      <Tabs.Screen
        name="(add)"
        options={{
          // animation: "shift",
          title: "Contribute",
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          // animation: "shift",
          title: "Profile",
        }}
      />
      {/* Profile Screen */}
    </Tabs>
  );
}

const getRouteName = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  // console.log(routeName);
  if (routeName?.includes("addPlace") || routeName?.includes("undefined")) {
    return "none";
  }
  return "flex";
};
