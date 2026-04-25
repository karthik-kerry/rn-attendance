import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function CandidateStatusScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { type, candidateId, jobId, selectedRecord } = route.params;

  const [status, setStatus] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Offer", value: "offer" },
    { label: "Offer - Accepted", value: "accepted" },
    { label: "Hired", value: "hired" },
    { label: "Rejected", value: "rejected" },
  ];

  // 🔹 FETCH TIMELINE
  const fetchTimeline = async () => {
    try {
      let endpoint = "";

      if (type === "candidate") {
        endpoint = `${base_url}/career/career_jobtravelling_canjob_r/${userData.user_id}/${selectedGrandCompany?.id}/?candidate=${candidateId}`;
      } else {
        endpoint = `${base_url}/career/career_jobtravelling_canjob_r/${userData.user_id}/${selectedGrandCompany?.id}/?jobposting=${jobId}`;
      }

      const res = await axios.get(endpoint);

      const formatted = res.data
        .map((item) => ({
          status: item.status_name || item.status,
          date: item.created_at,
          feedback: item.remarks,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTimelineData(formatted);

      // auto select latest status
      if (formatted.length > 0) {
        setStatus(formatted[0].status);
      }
    } catch (err) {
      console.log("Timeline Error:", err);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  // 🔹 UPDATE STATUS (YOUR LOGIC ADAPTED)
  const handleStatusUpdate = async () => {
    setLoading(true);

    try {
      if (!selectedRecord) {
        alert("No Job selected");
        return;
      }

      if (!status) {
        alert("Please select status");
        return;
      }

      const payload = {
        ...selectedRecord?.raw,
        jobcan_updateid: selectedRecord?.raw?.id,

        // override
        job_candidate_status: status,
        remarks: feedback,
      };

      const formData = new FormData();
      formData.append("jobcandidate_payload", JSON.stringify(payload));

      const endpoint = `${base_url}/career/career_jobcandidate_cu/${userId?.user_id}/${selectedGrandCompany?.id}/`;

      const res = await axios.patch(endpoint, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      alert(res?.data?.message || "Status updated");

      setFeedback("");
      fetchTimeline(); // 🔥 refresh timeline
    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* STATUS */}
        <Text style={styles.label}>Status</Text>
        <Dropdown
          style={styles.dropdown}
          data={statusOptions}
          labelField="label"
          valueField="value"
          placeholder="Select"
          value={status}
          onChange={(item) => setStatus(item.value)}
        />

        {/* FEEDBACK */}
        <Text style={styles.label}>Feedback</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />

        {/* TIMELINE */}
        <Text style={styles.timelineTitle}>Status Timeline:</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {timelineData.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.dot} />
                {index !== timelineData.length - 1 && (
                  <View style={styles.line} />
                )}
              </View>

              <View style={styles.timelineContent}>
                <Text style={styles.timelineText}>
                  <Text style={styles.bold}>{item.status}</Text> – {item.date}
                </Text>

                {item.feedback && (
                  <Text style={styles.feedback}>Feedback: {item.feedback}</Text>
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
  );
}
