import React from "react";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Root />;
}
