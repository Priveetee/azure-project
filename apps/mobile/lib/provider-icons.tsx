import type { ComponentType } from "react";
import type { TextStyle } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { getProviderFromModel, type ProviderKey } from "@meowww/shared";

type IconProps = { style?: TextStyle };
type IconComponent = ComponentType<IconProps>;

const ICONS_MOBILE: Record<ProviderKey, IconComponent> = {
  openai: (props) => (
    <AntDesign
      name="open-ai"
      {...props}
      style={[
        props.style,
        {
          color: "#10B981",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
  google: (props) => (
    <MaterialCommunityIcons
      name="google-downasaur"
      {...props}
      style={[
        props.style,
        {
          color: "#ffffff",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
  anthropic: (props) => (
    <MaterialCommunityIcons
      name="robot-excited-outline"
      {...props}
      style={[
        props.style,
        {
          color: "#F97316",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
  mistral: (props) => (
    <FontAwesome6
      name="cat"
      {...props}
      style={[
        props.style,
        {
          color: "orange",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
  meta: (props) => (
    <FontAwesome6
      name="meta"
      {...props}
      style={[
        props.style,
        {
          color: "#0866FF",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
  xai: (props) => (
    <AntDesign
      name="x"
      {...props}
      style={[
        props.style,
        {
          color: "#FFFFFF",
          textAlignVertical: "center",
          textAlign: "center",
        },
      ]}
    />
  ),
};

export function getMobileProviderIcon(modelId: string): IconComponent {
  const provider = getProviderFromModel(modelId);
  return ICONS_MOBILE[provider];
}
