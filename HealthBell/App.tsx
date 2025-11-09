import React from "react";
import "./global.css";
import * as Font from "expo-font";
import { View, ActivityIndicator } from "react-native";
import Root from "./src/components/Root";

export default function App() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"), // الخط الجديد العريض جدًا
      });
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <Root />;
}
