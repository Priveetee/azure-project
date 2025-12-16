import { View, Text, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type ThreadItemProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
  onDelete: () => void;
  onLongPress: () => void;
};

const SWIPE_THRESHOLD = -80;

export function ThreadItem({
  title,
  isActive,
  onPress,
  onDelete,
  onLongPress,
}: ThreadItemProps) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(
        SWIPE_THRESHOLD,
        Math.min(0, event.translationX),
      );
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD / 2) {
        translateX.value = withTiming(SWIPE_THRESHOLD, {}, (isFinished) => {
          if (isFinished) {
            scheduleOnRN(onDelete);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.deleteAction}>
        <Feather name="trash-2" size={18} color="#f87171" />
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
              styles.item,
              isActive && styles.itemActive,
              pressed && styles.itemPressed,
            ]}
          >
            <Feather
              name="message-square"
              size={16}
              color={isActive ? "#f9fafb" : "#9ca3af"}
            />
            <Text
              style={[styles.itemText, isActive && styles.itemTextActive]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#ef4444" },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#0a0a0a",
  },
  itemActive: { backgroundColor: "#18181b" },
  itemPressed: { backgroundColor: "#27272a" },
  itemText: { color: "#9ca3af", fontSize: 15 },
  itemTextActive: { color: "#f9fafb" },
});
