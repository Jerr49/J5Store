import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../components/navigation/MainNavigator"; // adjust path

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password))
      return { label: "Strong", color: colors.success, score: 3 };
    if (mediumRegex.test(password))
      return { label: "Medium", color: colors.warning, score: 2 };
    if (password.length > 0)
      return { label: "Weak", color: colors.error, score: 1 };
    return null;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    passwordStrength?.score! >= 2;

  const handleChangePassword = () => {
    if (!isFormValid) return;
    // show modal instead of alert
    setSuccessModal(true);
  };

  const handleProceed = () => {
    setSuccessModal(false);
    navigation.navigate("Settings");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Change Password
      </Text>

      {/* Current Password */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Current Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry={!showCurrent}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity
          onPress={() => setShowCurrent(!showCurrent)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showCurrent ? "eye" : "eye-off"}
            size={20}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="New Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setShowNew(!showNew)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showNew ? "eye" : "eye-off"}
            size={20}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Password Strength */}
      {passwordStrength && (
        <View style={styles.strengthWrapper}>
          <View
            style={[styles.strengthBar, { backgroundColor: colors.border }]}
          >
            <Animated.View
              style={[
                styles.strengthFill,
                {
                  backgroundColor: passwordStrength.color,
                  flex: passwordStrength.score,
                },
              ]}
            />
          </View>
          <Text
            style={[styles.strengthText, { color: passwordStrength.color }]}
          >
            {passwordStrength.label}
          </Text>
        </View>
      )}

      {/* Confirm Password */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Confirm Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirm)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={showConfirm ? "eye" : "eye-off"}
            size={20}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isFormValid ? colors.primary : colors.disabled,
          },
        ]}
        disabled={!isFormValid}
        onPress={handleChangePassword}
      >
        <Text style={[styles.buttonText, { color: colors.card }]}>
          Update Password
        </Text>
      </TouchableOpacity>

      {/* ✅ Success Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType="slide"
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color={colors.success}
              style={{ marginBottom: 10 }}
            />
            <Text style={[styles.modalText, { color: colors.text }]}>
              Password changed successfully!
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleProceed}
            >
              <Text style={[styles.modalButtonText, { color: colors.card }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 18,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  iconWrapper: {
    marginLeft: 8,
  },
  strengthWrapper: {
    marginBottom: 15,
  },
  strengthBar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
  },
  strengthFill: {
    flex: 1,
  },
  strengthText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // ✅ Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
