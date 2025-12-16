import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import Markdown from "react-native-markdown-display";
import type { ASTNode } from "react-native-markdown-display";

type AssistantContentProps = {
  content: string;
  onCopyCode: (code: string) => void;
  onCopyTable: (markdown: string) => void;
};

const getTextContent = (cell: any): string => {
  try {
    return cell.children[0].children[0].content;
  } catch (e) {
    return "";
  }
};

export function AssistantContent({
  content,
  onCopyCode,
  onCopyTable,
}: AssistantContentProps) {
  const markdown = content || " ";

  return (
    <View style={styles.container}>
      <Markdown
        style={markdownStyles}
        rules={{
          fence: (node: ASTNode) => {
            const typedNode = node as any;
            const language = typedNode.sourceInfo?.trim() || "";
            const code = typedNode.content;
            return (
              <Pressable key={node.key} onLongPress={() => onCopyCode(code)}>
                <View style={codeStyles.wrapper}>
                  <View style={codeStyles.header}>
                    <Text style={codeStyles.langText}>
                      {language || "code"}
                    </Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={codeStyles.body}>{code}</Text>
                  </ScrollView>
                </View>
              </Pressable>
            );
          },
          table: (node: ASTNode) => {
            const tableNode = node as any;
            const headerRow = tableNode.children[0]?.children[0];
            const bodyRows = tableNode.children[1]?.children || [];

            if (!headerRow) return null;

            const headerContent: string[] =
              headerRow.children.map(getTextContent);
            const bodyContent: string[][] = bodyRows.map((row: any) =>
              row.children.map(getTextContent),
            );

            const columns: string[][] = headerContent.map(
              (_: string, colIndex: number) => [
                headerContent[colIndex],
                ...bodyContent.map((row: string[]) => row[colIndex]),
              ],
            );

            let markdownTable = `| ${headerContent.join(" | ")} |\n| ${headerContent
              .map(() => "---")
              .join(" | ")} |\n`;
            bodyContent.forEach((row: string[]) => {
              markdownTable += `| ${row.join(" | ")} |\n`;
            });

            return (
              <View key={node.key} style={tableStyles.container}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <Pressable onLongPress={() => onCopyTable(markdownTable)}>
                    <View style={tableStyles.table}>
                      {columns.map((columnData, colIndex) => (
                        <View key={colIndex} style={tableStyles.column}>
                          {columnData.map((cellText, rowIndex) => (
                            <View
                              key={rowIndex}
                              style={
                                rowIndex === 0 ? tableStyles.th : tableStyles.td
                              }
                            >
                              <Text style={tableStyles.cellText}>
                                {cellText}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </Pressable>
                </ScrollView>
              </View>
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
  },
});

const markdownStyles = StyleSheet.create({
  body: { color: "#e5e7eb", fontSize: 15, lineHeight: 22 },
  link: { color: "#38bdf8", textDecorationLine: "underline" },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f9fafb",
    marginTop: 14,
    marginBottom: 6,
  },
  code_inline: {
    backgroundColor: "#18181b",
    color: "#22d3ee",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontFamily: "monospace",
    fontSize: 14,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: "#4b5563",
    paddingLeft: 10,
    marginVertical: 8,
    backgroundColor: "rgba(24,24,27,0.5)",
  },
});

const codeStyles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
    backgroundColor: "#09090b",
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#18181b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  langText: { color: "#9ca3af", fontSize: 12 },
  body: {
    color: "#e5e7eb",
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
  },
});

const tableStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
  },
  table: {
    flexDirection: "row",
  },
  column: {
    borderRightWidth: 1,
    borderRightColor: "#27272a",
  },
  th: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#18181b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  td: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#09090b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  cellText: {
    color: "#e5e7eb",
  },
});
