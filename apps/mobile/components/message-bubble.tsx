import { View, Text, StyleSheet, Pressable } from "react-native";
import { memo } from "react";
import { MotiView } from "moti";
import { AssistantBubble } from "./assistant-bubble";

type MessageRole = "user" | "assistant";

type MessageBubbleProps = {
  id: string;
  role: MessageRole;
  content: string;
  modelDisplayName?: string;
  isStreaming?: boolean;
  onLongPress?: () => void;
  onPressActions?: () => void;
  isCopied?: boolean;
};

function MessageBubbleComponent({
  id,
  role,
  content,
  modelDisplayName,
  isStreaming,
  onLongPress,
  onPressActions,
  isCopied = false,
}: MessageBubbleProps) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MotiView
      animate={{
        translateY: isCopied ? -4 : 0,
        scale: isCopied ? 0.98 : 1,
      }}
      transition={{
        type: "timing",
        duration: 160,
      }}
    >
      {children}
    </MotiView>
  );

  if (role === "assistant") {
    return (
      <Pressable onLongPress={onLongPress} delayLongPress={200}>
        <Wrapper>
          <AssistantBubble
            content={content}
            modelDisplayName={modelDisplayName}
            isStreaming={isStreaming}
            onPressActions={onPressActions}
          />
        </Wrapper>
      </Pressable>
    );
  }

  return (
    <Pressable onLongPress={onLongPress} delayLongPress={200}>
      <Wrapper>
        <View style={styles.userRow}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{content}</Text>
          </View>
        </View>
      </Wrapper>
    </Pressable>
  );
}

export const MessageBubble = memo(MessageBubbleComponent);

const styles = StyleSheet.create({
  userRow: {
    alignItems: "flex-end",
    marginBottom: 14,
  },
  userBubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#2563eb",
  },
  userText: {
    color: "#f9fafb",
    fontSize: 15,
    lineHeight: 22,
  },
});
