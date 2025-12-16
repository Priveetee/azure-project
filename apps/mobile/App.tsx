import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ChatScreen } from "./screens/chat-screen";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ChatScreen />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
