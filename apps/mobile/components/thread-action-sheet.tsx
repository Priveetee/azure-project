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
import type { Conversation } from "@meowww/shared";

type ThreadActionSheetProps = {
  thread: Conversation | null;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function ThreadActionSheet({
  thread,
  onClose,
  onRename,
  onDelete,
}: ThreadActionSheetProps) {
  const isVisible = !!thread;

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
                <Text style={styles.title} numberOfLines={1}>
                  {thread?.title}
                </Text>
                <View style={styles.divider} />
                <TouchableOpacity onPress={onRename} style={styles.menuItem}>
                  <Feather name="edit-2" size={20} color="#e5e7eb" />
                  <Text style={styles.menuItemText}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.menuItem}>
                  <Feather name="trash-2" size={20} color="#ef4444" />
                  <Text style={[styles.menuItemText, { color: "#ef4444" }]}>
                    Delete
                  </Text>
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
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    color: "#e5e7eb",
    fontSize: 16,
  },
});
