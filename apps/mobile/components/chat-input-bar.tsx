import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChatInputField } from "./chat-input-field";
import AntDesign from "@expo/vector-icons/AntDesign";

type ChatInputBarProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: (message: string, modelId: string) => void;
  selectedModel: string;
  onChangeModel: (modelId: string) => void;
  canStop: boolean;
  onStop: () => void;
  disabled?: boolean;
};

export function ChatInputBar({
  value,
  onChange,
  onSend,
  selectedModel,
  onChangeModel,
  canStop,
  onStop,
  disabled = false,
}: ChatInputBarProps) {
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled && !canStop;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed, selectedModel);
    onChange("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.shell}>
        <ChatInputField value={value} onChange={onChange} disabled={disabled} />
        <View style={styles.actions}>
          {canStop && (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={onStop}
              disabled={!canStop}
            >
              <Text style={styles.stopText}>■</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <AntDesign
              name="arrow-up"
              size={20}
              color={canSend ? "#0a0a0a" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#0a0a0a",
    borderTopWidth: 1,
    borderTopColor: "#18181b",
  },
  shell: {
    width: "100%",
    backgroundColor: "#18181b",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  stopText: {
    color: "#f9fafb",
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#27272a",
  },
});
