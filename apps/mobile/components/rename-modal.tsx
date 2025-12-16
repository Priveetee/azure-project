import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import type { Conversation } from "@meowww/shared";

type RenameModalProps = {
  thread: Conversation | null;
  onClose: () => void;
  onSave: (id: string, newTitle: string) => void;
};

export function RenameModal({ thread, onClose, onSave }: RenameModalProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (thread) {
      setTitle(thread.title);
    }
  }, [thread]);

  const handleSave = () => {
    if (thread && title.trim()) {
      onSave(thread.id, title.trim());
    }
  };

  return (
    <Modal
      visible={!!thread}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal}>
          <Text style={styles.title}>Rename Chat</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a new title..."
            placeholderTextColor="#6b7280"
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  title: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    color: "#f9fafb",
    fontSize: 16,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#f9fafb",
  },
  buttonText: {
    color: "#f9fafb",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "#0a0a0a",
  },
});
