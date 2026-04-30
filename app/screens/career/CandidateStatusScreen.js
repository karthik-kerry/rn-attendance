import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "@/app/utils/axiosInstance";
import { base_url } from "../../constant/api";
import Header from "@/app/components/Header";

export default function CandidateStatusScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { type, candidateId, jobId, selectedRecord, refreshCandidates } =
    route.params || {};

  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidateStatus, setCandidateStatus] = useState([]);

  const fetchCandidateStatus = async () => {
    try {
      const res = await axiosInstance.get(
        `${base_url}/career/career_jobcandidate_status_crud/${userData?.user_id}/${userData?.branchid?.companyid}/`,
      );
      setCandidateStatus(
        res.data.map((item) => ({ label: item.name, value: item.id })),
      );
    } catch (err) {
      console.log("Status error", err);
    }
  };

  useEffect(() => {
    if (userData) fetchCandidateStatus();
  }, [userData]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchStatusTimeline = async () => {
    try {
      if (!userData) return;

      const companyId = userData.branchid.companyid;
      if (!companyId) return;

      let endpoint = "";

      if (type === "job") {
        endpoint = `${base_url}/career/career_jobtravelling_canjob_r/${userData.user_id}/${companyId}/?jobposting=${jobId}`;
      } else if (type === "candidate") {
        endpoint = `${base_url}/career/career_jobtravelling_canjob_r/${userData.user_id}/${companyId}/?candidate=${candidateId}`;
      }

      const res = await axiosInstance.get(endpoint);

      const filteredData = res.data.filter((item) => {
        const isValidStatus = !(
          item.job_posting_status_id === null &&
          item.job_posting_status_name === null
        );

        if (!isValidStatus) {
          return false;
        }

        if (type === "job") {
          return item.candidate === candidateId;
        }

        if (type === "candidate") {
          return item.jobposting === jobId;
        }

        return false;
      });
      const formatted = filteredData
        .map((item) => ({
          status: item.job_posting_status_name,
          date: item.updated_at,
          feedback: item.remarks,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTimelineData(formatted);
    } catch (error) {
      console.error("Timeline fetch error:", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchStatusTimeline();
    }
  }, [userData, type, candidateId, jobId]);

  const handleStatusUpdate = async () => {
    // ── Guards (before setLoading to avoid spinner on validation fails) ──
    if (!userData) {
      Alert.alert("Error", "Missing user data.");
      return;
    }

    const companyId = userData.branchid?.companyid;
    if (!companyId) {
      Alert.alert("Error", "Missing company information.");
      return;
    }

    if (!selectedRecord) {
      Alert.alert("Error", "No job selected.");
      return;
    }

    if (!status) {
      // ← rename to match your state variable
      Alert.alert("Validation", "Please select a status.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        jobcan_updateid: selectedRecord?.id,
        jobposting: selectedRecord?.jobposting?.id,
        candidate: selectedRecord?.candidate,
        source_of_hiring: selectedRecord?.source_of_hiring,
        candidate_base_status: selectedRecord?.candidate_base_status,
        jobrelivedemp: selectedRecord?.jobrelivedemp,
        designation: selectedRecord?.designation,
        report_to: selectedRecord?.report_to,
        final_ctc: selectedRecord?.final_ctc,
        date_of_joining: selectedRecord?.date_of_joining,
        page_jv: selectedRecord?.page_jv,
        tat_date_start: selectedRecord?.tat_date_start,
        tat_date_end: selectedRecord?.tat_date_end,
        max_days: selectedRecord?.max_days,
        level: selectedRecord?.level,
        position_closed_date: selectedRecord?.position_closed_date,
        number_of_day_closedtheposition:
          selectedRecord?.number_of_day_closedtheposition,
        budget_vs_finialctc: selectedRecord?.budget_vs_finialctc,
        lock: selectedRecord?.lock,
        flag: selectedRecord?.flag,
        createvia: selectedRecord?.createvia,

        job_candidate_status: status,
        remarks: feedback,
      };
      console.log("📦 Payload before sending:", payload);
      const formData = new FormData();
      formData.append("jobcandidate_payload", JSON.stringify(payload));

      const endpoint = `${base_url}/career/career_jobcandidate_cu/${userData.user_id}/${companyId}/`;

      const res = await axiosInstance.patch(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Success",
        res?.data?.message || "Status updated successfully",
      );

      setStatus(null);
      setFeedback("");
      fetchStatusTimeline();
      refreshCandidates?.();
    } catch (error) {
      console.error("Status update error:", error?.response?.data ?? error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Update failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />

      <Header
        title="Update Candidate Status"
        navigate={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* STATUS */}
          <Text style={styles.label}>Status</Text>
          <Dropdown
            style={styles.dropdown}
            data={candidateStatus}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={status}
            onChange={(item) => setStatus(item.value)}
            containerStyle={styles.dropdownContainer}
            renderItem={(item) => (
              <View style={styles.customItem}>
                <Text style={styles.customItemText}>{item.label}</Text>
              </View>
            )}
          />

          {/* FEEDBACK */}
          <Text style={styles.label}>Feedback</Text>
          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Enter feedback..."
            value={feedback}
            onChangeText={setFeedback}
          />

          {/* TIMELINE */}
          <Text style={styles.timelineTitle}>Status Timeline:</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {timelineData.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* LEFT SIDE */}
                <View style={styles.timelineLeft}>
                  <View style={styles.dot} />
                  {index !== timelineData.length - 1 && (
                    <View style={styles.line} />
                  )}
                </View>

                {/* CONTENT */}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>
                    <Text style={styles.bold}>{item.status}</Text> –{" "}
                    {formatDate(item.date)}
                  </Text>

                  {item.feedback && (
                    <Text style={styles.feedback}>
                      Feedback: {item.feedback}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleStatusUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F8",
    paddingVertical: 16,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FBFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  customItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#F8FBFF",
  },
  customItemText: {
    fontSize: 16,
    color: "#111827",
  },

  textArea: {
    height: 100,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlignVertical: "top",
    marginBottom: 20,
  },

  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  timelineLeft: {
    width: 20,
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 2,
  },

  timelineContent: {
    flex: 1,
    paddingLeft: 10,
  },

  timelineText: {
    fontSize: 14,
    color: "#111827",
  },

  bold: {
    fontWeight: "600",
  },

  feedback: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },

  footer: {
    flexDirection: "row",
    marginTop: 10,
  },

  cancelBtn: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#64748B",
    padding: 12,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },

  cancelText: {
    color: "#6B7280",
    fontWeight: "500",
  },

  updateBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },

  updateText: {
    color: "#fff",
    fontWeight: "600",
  },
});
