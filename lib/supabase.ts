import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import * as SecureStore from "expo-secure-store";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.REACT_NATIVE_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_NATIVE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(
  "https://czkgwqtuivxvsmygnzor.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2d3cXR1aXZ4dnNteWduem9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTU0OTksImV4cCI6MjA1NTA5MTQ5OX0.fyP8NtsC7URBRWy6B55tb0aXOpNC80xKDyd0dcoq4DA",
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
