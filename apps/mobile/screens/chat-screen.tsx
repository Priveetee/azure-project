import { useState, Fragment } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, AnimatePresence } from "moti";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import type { Conversation, Message } from "@meowww/shared";
import { useChat } from "../hooks/use-chat";
import { useAutoScroll } from "../hooks/use-auto-scroll";
import { ChatInputBar } from "../components/chat-input-bar";
import { ModelSelector } from "../components/model-selector";
import { MessageBubble } from "../components/message-bubble";
import { ChatHistoryDrawer } from "../components/chat-history-drawer";
import { RenameModal } from "../components/rename-modal";
import { ThreadActionSheet } from "../components/thread-action-sheet";
import { AssistantMenu } from "../components/assistant-menu";

type AssistantMenuState = {
  visible: boolean;
  messageId: string | null;
  modelId?: string;
  content: string;
};

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [actionMenuTarget, setActionMenuTarget] = useState<Conversation | null>(
    null,
  );
  const [assistantMenu, setAssistantMenu] = useState<AssistantMenuState>({
    visible: false,
    messageId: null,
    modelId: undefined,
    content: "",
  });
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const {
    conversations,
    currentConversationId,
    currentConversation,
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    setSelectedModelFromOutside,
    streamingMessageId,
    sortOrder,
    setSortOrder,
    handleNewChat,
    handleSelectThread,
    handleDeleteThread,
    handleDeleteAll,
    handleRenameThread,
    handleSend,
    regenerateAssistantMessage,
    handleStop,
  } = useChat();

  const messages = currentConversation?.messages ?? [];

  const {
    ref,
    isAtBottom,
    onScroll,
    onContentSizeChange,
    scrollToEndManually,
  } = useAutoScroll();

  const handleScrollEvent = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    onScroll(event);
  };

  const handleLongPressThread = (thread: Conversation) => {
    setActionMenuTarget(thread);
  };

  const handleRequestRename = () => {
    setRenameTarget(actionMenuTarget);
    setActionMenuTarget(null);
  };

  const handleRequestDelete = () => {
    if (actionMenuTarget) {
      handleDeleteThread(actionMenuTarget.id);
    }
    setActionMenuTarget(null);
  };

  const animateCopy = (id: string) => {
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId((prev) => (prev === id ? null : prev));
    }, 180);
  };

  const handleLongPressMessage = async (msg: Message) => {
    if (!msg.content) return;
    await Clipboard.setStringAsync(msg.content);
    animateCopy(msg.id);
    Toast.show({
      type: "success",
      text1: "Copied",
      position: "top",
      visibilityTime: 900,
    });
  };

  const openAssistantMenu = (msg: Message) => {
    setAssistantMenu({
      visible: true,
      messageId: msg.id,
      modelId: msg.modelUsed,
      content: msg.content,
    });
  };

  const closeAssistantMenu = () => {
    setAssistantMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleRetrySame = () => {
    if (!assistantMenu.messageId) return;
    const modelId = assistantMenu.modelId || selectedModel;
    setSelectedModelFromOutside(modelId);
    regenerateAssistantMessage(assistantMenu.messageId, modelId);
  };

  const handleRetryWithModel = (modelId: string) => {
    if (!assistantMenu.messageId) return;
    setSelectedModelFromOutside(modelId);
    regenerateAssistantMessage(assistantMenu.messageId, modelId);
  };

  const handleCopyFromMenu = async () => {
    if (!assistantMenu.content || !assistantMenu.messageId) return;
    await Clipboard.setStringAsync(assistantMenu.content);
    animateCopy(assistantMenu.messageId);
    Toast.show({
      type: "success",
      text1: "Copied",
      position: "top",
      visibilityTime: 900,
    });
  };

  return (
    <Fragment>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Feather name="menu" size={22} color="#e5e7eb" />
          </TouchableOpacity>
          <ModelSelector
            selectedModelId={selectedModel}
            onChangeModel={setSelectedModel}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.chatContainer}>
            {currentConversation ? (
              <ScrollView
                ref={ref}
                onScroll={handleScrollEvent}
                onContentSizeChange={onContentSizeChange}
                scrollEventThrottle={32}
                contentContainerStyle={styles.scrollContent}
              >
                {messages.map((item) => {
                  const isAssistant = item.role === "assistant";
                  return (
                    <MessageBubble
                      key={item.id}
                      id={item.id}
                      role={item.role as "user" | "assistant"}
                      content={item.content}
                      modelDisplayName={item.modelUsed}
                      isStreaming={item.id === streamingMessageId}
                      onLongPress={() => handleLongPressMessage(item)}
                      onPressActions={
                        isAssistant ? () => openAssistantMenu(item) : undefined
                      }
                      isCopied={copiedMessageId === item.id}
                    />
                  );
                })}
              </ScrollView>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  Select or start a new chat
                </Text>
              </View>
            )}
            <AnimatePresence>
              {!isAtBottom && messages.length > 0 && (
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={styles.scrollButtonContainer}
                >
                  <TouchableOpacity
                    style={styles.scrollButton}
                    activeOpacity={0.8}
                    onPress={scrollToEndManually}
                  >
                    <Feather name="arrow-down" size={16} color="#e5e7eb" />
                  </TouchableOpacity>
                </MotiView>
              )}
            </AnimatePresence>
          </View>
          <View
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}
          >
            <ChatInputBar
              value={input}
              onChange={setInput}
              onSend={handleSend}
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              canStop={!!streamingMessageId}
              onStop={handleStop}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <ChatHistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        conversations={Object.values(conversations)}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
        onDeleteAll={handleDeleteAll}
        onLongPressThread={handleLongPressThread}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      <RenameModal
        thread={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSave={handleRenameThread}
      />
      <ThreadActionSheet
        thread={actionMenuTarget}
        onClose={() => setActionMenuTarget(null)}
        onRename={handleRequestRename}
        onDelete={handleRequestDelete}
      />
      <AssistantMenu
        visible={assistantMenu.visible}
        modelId={assistantMenu.modelId}
        onClose={closeAssistantMenu}
        onRetrySame={handleRetrySame}
        onRetryWithModel={handleRetryWithModel}
        onCopy={handleCopyFromMenu}
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  keyboardAvoidingView: { flex: 1 },
  chatContainer: { flex: 1, paddingHorizontal: 16 },
  scrollContent: {
    paddingBottom: 10,
    paddingTop: 4,
  },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#6b7280", fontSize: 16 },
  scrollButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scrollButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(39, 39, 42, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(63, 63, 70, 0.5)",
  },
});
