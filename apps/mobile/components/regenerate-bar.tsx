import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { AVAILABLE_MODELS } from "@meowww/shared";
import { getMobileProviderIcon } from "../lib/provider-icons";

type RegenerateBarProps = {
  visible: boolean;
  currentModelId: string;
  onRegenerateSame: () => void;
  onRegenerateWithModel: (modelId: string) => void;
};

export function RegenerateBar({
  visible,
  currentModelId,
  onRegenerateSame,
  onRegenerateWithModel,
}: RegenerateBarProps) {
  if (!visible) return null;

  const models = AVAILABLE_MODELS;
  const currentModel = models.find((m) => m.id === currentModelId) || models[0];
  const CurrentIcon = getMobileProviderIcon(currentModel.id);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainButton}
        activeOpacity={0.85}
        onPress={onRegenerateSame}
      >
        <CurrentIcon style={styles.mainIcon} />
        <Text style={styles.mainText}>Regenerate</Text>
        <Feather name="refresh-cw" size={16} color="#e5e7eb" />
      </TouchableOpacity>
      <View style={styles.modelsRow}>
        {models.map((m) => {
          const Icon = getMobileProviderIcon(m.id);
          const isActive = m.id === currentModelId;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.modelChip, isActive && styles.modelChipActive]}
              activeOpacity={0.9}
              onPress={() => onRegenerateWithModel(m.id)}
            >
              <Icon style={styles.modelIcon} />
              <Text
                style={[styles.modelLabel, isActive && styles.modelLabelActive]}
                numberOfLines={1}
              >
                {m.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#18181b",
    backgroundColor: "#050509",
    gap: 8,
  },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#1f2937",
  },
  mainIcon: {
    fontSize: 16,
    color: "#f9fafb",
  },
  mainText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
  modelsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  modelChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  modelChipActive: {
    backgroundColor: "#1d4ed8",
  },
  modelIcon: {
    fontSize: 14,
    color: "#f9fafb",
  },
  modelLabel: {
    color: "#e5e7eb",
    fontSize: 11,
    maxWidth: 120,
  },
  modelLabelActive: {
    fontWeight: "600",
  },
});
