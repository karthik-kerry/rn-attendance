import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { base_url } from "../constant/api";

const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
      stroke="#64748B"
      strokeWidth={1.5}
    />
  </Svg>
);

const dropdownProps = {
  placeholderStyle: { color: "#94A3B8", fontSize: 14 },
  selectedTextStyle: { color: "#111827", fontSize: 14 },
  activeColor: "#EFF6FF",
  maxHeight: 260,
};

const AddJobModal = ({ visible, onClose, onSubmit, candidate, userData }) => {
  const { width } = Dimensions.get("window");

  const [form, setForm] = useState({
    jobposting: null,
    job_candidate_status: null,
    designation: "",
    report_to: null,
    final_ctc: "",
    doj: new Date(),
    level: null,
    page_jv: null,
    remarks: "",
    // Auto-filled / disabled
    max_days: "",
    tat_date_start: "",
    source_of_hiring: candidate?.source_or_hiring ?? null,
    budget_vs_finialctc: "",
  });

  const [showDate, setShowDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobFilter, setJobFilter] = useState([]);
  const [jobFilterRaw, setJobFilterRaw] = useState([]);
  const [jobCandidateStatus, setJobCandidateStatus] = useState([]);
  const [reportTo, setReportTo] = useState([]);
  const [level, setLevel] = useState([]);
  const [payJVList, setPayJVList] = useState([]);
  const [sources, setSources] = useState([]);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (visible) {
      setForm({
        jobposting: null,
        job_candidate_status: null,
        designation: "",
        report_to: null,
        final_ctc: "",
        doj: new Date(),
        level: null,
        page_jv: null,
        remarks: "",
        max_days: "",
        tat_date_start: "",
        source_of_hiring: candidate?.source_or_hiring ?? null,
        budget_vs_finialctc: "",
      });
    }
  }, [visible]);

  useEffect(() => {
    if (!userData || !visible) return;

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Token ${userData.token}` };
        const companyId = userData.branchid?.companyid;
        const userId = userData.user_id;

        const [jobsRes, statusRes, reportToRes, levelRes, jvRes, sourcesRes] =
          await Promise.all([
            axios.get(
              `${base_url}/career/career_jobposnotcandidate_r/${userId}/${companyId}/?candidateid=${candidate?.id}`,
              { headers },
            ),
            axios.get(
              `${base_url}/career/career_jobcandidate_status_crud/${userId}/${companyId}/`,
              { headers },
            ),
            axios.get(
              `${base_url}/core/cmp_user_list/${userId}/${companyId}/`,
              { headers },
            ),
            axios.get(
              `${base_url}/career/career_level_crud/${userId}/${companyId}/`,
              { headers },
            ),
            axios.get(
              `${base_url}/core/coreorgchild_list/${userId}/${companyId}/`,
              { headers },
            ),

            // ✅ ADD THIS API
            axios.get(
              `${base_url}/career/career_sourceofhiring_crud/${userId}/${companyId}/`,
              { headers },
            ),
          ]);

        // existing mappings
        setJobFilterRaw(jobsRes.data || []);
        setJobFilter(
          (jobsRes.data || []).map((j) => ({
            label: j.job_name,
            value: j.id,
          })),
        );

        setJobCandidateStatus(
          (statusRes.data || []).map((s) => ({
            label: s.name,
            value: s.id,
          })),
        );

        setReportTo(
          (reportToRes.data || []).map((u) => ({
            label: `${u.first_name} (${u.username})`,
            value: u.userid,
          })),
        );

        setLevel(
          (levelRes.data || []).map((l) => ({
            label: l.name,
            value: l.id,
          })),
        );

        const filtered = (jvRes.data || []).filter((i) => i.org_category === 1);
        setPayJVList(
          filtered.map((i) => ({
            label: `${i.child_name} ${i.city}`,
            value: i.id,
          })),
        );

        setSources(
          (sourcesRes.data || []).map((item) => ({
            label: item.sourceofhiring,
            value: item.id,
          })),
        );
      } catch (err) {
        console.log("AddJobModal fetch error", err);
      }
    };

    fetchAll();
  }, [userData, visible]);

  const handleJobChange = (item) => {
    const selectedJob = jobFilterRaw.find((j) => j.id === item.value);
    const maxDays = selectedJob?.max_days ? String(selectedJob.max_days) : "";
    const tatStart = selectedJob?.tat_date
      ? new Date(selectedJob.tat_date).toLocaleDateString("en-GB")
      : "";
    const budget = Number(selectedJob?.budget_from) || 0;
    const finalCtc = Number(form.final_ctc) || 0;

    setForm((prev) => ({
      ...prev,
      jobposting: item.value,
      max_days: maxDays,
      tat_date_start: tatStart,
      budget_vs_finialctc: String(budget - finalCtc),
    }));
  };

  const handleFinalCTCChange = (v) => {
    const selectedJob = jobFilterRaw.find((j) => j.id === form.jobposting);
    const budget = Number(selectedJob?.budget_from) || 0;
    const finalCtc = Number(v) || 0;
    setForm((prev) => ({
      ...prev,
      final_ctc: v,
      budget_vs_finialctc: String(budget - finalCtc),
    }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.jobposting) {
      Alert.alert("Validation", "Please select a job");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        jobposting: form.jobposting,
        candidate: candidate?.id,
        job_candidate_status: form.job_candidate_status,
        designation: form.designation,
        report_to: form.report_to,
        final_ctc: form.final_ctc ? Number(form.final_ctc) : null,
        date_of_joining: form.doj
          ? form.doj.toISOString().replace("T", " ").split(".")[0]
          : null,
        page_jv: form.page_jv ? Number(form.page_jv) : null,
        level: form.level,
        source_of_hiring: candidate?.source_or_hiring,
        budget_vs_finialctc: form.budget_vs_finialctc
          ? Number(form.budget_vs_finialctc)
          : null,
        max_days: form.max_days ? Number(form.max_days) : null,
        lock: true,
        flag: 1,
        createvia: "mobile app",
        remarks: form.remarks,
      };

      const formData = new FormData();
      formData.append("jobcandidate_payload", JSON.stringify(payload));

      await axios.post(
        `${base_url}/career/career_jobcandidate_cu/${userData.user_id}/${userData.branchid?.companyid}/`,
        formData,
        { headers: { Authorization: `Token ${userData.token}` } },
      );

      Alert.alert("Success", "Job added successfully");
      onSubmit && onSubmit();
    } catch (err) {
      console.log("AddJobModal submit error", err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Modal transparent visible={visible} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={[styles.container, { width: width - 32 }]}>
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <Text style={styles.title}>Add Job</Text>

              {/* ── Job Name ── */}
              <Text style={styles.label}>Job Name *</Text>
              <Dropdown
                style={styles.dropdown}
                data={jobFilter}
                labelField="label"
                valueField="value"
                placeholder="Search Job"
                search
                searchPlaceholder="Search..."
                value={form.jobposting}
                onChange={handleJobChange}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              {/* ── Job Candidate Status ── */}
              <Text style={styles.label}>Job Candidate Status</Text>
              <Dropdown
                style={styles.dropdown}
                data={jobCandidateStatus}
                labelField="label"
                valueField="value"
                placeholder="Select status"
                value={form.job_candidate_status}
                onChange={(item) =>
                  updateField("job_candidate_status", item.value)
                }
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              {/* ── Designation ── */}
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.input}
                value={form.designation}
                onChangeText={(v) => updateField("designation", v)}
                placeholder="Enter designation"
                placeholderTextColor="#94A3B8"
              />

              {/* ── Report To ── */}
              <Text style={styles.label}>Report To</Text>
              <Dropdown
                style={styles.dropdown}
                data={reportTo}
                labelField="label"
                valueField="value"
                placeholder="Select reporting person"
                search
                searchPlaceholder="Search..."
                value={form.report_to}
                onChange={(item) => updateField("report_to", item.value)}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              {/* ── Final CTC ── */}
              <Text style={styles.label}>Final CTC</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.final_ctc}
                onChangeText={handleFinalCTCChange}
                placeholder="0"
                placeholderTextColor="#94A3B8"
              />

              {/* ── Date of Joining ── */}
              <Text style={styles.label}>Date of Joining</Text>
              <TouchableOpacity
                style={styles.dateRow}
                onPress={() => setShowDate(true)}
              >
                <Text style={{ color: "#111827", fontSize: 14 }}>
                  {form.doj.toLocaleDateString("en-GB")}
                </Text>
                <CalendarIcon />
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

              {/* ── Level ── */}
              <Text style={styles.label}>Level</Text>
              <Dropdown
                style={styles.dropdown}
                data={level}
                labelField="label"
                valueField="value"
                placeholder="Select level"
                value={form.level}
                onChange={(item) => updateField("level", item.value)}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              {/* ── Pay JV ── */}
              <Text style={styles.label}>Pay JV</Text>
              <Dropdown
                style={styles.dropdown}
                data={payJVList}
                labelField="label"
                valueField="value"
                placeholder="Select branch"
                search
                searchPlaceholder="Search..."
                value={form.page_jv}
                onChange={(item) => updateField("page_jv", item.value)}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              <Text style={styles.label}>Max Days</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.max_days}
                editable={false}
                placeholder="Auto-filled on job select"
                placeholderTextColor="#94A3B8"
              />

              {/* ── TAT Start ── */}
              <Text style={styles.label}>TAT Start</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.tat_date_start}
                editable={false}
                placeholder="Auto-filled on job select"
                placeholderTextColor="#94A3B8"
              />

              {/* ── Source of Hiring ── */}
              <Text style={styles.label}>Source of Hiring</Text>
              <Dropdown
                style={[styles.dropdown, { backgroundColor: "#F8FAFC" }]} // optional disabled look
                data={sources}
                labelField="label"
                valueField="value"
                placeholder="Select source"
                value={form.source_of_hiring}
                onChange={(item) => updateField("source_of_hiring", item.value)}
                disable={true}
                containerStyle={styles.dropdownContainer}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                {...dropdownProps}
              />

              {/* ── Budget vs Final CTC  ── */}
              <Text style={styles.label}>Budget vs Final CTC</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.budget_vs_finialctc}
                editable={false}
                placeholder="Auto-calculated"
                placeholderTextColor="#94A3B8"
              />

              {/* ── Remarks ── */}
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                multiline
                value={form.remarks}
                onChangeText={(v) => updateField("remarks", v)}
                placeholder="Add remarks..."
                placeholderTextColor="#94A3B8"
              />
            </ScrollView>

            {/* ── Footer Buttons ── */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>Create Job</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddJobModal;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "#00000050",
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
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
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
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#F8FBFF",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#111827",
  },
  dateRow: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
};
