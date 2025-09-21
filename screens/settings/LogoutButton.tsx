import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme";

type Props = { onPress: () => void };

const LogoutButton: React.FC<Props> = ({ onPress }) => {
  const { isDark } = useTheme();
  return (
    <TouchableOpacity style={[styles.button, isDark && styles.dark]} onPress={onPress} activeOpacity={0.8}>
      <MaterialIcons name="logout" size={20} color="#ef4444" />
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 16, padding: 16, backgroundColor: "rgba(239,68,68,0.1)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(239,68,68,0.2)" },
  dark: { borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.15)" },
  text: { color: "#ef4444", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

export default LogoutButton;
