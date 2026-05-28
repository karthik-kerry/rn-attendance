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
  const [sourceViaList, setSourceViaList] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [referenceList, setReferenceList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [internalRefList, setInternalRefList] = useState([]);
  const [docs, setDocs] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const initialForm = {
    name: "",
    countryCode: "IN",
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
    setSelectedDocType(null);
    setUploadedFiles([]);
    setShowMore(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const getDocTypes = async () => {
      try {
        const endpoint = `${base_url}/documentrepo/document_repodocumentname_r/${userData?.user_id}/?cmpid=None`;

        const res = await axiosInstance.get(endpoint);

        setDocs(res.data || []);
      } catch (error) {
        console.log("Doc Type Error:", error);
      }
    };

    if (userData?.user_id) {
      getDocTypes();
    }
  }, [userData]);

  const selectedDocMeta = docs.find((doc) => doc.id === selectedDocType);

  const formatFileSize = (size) => {
    if (!size) return "0 KB";

    const units = ["B", "KB", "MB", "GB"];

    let i = 0;

    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }

    return `${size.toFixed(2)} ${units[i]}`;
  };

  const handlePickResume = async () => {
    try {
      if (!selectedDocType) {
        Alert.alert("Validation", "Please select document type.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const file = result.assets[0];

        // FILE SIZE VALIDATION

        const maxSize = (selectedDocMeta?.file_size_mb || 2) * 1024 * 1024;

        if (file.size > maxSize) {
          Alert.alert(
            "File too large",
            `Please upload file below ${selectedDocMeta?.file_size_mb || 2} MB`,
          );

          return;
        }

        // FILE TYPE VALIDATION

        const extension = file.name?.split(".")?.pop()?.toLowerCase();

        const allowedTypes =
          selectedDocMeta?.file_type?.map((item) =>
            item.replace(".", "").toLowerCase(),
          ) || [];

        if (allowedTypes.length > 0 && !allowedTypes.includes(extension)) {
          Alert.alert(
            "Invalid File",
            `Allowed Types : ${allowedTypes.join(", ")}`,
          );

          return;
        }

        // FILE OBJECT

        const newFile = {
          id: Date.now(),
          name: file.name,
          uri: file.uri,
          mimeType: file.mimeType,
          size: file.size,
          document_id: selectedDocMeta?.id,
          doc_name: selectedDocMeta?.document_name,
        };

        setUploadedFiles((prev) => [...prev, newFile]);
      }
    } catch (error) {
      console.log("Document Picker Error:", error);
    }
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
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

  const onSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Validation", "Please enter candidate name.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = `${base_url}/career/career_candidate_cru/${userData.user_id}/${selectedCompany?.id}/?branch=${selectedCompany?.branchid}`;

      const payload = {
        candidate_name: form.name,
        country_code: form.countryCode,
        phone: form.phone || "",
        email: form.email,
        remarks: form.remarks,
        source_or_hiring: form.sourceVia,
        ref_name_source: form.refNameSource,
        current_ctc: form.currentCTC ? Number(form.currentCTC) : null,
        expected_ctc: form.expectedCTC ? Number(form.expectedCTC) : null,
        industry: form.industry,
        createvia: "Mobile App",
      };

      const formData = new FormData();

      formData.append("candidate_payload", JSON.stringify(payload));

      if (uploadedFiles?.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append("resume_upload", {
            uri: file.uri,
            name: file.name || "resume.pdf",
            type: file.mimeType || "application/octet-stream",
          });
        });
      }
      console.log(payload, "payload");
      console.log("Uploaded Files:", uploadedFiles);
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
      console.error("Candidate Creation Error:", error);
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
                valueField="code"
                placeholder="IN"
                value={form.countryCode}
                onChange={(item) => updateField("countryCode", item.code)}
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
                    (c) => c.code === form.countryCode,
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
            {/* DOCUMENT TYPE */}

            <Text style={styles.label}>Document Type</Text>

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={docs.map((doc) => ({
                label: doc.document_name,
                value: doc.id,
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select Document Type"
              value={selectedDocType}
              onChange={(item) => setSelectedDocType(item.value)}
              containerStyle={styles.dropdownContainer}
            />

            {/* UPLOAD */}

            <Text style={styles.label}>Upload Resume</Text>

            <TouchableOpacity
              style={[
                styles.uploadBox,
                !selectedDocType && {
                  opacity: 0.5,
                },
              ]}
              activeOpacity={0.7}
              disabled={!selectedDocType}
              onPress={handlePickResume}
            >
              <UploadIcon />

              <View style={{ flex: 1 }}>
                <Text style={styles.uploadPrimary}>Upload File</Text>

                <Text style={styles.uploadSecondary}>
                  {selectedDocMeta
                    ? `${selectedDocMeta.file_type.join(", ")} • Max ${
                        selectedDocMeta.file_size_mb
                      } MB`
                    : "Select document type first"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* FILE LIST */}

            {uploadedFiles.map((file) => (
              <View key={file.id} style={styles.fileCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>
                    {file.doc_name} - {file.name}
                  </Text>

                  <Text style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleRemoveFile(file.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
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
              onPress={onSubmit}
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
  uploadPrimary: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },

  uploadSecondary: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },

  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  fileSize: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  removeText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },
};
