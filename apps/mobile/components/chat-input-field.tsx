import { TextInput, StyleSheet } from "react-native";

type ChatInputFieldProps = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function ChatInputField({
  value,
  onChange,
  disabled = false,
}: ChatInputFieldProps) {
  return (
    <TextInput
      style={styles.input}
      multiline
      placeholder="Type your message here..."
      placeholderTextColor="#52525b"
      value={value}
      onChangeText={onChange}
      editable={!disabled}
      scrollEnabled
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#f9fafb",
    fontSize: 16,
    backgroundColor: "transparent",
  },
});
