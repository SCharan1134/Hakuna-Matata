import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { Image } from "react-native";
StyleSheet;
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Page() {
  const { profile, logout } = useAuth();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-5">
      <View
        style={styles.shadow}
        className="bg-gray-300 rounded-lg flex-row items-center gap-4 p-4"
      >
        <View>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text>Select Avatar</Text>
            </View>
          )}
        </View>
        <View>
          <Text className="font-semibold text-lg">{profile.name}</Text>
          <Text>{profile.email}</Text>
          <Text className="mt-2 underline-offset-2 underline">
            View activity
          </Text>
        </View>
      </View>
      <View className="flex-row gap-4 items-start mt-4">
        <TouchableOpacity
          style={styles.shadow}
          onPress={() => {
            router.push("/(home)/(profile)/bookmarks");
          }}
          className="flex-1  bg-white h-36 rounded-lg p-4 items-center justify-center flex"
        >
          <Text className="text-center text-lg">Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shadow}
          onPress={() => {
            router.push("/(home)/(profile)/like");
          }}
          className="flex-1  bg-white h-36 rounded-lg p-4 items-center justify-center flex"
        >
          <Text className="text-center text-lg">Liked</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.shadow}
        onPress={() => {
          router.push("/(home)/(profile)/profile");
        }}
        className="flex mt-4 bg-white rounded-lg p-4 "
      >
        <Text className="text-lg">Your Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.shadow}
        onPress={() => {
          router.push("/(home)/(profile)/password");
        }}
        className="flex mt-4 bg-white rounded-lg p-4 "
      >
        <Text className="text-lg">Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.shadow}
        className="flex mt-4 bg-white rounded-lg p-4 "
        onPress={async () => {
          logout();
        }}
      >
        <Text className="text-lg">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // X and Y shadow position
    shadowOpacity: 0.1, // Opacity of shadow
    shadowRadius: 24, // Blur radius
    elevation: 2, // Required for Android shadows
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: { width: 75, height: 75, borderRadius: 50, marginBottom: 16 },
  avatarPlaceholder: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
});
