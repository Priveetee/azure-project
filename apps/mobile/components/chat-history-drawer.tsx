import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SectionList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatePresence, MotiView } from "moti";
import { useState, useMemo } from "react";
import Feather from "@expo/vector-icons/Feather";
import type { Conversation } from "@meowww/shared";
import { ThreadItem } from "./thread-item";
import { ThreadSortSheet } from "./thread-sort-sheet";

type SortOrder = "desc" | "asc";

type ChatHistoryDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  onDeleteAll: () => void;
  onLongPressThread: (thread: Conversation) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
};

const getCategory = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days <= 7) return "Last 7 Days";
  return "Older";
};

export function ChatHistoryDrawer({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
  onDeleteAll,
  onLongPressThread,
  sortOrder,
  onSortChange,
}: ChatHistoryDrawerProps) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [isSortMenuOpen, setSortMenuOpen] = useState(false);

  const sections = useMemo(() => {
    const sorted = conversations.sort((a, b) => {
      const timeA = a.updatedAt.getTime();
      const timeB = b.updatedAt.getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    const filtered = sorted.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase()),
    );

    const grouped = filtered.reduce(
      (acc, conv) => {
        const category = getCategory(conv.updatedAt);
        if (!acc[category]) acc[category] = [];
        acc[category].push(conv);
        return acc;
      },
      {} as Record<string, Conversation[]>,
    );

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [conversations, search, sortOrder]);

  return (
    <AnimatePresence>
      {isOpen && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={onClose} />
          <MotiView
            from={{ translateX: -300 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: -300 }}
            transition={{ type: "timing", duration: 250 }}
            style={[
              styles.drawer,
              { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>History</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={onNewChat}
                  style={styles.actionButton}
                >
                  <Feather name="plus" size={18} color="#e5e7eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortMenuOpen(true)}
                  style={styles.actionButton}
                >
                  <Feather name="filter" size={18} color="#e5e7eb" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDeleteAll}
                  style={styles.actionButton}
                >
                  <Feather name="trash" size={18} color="#e5e7eb" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.searchWrapper}>
              <Feather
                name="search"
                size={16}
                color="#6b7280"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#6b7280"
                value={search}
                onChangeText={setSearch}
              />
            </View>
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ThreadItem
                  title={item.title}
                  isActive={item.id === currentConversationId}
                  onPress={() => onSelectThread(item.id)}
                  onDelete={() => onDeleteThread(item.id)}
                  onLongPress={() => onLongPressThread(item)}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeader}>{title}</Text>
              )}
            />
          </MotiView>
          <ThreadSortSheet
            isVisible={isSortMenuOpen}
            onClose={() => setSortMenuOpen(false)}
            currentSortOrder={sortOrder}
            onSortChange={(order) => {
              onSortChange(order);
              setSortMenuOpen(false);
            }}
          />
        </View>
      )}
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "80%",
    backgroundColor: "#0a0a0a",
    borderRightWidth: 1,
    borderRightColor: "#18181b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { color: "#f9fafb", fontSize: 20, fontWeight: "600" },
  headerActions: { flexDirection: "row", gap: 12 },
  actionButton: { padding: 4 },
  searchWrapper: { marginHorizontal: 16, marginBottom: 12 },
  searchIcon: { position: "absolute", left: 10, top: 11, zIndex: 1 },
  searchInput: {
    backgroundColor: "#18181b",
    borderRadius: 8,
    paddingLeft: 36,
    paddingVertical: 8,
    color: "#f9fafb",
  },
  sectionHeader: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
});
