import Header from "@/app/components/Header";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { base_url } from "../../constant/api";
import { Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance from "@/app/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Overview = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  const stats = [
    { title: "Total Application", value: 70, change: 20, up: true },
    { title: "Screening", value: 45, change: 40, up: true },
    { title: "Interviews", value: 41, change: 20, up: true },
    { title: "Offered", value: 15, change: 8, up: false },
    { title: "Yet To Join", value: 11, change: 12, up: false },
    { title: "Offer Declined", value: 1, change: 20, up: true },
    { title: "Hired", value: 21, change: 40, up: true },
  ];

  const fetchCompanies = async () => {
    if (!userData) return;

    try {
      const res = await axiosInstance.get(
        `${base_url}/core/userbranch_cmp_branch_list/${userData?.user_id}/`,
      );

      const fetchedCompanies = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setCompanies(fetchedCompanies);

      const storedCompany = await AsyncStorage.getItem("selectedCompany");

      if (storedCompany) {
        const parsed = JSON.parse(storedCompany);
        setSelectedCompany(parsed);
        return;
      }

      let selectedData = null;

      if (fetchedCompanies.length) {
        const first = fetchedCompanies[0];

        selectedData = {
          id: first.cmpid,
          name: first.cmp_name,
          company_shortname: first.cmp_shortname,
          branchid: first.branchid,
          branch_name: first.branch_name,
          branch_shortname: first.branch_shortname,
        };
      }

      if (selectedData) {
        setSelectedCompany(selectedData);

        await AsyncStorage.setItem(
          "selectedCompany",
          JSON.stringify(selectedData),
        );
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchCompanies();
    }
  }, [userData]);

  const updateBranch = async (companyData) => {
    try {
      const res = await axiosInstance.post(
        `${base_url}/core/grant_cmpbranch_permission/${userData?.user_id}/${companyData?.id}/`,
        {
          branchid: companyData?.branchid,
        },
      );

      await AsyncStorage.setItem("modulePermissions", JSON.stringify(res.data));
    } catch (error) {
      console.log("Error updating branch:", error);
    }
  };

  const handleBranchPress = () => {
    setBranchModalVisible(true);
  };

  const handleChange = (branchId) => {
    const selected = companies.find((c) => c.branchid === branchId);
    if (!selected) return;

    const selectedData = {
      id: selected.cmpid,
      name: selected.cmp_name,
      company_shortname: selected.cmp_shortname,
      branchid: selected.branchid,
      branch_name: selected.branch_name,
      branch_shortname: selected.branch_shortname,
    };

    const proceedChange = async () => {
      try {
        await AsyncStorage.setItem(
          "selectedCompany",
          JSON.stringify(selectedData),
        );

        const verify = await AsyncStorage.getItem("selectedCompany");

        setSelectedCompany(selectedData);
        await updateBranch(selectedData);
        setBranchModalVisible(false);

        Alert.alert("Success", "Branch changed successfully");
      } catch (error) {
        console.log("Error changing branch:", error);
        Alert.alert("Error", "Failed to change branch");
      }
    };

    Alert.alert("Change Branch", "Do you want to change the branch?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: proceedChange },
    ]);
  };

  const handleDatePress = () => {
    console.log("Open date picker");
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
        <Header title="Job List" navigate={() => navigation.goBack()} />

        {/* Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.dropdown} onPress={handleBranchPress}>
            <Text style={styles.dropdownText}>
              {" "}
              {selectedCompany?.branch_name || "Select Branch"}
            </Text>
            <Text style={styles.icon}>⌄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateBox} onPress={handleDatePress}>
            <Text style={styles.dateText}>July - 2025</Text>
            <Text style={styles.icon}>📅</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterIcon}>
            <Text>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <View style={styles.cardContainer}>
          {stats.map((item, index) => (
            <StatCard key={index} item={item} />
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={branchModalVisible}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setBranchModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {companies.map((item) => (
              <TouchableOpacity
                key={item.branchid}
                onPress={() => {
                  setBranchModalVisible(false);
                  handleChange(item.branchid);
                }}
                style={styles.branchItem}
              >
                <Text>
                  {item.cmp_shortname}-{item.branch_name}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const StatCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.menuDots}>⋮</Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardValue}>{item.value}</Text>

        <Text
          style={[
            styles.changeText,
            { color: item.up ? "#16a34a" : "#dc2626" },
          ]}
        >
          {item.up ? "↑" : "↓"} {item.change}%
        </Text>
      </View>
    </View>
  );
};

export default Overview;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  header: {
    fontSize: 22,
    fontWeight: "600",
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },

  dropdown: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },

  dropdownText: {
    fontSize: 14,
    color: "#333",
  },

  dateBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },

  dateText: {
    fontSize: 14,
    color: "#333",
  },

  filterIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 14,
    color: "#888",
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 14,
    color: "#6b7280",
  },

  menuDots: {
    color: "#9ca3af",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  changeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
  },

  branchItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
};
