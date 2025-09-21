// screens/profile/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../constants/theme";
import { logout } from "../../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";

type ActionRowProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
};

const ActionRow = ({ icon, label, onPress, danger }: ActionRowProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.actionRow,
        { borderBottomColor: colors.border },
        danger && { borderBottomColor: "transparent" },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text
          style={[
            styles.rowLabel,
            { color: danger ? "#ef4444" : colors.text },
          ]}
        >
          {label}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.secondaryText} />
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
  Alert.alert("Log Out", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Log Out",
      onPress: () => dispatch(logout()), // ✅ just dispatch, navigator will handle redirect
      style: "destructive",
    },
  ]);
};


  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Cover + Avatar */}
      <View style={styles.coverWrapper}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.cover}
        />
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: user?.avatar || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || "User Name"}
          </Text>
          <Text style={[styles.userEmail, { color: colors.secondaryText }]}>
            {user?.email || "user@example.com"}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
            Orders
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>5</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
            Wishlist
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.text }]}>1200</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
            Points
          </Text>
        </View>
      </View>

      {/* Personal Info */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Personal Info
        </Text>
        <View style={styles.infoRow}>
          <Feather name="phone" size={18} color={colors.secondaryText} />
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            {user?.phone || "+123 456 7890"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={18} color={colors.secondaryText} />
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            {user?.address || "No address saved"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="calendar" size={18} color={colors.secondaryText} />
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            Joined Jan 2024
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ActionRow
          icon={<Feather name="edit-3" size={20} color={colors.secondaryText} />}
          label="Edit Profile"
        />
        <ActionRow
          icon={<MaterialIcons name="payment" size={20} color={colors.secondaryText} />}
          label="Payment Methods"
        />
        <ActionRow
          icon={<FontAwesome5 name="map-marker-alt" size={18} color={colors.secondaryText} />}
          label="Addresses"
        />
        <ActionRow
          icon={<Feather name="lock" size={20} color={colors.secondaryText} />}
          label="Change Password"
        />
        <ActionRow
          icon={<Feather name="settings" size={20} color={colors.secondaryText} />}
          label="Settings"
        />
      </View>

      {/* Logout */}
      <View style={[styles.card, { marginTop: 15, backgroundColor: colors.card }]}>
        <ActionRow
          icon={<Feather name="log-out" size={20} color="#ef4444" />}
          label="Logout"
          danger
          onPress={handleLogout} // 👈 hook up logout
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Cover + Avatar
  coverWrapper: { position: "relative" },
  cover: {
    height: 120,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarWrapper: { alignItems: "center", marginTop: -50 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  userName: { fontSize: 20, fontWeight: "bold" },
  userEmail: { fontSize: 14 },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 15,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 2,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 14 },

  // Personal Info
  card: {
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  infoText: { fontSize: 14 },

  // Action rows
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 15 },
  rowLabel: { fontSize: 15 },
});

export default ProfileScreen;
