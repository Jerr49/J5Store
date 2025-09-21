import React from "react";
import { Switch } from "react-native";
import { useTheme } from "../../constants/theme";

type Props = { value: boolean; onValueChange: (val: boolean) => void };

const ThemeSwitch: React.FC<Props> = ({ value, onValueChange }) => {
  const { colors } = useTheme();
  return <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#e5e7eb", true: colors.primary }} thumbColor={value ? "#fff" : "#f4f3f4"} ios_backgroundColor="#e5e7eb" />;
};

export default ThemeSwitch;
