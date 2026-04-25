import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import { KeyboardAvoidingView } from "react-native";
import { base_url } from "../constant/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomNavigation } from "react-native-paper";

const AddCandidateModal = ({ visible, onClose, onSubmit, jobId, job }) => {
  const { width } = Dimensions.get("window");
  const [form, setForm] = useState({
    candidate: null,
    status: null,
    designation: "",
    reportTo: null,
    finalCTC: "",
    doj: new Date(),
    level: null,
    payJV: null,
    remarks: "",
    max_days: "",
    tat_date_start: "",
    source_of_hiring: null,
    budget_vs_finalctc: "",
  });

  const [userData, setUserData] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidatesRaw, setCandidatesRaw] = useState([]);
  const [candidateStatus, setCandidateStatus] = useState([]);
  const [reportTo, setReportTo] = useState([]);
  const [level, setLevel] = useState([]);
  const [payJVList, setPayJVList] = useState([]);
  const [sourceOfHiring, setSourceOfHiring] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (visible && job) {
      setForm((prev) => ({
        ...prev,
        max_days: job.max_days ? String(job.max_days) : "",
        tat_date_start: job.tat_date
          ? new Date(job.tat_date).toLocaleDateString("en-GB")
          : "",
        source_of_hiring: null,
        budget_vs_finalctc: "",
      }));
    }
  }, [visible, job]);

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchCandidateFilterList = async () => {
      try {
        const res = await axios.get(
          `${base_url}/career/career_jobposnotcandidate_r/${userData?.user_id}/${userData?.branchid?.companyid}/?jobid=${jobId}`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        setCandidatesRaw(res.data); // keep raw for lookup
        const formattedData = res.data.map((item) => ({
          label:
            `${item.candidate_name} (${item.email ?? ""} ${item.phone ?? ""})`.trim(),
          value: item.id,
        }));
        setCandidates(formattedData);
      } catch (err) {
        console.log("Candidate error", err);
      }
    };
    if (
      userData?.user_id &&
      userData?.branchid?.companyid &&
      userData?.token &&
      jobId
    ) {
      fetchCandidateFilterList();
    }
  }, [userData]);

  useEffect(() => {
    const fetchCandidateStatus = async () => {
      try {
        const res = await axios.get(
          `${base_url}/career/career_jobcandidate_status_crud/${userData?.user_id}/${userData?.branchid?.companyid}/`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        setCandidateStatus(
          res.data.map((item) => ({ label: item.name, value: item.id })),
        );
      } catch (err) {
        console.log("Status error", err);
      }
    };
    if (userData) fetchCandidateStatus();
  }, [userData]);

  useEffect(() => {
    const fetchReportTo = async () => {
      try {
        const res = await axios.get(
          `${base_url}/core/cmp_user_list/${userData?.user_id}/${userData?.branchid?.companyid}/`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        setReportTo(
          (res.data ?? []).map((item) => ({
            label: `${item.first_name} (${item.username})`,
            value: item.userid,
          })),
        );
      } catch (err) {
        console.log("ReportTo error", err);
      }
    };
    if (userData) fetchReportTo();
  }, [userData]);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await axios.get(
          `${base_url}/career/career_level_crud/${userData?.user_id}/${userData?.branchid?.companyid}/`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        setLevel(
          (res.data ?? []).map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      } catch (err) {
        console.log("Level error", err);
      }
    };
    if (userData) fetchLevel();
  }, [userData]);

  useEffect(() => {
    const fetchPayJV = async () => {
      try {
        const res = await axios.get(
          `${base_url}/core/coreorgchild_list/${userData?.user_id}/${userData?.branchid?.companyid}/`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        const filtered = res.data.filter((item) => item.org_category === 1);
        setPayJVList(
          filtered.map((item) => ({
            label: `${item.child_name} ${item.city}`,
            value: item.id,
          })),
        );
      } catch (err) {
        console.log("PayJV error", err);
      }
    };
    if (userData) fetchPayJV();
  }, [userData]);

  useEffect(() => {
    const fetchSourceOfHiring = async () => {
      try {
        const res = await axios.get(
          `${base_url}/career/career_sourceofhiring_crud/${userData?.user_id}/${userData?.branchid?.companyid}/`,
          { headers: { Authorization: `Token ${userData?.token}` } },
        );
        setSourceOfHiring(
          (res.data ?? []).map((item) => ({
            label: item.sourceofhiring,
            value: item.id,
          })),
        );
      } catch (err) {
        console.log("SourceOfHiring error", err);
      }
    };
    if (userData) fetchSourceOfHiring();
  }, [userData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const endpoint = `${base_url}/career/career_jobcandidate_cu/${userData.user_id}/${userData?.branchid?.companyid}/`;

      const payload = {
        jobposting: job?.id,
        candidate: form.candidate,
        candidate_base_status: form.candidate_base_status || null,
        job_candidate_status: form.status,
        jobrelivedemp: null,
        designation: form.designation,
        report_to: form.reportTo,
        final_ctc: form.finalCTC ? Number(form.finalCTC) : null,
        date_of_joining: form.doj ? form.doj.toISOString().slice(0, 19) : null,
        page_jv: form.payJV ? Number(form.payJV) : null,
        tat_date_start: form.tat_date_start
          ? new Date(form.tat_date_start.split("/").reverse().join("-"))
              .toISOString()
              .slice(0, 19)
          : null,
        max_days: form.max_days ? Number(form.max_days) : null,
        level: form.level,
        source_of_hiring: form.source_of_hiring,
        position_closed_date: null,
        number_of_day_closedtheposition: null,
        budget_vs_finialctc: form.budget_vs_finalctc
          ? Number(form.budget_vs_finalctc)
          : null,
        lock: true,
        flag: 1,
        createvia: "Mobile App",
        remarks: form.remarks,
      };
      console.log("Submitting endpoint:", endpoint);

      console.log("Submitting Payload:", payload);
      const formData = new FormData();
      console.log("FormData:", formData);

      formData.append("jobcandidate_payload", JSON.stringify(payload));

      const res = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Token ${userData?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(
        "Success",
        res?.data?.message || "Candidate Created successfully",
      );
      onClose();
      if (onSubmit) onSubmit();
    } catch (error) {
      console.log("MESSAGE:", error.message);
      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("REQUEST:", error?.request);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error.message ||
          error?.response?.data ||
          "Something Went Wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCandidateChange = (item) => {
    updateField("candidate", item.value);

    const selected = candidatesRaw.find((c) => c.id === item.value);

    if (selected) {
      updateField(
        "source_of_hiring",
        selected.source_or_hiring || selected.source_of_hiring || null,
      );
    } else {
      updateField("source_of_hiring", null);
    }
  };

  const handleFinalCTCChange = (v) => {
    updateField("finalCTC", v);
    const budget = Number(job?.budget_from) || 0;
    const finalCtc = Number(v) || 0;

    console.log();
    updateField("budget_vs_finalctc", String(budget - finalCtc));
  };

  const getLabel = (list, value) =>
    list.find((i) => i.value === value)?.label ?? "";

  return (
    <Modal transparent visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={[styles.container, { width: width - 32 }]}>
            <View style={styles.dragHandle} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.title}>Add Candidate</Text>

              {/* Candidate */}
              <Text style={styles.label}>Candidate</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#64748B" }}
                selectedTextStyle={{ color: "#111827" }}
                data={candidates}
                labelField="label"
                valueField="value"
                placeholder="Search by Name, Email, Phone"
                search
                searchPlaceholder="Search..."
                value={form.candidate}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.customItem}>
                    <Text style={styles.customItemText}>{item.label}</Text>
                  </View>
                )}
                activeColor="#E0F2FE"
                maxHeight={300}
                onChange={handleCandidateChange} // ← updated handler
              />

              {/* Job Candidate Status */}
              <Text style={styles.label}>Job Candidate Status</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#64748B" }}
                selectedTextStyle={{ color: "#111827" }}
                data={candidateStatus}
                labelField="label"
                valueField="value"
                placeholder="Select"
                value={form.status}
                onChange={(item) => updateField("status", item.value)}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.customItem}>
                    <Text style={styles.customItemText}>{item.label}</Text>
                  </View>
                )}
                activeColor="#E0F2FE"
                maxHeight={300}
              />

              {/* Designation */}
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.input}
                value={form.designation}
                onChangeText={(v) => updateField("designation", v)}
              />

              {/* Report To */}
              <Text style={styles.label}>Report To</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#64748B" }}
                selectedTextStyle={{ color: "#111827" }}
                data={reportTo}
                labelField="label"
                valueField="value"
                placeholder="Select Reporting Person"
                search
                searchPlaceholder="Search..."
                value={form.reportTo}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.customItem}>
                    <Text style={styles.customItemText}>{item.label}</Text>
                  </View>
                )}
                activeColor="#E0F2FE"
                maxHeight={300}
                onChange={(item) => updateField("reportTo", item.value)}
              />

              {/* Final CTC */}
              <Text style={styles.label}>Final CTC</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.finalCTC}
                onChangeText={handleFinalCTCChange}
              />

              {/* Date of Joining */}
              <Text style={styles.label}>Date Of Joining</Text>
              <TouchableOpacity
                style={styles.inputRow}
                onPress={() => setShowDate(true)}
              >
                <Text>{form.doj.toLocaleDateString("en-GB")}</Text>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path
                    d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                    stroke="#64748B"
                    strokeWidth={1.5}
                  />
                </Svg>
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  value={form.doj}
                  mode="date"
                  display="default"
                  onChange={(e, date) => {
                    if (Platform.OS === "android") setShowDate(false);
                    if (date) updateField("doj", date);
                  }}
                />
              )}

              {/* Level */}
              <Text style={styles.label}>Level</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#64748B" }}
                selectedTextStyle={{ color: "#111827" }}
                data={level}
                labelField="label"
                valueField="value"
                placeholder="Select"
                value={form.level}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.customItem}>
                    <Text style={styles.customItemText}>{item.label}</Text>
                  </View>
                )}
                activeColor="#E0F2FE"
                maxHeight={300}
                onChange={(item) => updateField("level", item.value)}
              />

              {/* Pay JV */}
              <Text style={styles.label}>Pay JV</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={{ color: "#64748B" }}
                selectedTextStyle={{ color: "#111827" }}
                data={payJVList}
                labelField="label"
                valueField="value"
                placeholder="Select Branch"
                search
                searchPlaceholder="Search..."
                value={form.payJV}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.customItem}>
                    <Text style={styles.customItemText}>{item.label}</Text>
                  </View>
                )}
                activeColor="#E0F2FE"
                maxHeight={300}
                onChange={(item) => updateField("payJV", item.value)}
              />

              {/* Max Days (disabled, pre-filled from job) */}
              <Text style={styles.label}>Max Days</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.max_days}
                editable={false}
              />

              {/* TAT Start  */}
              <Text style={styles.label}>TAT Start</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.tat_date_start}
                editable={false}
              />

              {/* Source of Hiring  */}
              <Text style={styles.label}>Source of Hiring</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={getLabel(sourceOfHiring, form.source_of_hiring)}
                editable={false}
                placeholder="Auto-filled on candidate select"
                placeholderTextColor="#94A3B8"
              />

              {/* Budget vs Final CTC */}
              <Text style={styles.label}>Budget vs Final CTC</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.budget_vs_finalctc}
                editable={false}
              />

              {/* Remarks */}
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                value={form.remarks}
                onChangeText={(v) => updateField("remarks", v)}
              />
            </ScrollView>

            {/* Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={{ color: "#fff" }}>
                  {isSubmitting ? "Creating..." : "Create Candidate"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCandidateModal;

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: "92%",
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 14,
    color: "#111827",
  },
  disabledInput: {
    backgroundColor: "#F8FAFC",
    color: "#94A3B8",
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
  inputRow: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#64748B",
    padding: 12,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
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
    marginTop: -30,
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
};
