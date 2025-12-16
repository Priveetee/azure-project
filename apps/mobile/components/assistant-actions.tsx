import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

type AssistantActionsProps = {
  timestamp?: Date;
  modelDisplayName?: string;
  copiedLabel: "md" | "plain" | null;
  onCopyMarkdown: () => void;
  onCopyPlain: () => void;
  onRegenerate: () => void;
};

export function AssistantActions({
  timestamp,
  modelDisplayName,
  onCopyMarkdown,
  onCopyPlain,
  onRegenerate,
}: AssistantActionsProps) {
  const [isCopyMenuVisible, setCopyMenuVisible] = useState(false);

  const handleCopyMarkdown = () => {
    onCopyMarkdown();
    setCopyMenuVisible(false);
  };

  const handleCopyPlain = () => {
    onCopyPlain();
    setCopyMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.metaContainer}>
        {timestamp && (
          <Text style={styles.metaText}>
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        {modelDisplayName && (
          <Text style={styles.metaText}>{modelDisplayName}</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => setCopyMenuVisible(true)}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Feather name="copy" size={14} color="#e5e7eb" />
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRegenerate}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Feather name="refresh-cw" size={14} color="#e5e7eb" />
          <Text style={styles.buttonText}>Regenerate</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isCopyMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCopyMenuVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setCopyMenuVisible(false)}
        >
          <View style={styles.copyMenu}>
            <TouchableOpacity
              onPress={handleCopyMarkdown}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>Copy with Markdown</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity onPress={handleCopyPlain} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Copy without Markdown</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  metaContainer: {
    flexDirection: "row",
    gap: 8,
  },
  metaText: {
    fontSize: 11,
    color: "#6b7280",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  buttonText: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  copyMenu: {
    width: "70%",
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: "#f9fafb",
    fontSize: 14,
    textAlign: "center",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#27272a",
  },
});
