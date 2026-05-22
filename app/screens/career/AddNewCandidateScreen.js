import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import * as DocumentPicker from "expo-document-picker";
import Svg, { Path } from "react-native-svg";
import axiosInstance from "../../utils/axiosInstance";
import { base_url } from "../../constant/api";
import Header from "@/app/components/Header";
import useStoredData from "@/app/hooks/useStoredData";

// ─── Icons ────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 16V8M12 8L9 11M12 8L15 11"
      stroke="#2563EB"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 16.5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V16.5"
      stroke="#2563EB"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12"
      stroke="#2563EB"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Country Code Data ────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { label: "🇮🇳 +91", value: "+91", code: "+91" },
  { label: "🇺🇸 +1", value: "+1", code: "+1" },
  { label: "🇬🇧 +44", value: "+44", code: "+44" },
  { label: "🇦🇪 +971", value: "+971", code: "+971" },
  { label: "🇸🇬 +65", value: "+65", code: "+65" },
  { label: "🇦🇺 +61", value: "+61", code: "+61" },
  { label: "🇨🇦 +1", value: "+1-CA", code: "+1" },
  { label: "🇩🇪 +49", value: "+49", code: "+49" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

const AddNewCandidateScreen = () => {
  const navigation = useNavigation();
  const { userData, selectedCompany } = useStoredData();
  const [options, setOptions] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [sourceViaList, setSourceViaList] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [referenceList, setReferenceList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [internalRefList, setInternalRefList] = useState([]);
  const initialForm = {
    name: "",
    countryCode: "+91",
    phone: "",
    email: "",
    remarks: "",
    sourceVia: null,
    refNameSource: "",
    currentCTC: "",
    expectedCTC: "",
    industry: "",
  };

  const [form, setForm] = useState({ ...initialForm });

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm({ ...initialForm });
    setResumeFile(null);
    setShowMore(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const getCountries = async () => {
      try {
        const endpoint = `${base_url}/core/country_code/`;
        const res = await axiosInstance.get(endpoint);
        setOptions(res.data);
      } catch (error) {
        console.log("Error fetching country:", error);
      }
    };

    getCountries();
  }, []);

  useEffect(() => {
    const fetchSourceVia = async () => {
      try {
        const res = await axiosInstance.get(
          `${base_url}/career/career_sourceofhiring_crud/${userData?.user_id}/${selectedCompany?.id}/`,
        );
        setSourceViaList(
          (res.data ?? []).map((item) => ({
            label: item.sourceofhiring,
            value: item.id,
          })),
        );
      } catch (err) {
        console.log("SourceVia error", err);
      }
    };
    if (userData && selectedCompany) fetchSourceVia();
  }, [userData, selectedCompany]);

  const selectedSourceData = sourceViaList.find(
    (item) => item.value === selectedSource,
  );

  const isVendor =
    selectedSourceData?.label?.toLowerCase() === "portal" ||
    selectedSourceData?.label?.toLowerCase() === "consultancy";

  useEffect(() => {
    if (userData?.user_id && selectedCompany?.id) {
      fetchVendorList();
      fetchInternalRef();
    }
  }, [userData, selectedCompany]);

  const fetchVendorList = async () => {
    try {
      const endpoint = `${base_url}/core/coreorgchild_list/${userData?.user_id}/${selectedCompany?.id}/`;

      console.log("Vendor Endpoint:", endpoint);

      const res = await axiosInstance.get(endpoint);

      const filtered = (res.data || []).filter(
        (item) => item.org_category === 3,
      );

      setVendorList(
        filtered.map((item) => ({
          label: item.child_name,
          value: item.id,
        })),
      );
    } catch (error) {
      console.log("Vendor STATUS:", error?.response?.status);
      console.log("Vendor DATA:", error?.response?.data);
    }
  };

  const fetchInternalRef = async () => {
    try {
      const endpoint = `${base_url}/core/cmp_user_list/${userData?.user_id}/${selectedCompany?.id}/`;

      console.log("Internal Ref Endpoint:", endpoint);

      const res = await axiosInstance.get(endpoint);

      setInternalRefList(
        (res.data || []).map((item) => ({
          label: `${item.first_name} (${item.username})`,
          value: item.userid,
        })),
      );
    } catch (error) {
      console.log("Internal STATUS:", error?.response?.status);
      console.log("Internal DATA:", error?.response?.data);
    }
  };

  useEffect(() => {
    if (isVendor) {
      setReferenceList(vendorList);
    } else {
      setReferenceList(internalRefList);
    }
  }, [selectedSource, vendorList, internalRefList]);

  const handlePickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/png"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];
        if (file.size > 2 * 1024 * 1024) {
          Alert.alert("File too large", "Please upload a file under 2MB.");
          return;
        }
        setResumeFile(file);
      }
    } catch (err) {
      console.log("Document picker error", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation", "Please enter candidate name.");
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = `${base_url}/career/career_candidate_cru/${userData.user_id}/${selectedCompany?.id}/?branch=${selectedCompany?.branchid}`;

      const countryCodeValue =
        COUNTRY_CODES.find((c) => c.value === form.countryCode)?.code ||
        form.countryCode;

      const payload = {
        candidate_name: form.name,
        phone: form.phone ? `${countryCodeValue}${form.phone}` : "",
        email: form.email,
        remarks: form.remarks,
        source_or_hiring: form.sourceVia,
        ref_name_source: form.refNameSource,
        current_ctc: form.currentCTC ? Number(form.currentCTC) : null,
        expected_ctc: form.expectedCTC ? Number(form.expectedCTC) : null,
        industry: form.industry,
        createvia: "Mobile App",
      };
      console.log("Payload:", payload);
      const formData = new FormData();
      formData.append("candidate_payload", JSON.stringify(payload));

      if (resumeFile) {
        const resumePayload = {
          uri: resumeFile.uri,
          name: resumeFile.name,
          type: resumeFile.mimeType || "application/pdf",
        };

        console.log("Resume File:", resumePayload);

        formData.append("resume", resumePayload);
      } else {
        console.log("No Resume Selected");
      }

      const res = await axiosInstance.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert(
        "Success",
        res?.data?.message || "Candidate added successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
      resetForm();
    } catch (error) {
      console.log("STATUS:", error?.response?.status);
      console.log("ERROR DATA:", error?.response?.data);
      console.log("PAYLOAD SENT:", payload);
      console.log("Full Error:", error?.response?.data);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />

      {/* Header */}
      <Header title="Add New Candidate" navigate={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 80 },
            ]}
          >
            {/* ── Name ── */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#A0AEC0"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
            />
            {/* ── Phone No ── */}
            <Text style={styles.label}>Phone No.</Text>
            <View style={styles.phoneRow}>
              <Dropdown
                style={styles.countryDropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={options}
                labelField="dial_code"
                valueField="dial_code"
                placeholder="+91"
                value={form.countryCode}
                onChange={(item) => updateField("countryCode", item.dial_code)}
                containerStyle={styles.countryDropdownContainer}
                renderItem={(item) => (
                  <View style={styles.countryItem}>
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${item.code.toLowerCase()}.png`,
                      }}
                      style={styles.flag}
                    />

                    <Text style={styles.countryCodeText}>{item.dial_code}</Text>
                  </View>
                )}
                renderLeftIcon={() => {
                  const selectedCountry = options.find(
                    (c) => c.dial_code === form.countryCode,
                  );

                  return selectedCountry ? (
                    <Image
                      source={{
                        uri: `https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`,
                      }}
                      style={styles.flag}
                    />
                  ) : null;
                }}
              />

              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone number"
                placeholderTextColor="#A0AEC0"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(v) => updateField("phone", v)}
              />
            </View>
            {/* ── Email ── */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
            />
            {/* ── Upload Resume ── */}
            <Text style={styles.label}>Upload Resume</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handlePickResume}
              activeOpacity={0.7}
            >
              <UploadIcon />
              <Text style={styles.uploadText} numberOfLines={1}>
                {resumeFile ? (
                  resumeFile.name
                ) : (
                  <>
                    <Text style={{ fontWeight: "700", color: "#2563EB" }}>
                      Upload
                    </Text>
                    <Text style={{ color: "#64748B" }}>
                      {" "}
                      (max 2mb file – pdf, png)
                    </Text>
                  </>
                )}
              </Text>
            </TouchableOpacity>
            {/* ── Remarks ── */}
            <Text style={styles.label}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add remarks..."
              placeholderTextColor="#A0AEC0"
              multiline
              value={form.remarks}
              onChangeText={(v) => updateField("remarks", v)}
            />
            {/* ── Extended Fields ── */}
            {showMore && (
              <View>
                {/* Source Via */}
                <Text style={styles.label}>Source Via</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#64748B" }}
                  selectedTextStyle={{ color: "#111827" }}
                  data={sourceViaList}
                  labelField="label"
                  valueField="value"
                  placeholder="Select"
                  value={form.sourceVia}
                  onChange={(item) => {
                    updateField("sourceVia", item.value);
                    updateField("refNameSource", null);
                    setSelectedSource(item.value);
                  }}
                  containerStyle={styles.dropdownContainer}
                  renderItem={(item) => (
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </View>
                  )}
                />

                {/* Ref Name / Source */}
                <Text style={styles.label}>Ref Name / Source</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: "#64748B" }}
                  selectedTextStyle={{ color: "#111827" }}
                  data={referenceList}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Reference"
                  value={form.refNameSource}
                  onChange={(item) => updateField("refNameSource", item.value)}
                  containerStyle={styles.dropdownContainer}
                  renderItem={(item) => (
                    <View style={styles.dropdownItem}>
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </View>
                  )}
                />

                {/* Current CTC */}
                <Text style={styles.label}>Current CTC</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current CTC"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={form.currentCTC}
                  onChangeText={(v) => updateField("currentCTC", v)}
                />

                {/* Expected CTC */}
                <Text style={styles.label}>Expected CTC</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter expected CTC"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={form.expectedCTC}
                  onChangeText={(v) => updateField("expectedCTC", v)}
                />

                {/* Industry */}
                <Text style={styles.label}>Industry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter industry"
                  placeholderTextColor="#A0AEC0"
                  value={form.industry}
                  onChangeText={(v) => updateField("industry", v)}
                />
              </View>
            )}
            {/* ── Show More / Less ── */}
            <TouchableOpacity
              onPress={() => setShowMore((prev) => !prev)}
              style={styles.toggleBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleText}>
                {showMore ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* ── Footer Buttons ── */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                resetForm();
                navigation.goBack();
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddNewCandidateScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
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
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  // Phone row
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  countryDropdown: {
    width: 110,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  countryDropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FBFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 160,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  // Upload
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  uploadText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
  },

  // Show more toggle
  toggleBtn: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    marginBottom: 14,
  },
  toggleText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  // Dropdowns
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
  placeholderStyle: {
    color: "#64748B",
    fontSize: 13,
  },

  selectedTextStyle: {
    color: "#111827",
    fontSize: 13,
    marginLeft: 4,
  },

  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  flag: {
    width: 22,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },

  countryCodeText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F4F6F8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelBtnText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 15,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
};
