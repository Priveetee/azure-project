import { StyleSheet, View, Pressable, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import { getProviderFromModel } from "@meowww/shared";
import { getMobileProviderIcon } from "../lib/provider-icons";
import { AssistantContent } from "./assistant-content";
import Toast from "react-native-toast-message";
import { MotiView } from "moti";
import Feather from "@expo/vector-icons/Feather";

const PROVIDER_GRADIENTS: Record<string, { from: string; to: string }> = {
  openai: { from: "#020617", to: "#18181b" },
  google: { from: "#1d4ed8", to: "#be123c" },
  anthropic: { from: "#27272a", to: "#18181b" },
  meta: { from: "#27272a", to: "#18181b" },
  mistral: { from: "#7c3aed", to: "#ec4899" },
  xai: { from: "#020617", to: "#0f172a" },
  fallback: { from: "#06b6d4", to: "#0ea5e9" },
};

type AssistantBubbleProps = {
  content: string;
  isStreaming?: boolean;
  modelDisplayName?: string;
  onPressActions?: () => void;
};

export function AssistantBubble({
  content,
  isStreaming = false,
  modelDisplayName,
  onPressActions,
}: AssistantBubbleProps) {
  const providerKey = getProviderFromModel(modelDisplayName);
  const ProviderIcon = getMobileProviderIcon(modelDisplayName || "");
  const gradient =
    PROVIDER_GRADIENTS[providerKey] || PROVIDER_GRADIENTS.fallback;
  const showTyping = isStreaming && !content;

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Toast.show({
      type: "success",
      text1: "Copied!",
      position: "top",
      visibilityTime: 1500,
    });
  };

  const handleCopyTable = async (markdown: string) => {
    await Clipboard.setStringAsync(markdown);
    Toast.show({
      type: "success",
      text1: "Copied!",
      position: "top",
      visibilityTime: 1500,
    });
  };

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: gradient.from }]}>
        <ProviderIcon style={styles.avatarIcon} />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <View style={styles.messageWrapper}>
            {showTyping ? (
              <View style={styles.typingBubble}>
                <MotiView
                  from={{ translateY: 0 }}
                  animate={{ translateY: -5 }}
                  transition={{
                    loop: true,
                    type: "timing",
                    duration: 400,
                    delay: 0,
                  }}
                  style={styles.dot}
                />
                <MotiView
                  from={{ translateY: 0 }}
                  animate={{ translateY: -5 }}
                  transition={{
                    loop: true,
                    type: "timing",
                    duration: 400,
                    delay: 100,
                  }}
                  style={styles.dot}
                />
                <MotiView
                  from={{ translateY: 0 }}
                  animate={{ translateY: -5 }}
                  transition={{
                    loop: true,
                    type: "timing",
                    duration: 400,
                    delay: 200,
                  }}
                  style={styles.dot}
                />
              </View>
            ) : (
              <AssistantContent
                content={content}
                onCopyCode={handleCopyCode}
                onCopyTable={handleCopyTable}
              />
            )}
          </View>

          {!showTyping && onPressActions && (
            <TouchableOpacity
              onPress={onPressActions}
              hitSlop={8}
              style={styles.actionsButton}
              activeOpacity={0.8}
            >
              <Feather name="more-horizontal" size={16} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { fontSize: 18, color: "#ffffff" },
  contentWrapper: { flex: 1, maxWidth: "85%" },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  messageWrapper: {
    flex: 1,
  },
  actionsButton: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  typingBubble: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#18181b",
    alignSelf: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6b7280",
  },
});
