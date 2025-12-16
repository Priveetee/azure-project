import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { AVAILABLE_MODELS } from "@meowww/shared";
import { getMobileProviderIcon } from "../lib/provider-icons";

type AssistantMenuProps = {
  visible: boolean;
  modelId?: string;
  onClose: () => void;
  onRetrySame: () => void;
  onRetryWithModel: (modelId: string) => void;
  onCopy: () => void;
};

export function AssistantMenu({
  visible,
  modelId,
  onClose,
  onRetrySame,
  onRetryWithModel,
  onCopy,
}: AssistantMenuProps) {
  if (!visible) return null;

  const models = AVAILABLE_MODELS;
  const currentModelId = modelId || models[0]?.id;

  const handleRetrySame = () => {
    onRetrySame();
    onClose();
  };

  const handleRetryModel = (id: string) => {
    onRetryWithModel(id);
    onClose();
  };

  const handleCopy = () => {
    onCopy();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.85}
              onPress={handleCopy}
            >
              <Feather name="copy" size={14} color="#e5e7eb" />
              <Text style={styles.headerButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.85}
              onPress={handleRetrySame}
            >
              <Feather name="refresh-cw" size={14} color="#e5e7eb" />
              <Text style={styles.headerButtonText}>Regenerate</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Or switch model</Text>
          </View>

          {models.map((m) => {
            const Icon = getMobileProviderIcon(m.id);
            const isActive = m.id === currentModelId;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.modelRow, isActive && styles.modelRowActive]}
                activeOpacity={0.9}
                onPress={() => handleRetryModel(m.id)}
              >
                <View style={styles.modelIcon}>
                  <Icon style={styles.modelIconGlyph} />
                </View>
                <View style={styles.modelTexts}>
                  <Text style={styles.modelName}>{m.name}</Text>
                  <Text style={styles.modelProvider}>
                    {m.provider.toUpperCase()}
                  </Text>
                </View>
                {isActive && (
                  <Feather
                    name="check"
                    size={16}
                    color="#22c55e"
                    style={styles.modelCheck}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#050509",
    borderWidth: 1,
    borderColor: "#27272a",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  headerButtonText: {
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: "500",
  },
  sectionTitleRow: {
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "500",
  },
  modelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  modelRowActive: {
    backgroundColor: "#111827",
  },
  modelIcon: {
    width: 24,
    height: 24,
    borderRadius: 9,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  modelIconGlyph: {
    fontSize: 16,
    color: "#f9fafb",
  },
  modelTexts: {
    flex: 1,
  },
  modelName: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "500",
  },
  modelProvider: {
    color: "#6b7280",
    fontSize: 11,
  },
  modelCheck: {
    marginLeft: 6,
  },
});
