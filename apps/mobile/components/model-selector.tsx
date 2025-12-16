import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { AVAILABLE_MODELS } from "@meowww/shared";
import { getMobileProviderIcon } from "../lib/provider-icons";
import { MotiView, AnimatePresence } from "moti";

type ModelSelectorProps = {
  selectedModelId: string;
  onChangeModel: (modelId: string) => void;
  disabled?: boolean;
};

export function ModelSelector({
  selectedModelId,
  onChangeModel,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) ??
    AVAILABLE_MODELS[0];
  const ProviderIcon = getMobileProviderIcon(currentModel.id);

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <ProviderIcon style={styles.triggerIcon} />
        <Text style={styles.triggerText} numberOfLines={1}>
          {currentModel.name}
        </Text>
        <Text style={styles.triggerChevron}>⌄</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <AnimatePresence>
          {open && (
            <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
              <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                transition={{ type: "timing", duration: 250 }}
                style={styles.dropdown}
                onStartShouldSetResponder={() => true}
              >
                <FlatList
                  data={AVAILABLE_MODELS}
                  keyExtractor={(m) => m.id}
                  renderItem={({ item }) => {
                    const Icon = getMobileProviderIcon(item.id);
                    const isSelected = item.id === currentModel.id;
                    return (
                      <Pressable
                        style={({ pressed }) => [
                          styles.item,
                          pressed && styles.itemPressed,
                        ]}
                        onPress={() => {
                          onChangeModel(item.id);
                          setOpen(false);
                        }}
                      >
                        <View style={styles.itemLeft}>
                          {isSelected ? (
                            <Text style={styles.itemCheck}>✓</Text>
                          ) : (
                            <View style={styles.itemCheckPlaceholder} />
                          )}
                          <Icon style={styles.itemIcon} />
                        </View>
                        <View style={styles.itemTexts}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemProvider}>
                            {item.provider}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </MotiView>
            </Pressable>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#18181b",
  },
  triggerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    fontSize: 22,
  },
  triggerText: {
    maxWidth: 160,
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "500",
  },
  triggerChevron: {
    marginLeft: 10,
    color: "#a1a1aa",
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  dropdown: {
    width: "86%",
    borderRadius: 20,
    backgroundColor: "#18181b",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 14,
  },
  itemPressed: {
    backgroundColor: "#27272a",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 80,
  },
  itemCheck: {
    color: "#f9fafb",
    fontSize: 18,
    marginRight: 8,
  },
  itemCheckPlaceholder: {
    width: 18,
    marginRight: 8,
  },
  itemIcon: {
    width: 26,
    height: 26,
    fontSize: 22,
  },
  itemTexts: {
    flex: 1,
  },
  itemName: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "500",
  },
  itemProvider: {
    color: "#9ca3af",
    fontSize: 12,
    textTransform: "capitalize",
    marginTop: 2,
  },
});
