import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { AnimatePresence, MotiView } from "moti";
import Feather from "@expo/vector-icons/Feather";

type SortOrder = "desc" | "asc";

type ThreadSortSheetProps = {
  isVisible: boolean;
  onClose: () => void;
  currentSortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
};

export function ThreadSortSheet({
  isVisible,
  onClose,
  currentSortOrder,
  onSortChange,
}: ThreadSortSheetProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <AnimatePresence>
        {isVisible && (
          <Pressable style={styles.backdrop} onPress={onClose}>
            <MotiView
              from={{ translateY: 300 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 300 }}
              transition={{ type: "timing", duration: 250 }}
            >
              <Pressable style={styles.sheet} onPress={() => {}}>
                <Text style={styles.title}>Sort By</Text>
                <View style={styles.divider} />
                <TouchableOpacity
                  onPress={() => onSortChange("desc")}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>Newest first</Text>
                  {currentSortOrder === "desc" && (
                    <Feather name="check" size={20} color="#e5e7eb" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSortChange("asc")}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>Oldest first</Text>
                  {currentSortOrder === "asc" && (
                    <Feather name="check" size={20} color="#e5e7eb" />
                  )}
                </TouchableOpacity>
              </Pressable>
            </MotiView>
          </Pressable>
        )}
      </AnimatePresence>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#18181b",
    marginHorizontal: 8,
    marginBottom: 24,
    borderRadius: 14,
    overflow: "hidden",
  },
  title: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center",
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#27272a",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemText: {
    color: "#e5e7eb",
    fontSize: 16,
  },
});
