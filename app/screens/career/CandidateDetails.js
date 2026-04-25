import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Svg, { Path, Circle } from "react-native-svg";
import { base_url } from "../../constant/api";
import AddJobModal from "../../components/AddJobModal";
import JobCard from "../../components/JobCard";
import { Linking, Alert } from "react-native";
// ─── Icons ────────────────────────────────────────────────────────────────────

const BackIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18l-6-6 6-6"
      stroke="#374151"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MoreIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={5} r={1} fill="#374151" />
    <Circle cx={12} cy={12} r={1} fill="#374151" />
    <Circle cx={12} cy={19} r={1} fill="#374151" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.5 18C15.1944 18 19 14.1944 19 9.5C19 4.80558 15.1944 1 10.5 1C5.80558 1 2 4.80558 2 9.5C2 14.1944 5.80558 18 10.5 18Z"
      stroke="#A0AEC0"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 22L17 17"
      stroke="#A0AEC0"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FilterIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16M7 12h10M10 18h4"
      stroke="#6B7A8F"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const DownloadIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v13M7 10l5 5 5-5"
      stroke="#2563EB"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 19h18" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" />
    <Path
      d="M5 15v2a2 2 0 002 2h10a2 2 0 002-2v-2"
      stroke="#2563EB"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const ExperienceIcon = () => (
  <Svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M13.25 4.5V7M13.25 7V9.5M13.25 7H15.75M13.25 7H10.75M8.875 3.5625C8.875 4.30842 8.57868 5.02379 8.05124 5.55124C7.52379 6.07868 6.80842 6.375 6.0625 6.375C5.31658 6.375 4.60121 6.07868 4.07376 5.55124C3.54632 5.02379 3.25 4.30842 3.25 3.5625C3.25 2.81658 3.54632 2.10121 4.07376 1.57376C4.60121 1.04632 5.31658 0.75 6.0625 0.75C6.80842 0.75 7.52379 1.04632 8.05124 1.57376C8.57868 2.10121 8.875 2.81658 8.875 3.5625ZM0.75 14.2792V14.1875C0.75 12.7785 1.30971 11.4273 2.306 10.431C3.30228 9.43471 4.65354 8.875 6.0625 8.875C7.47146 8.875 8.82272 9.43471 9.819 10.431C10.8153 11.4273 11.375 12.7785 11.375 14.1875V14.2783C9.77123 15.2442 7.93384 15.7532 6.06167 15.75C4.11917 15.75 2.30167 15.2125 0.75 14.2783V14.2792Z"
      stroke="#6B7A8F"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

const BriefcaseIcon = () => (
  <Svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M15.125 10.0417V13.5833C15.125 14.495 14.4692 15.28 13.565 15.4C11.8259 15.6308 10.0517 15.75 8.25005 15.75C6.44838 15.75 4.67421 15.6308 2.93505 15.4C2.03088 15.28 1.37505 14.495 1.37505 13.5833V10.0417M15.125 10.0417C15.3229 9.86971 15.4812 9.65696 15.5891 9.41803C15.697 9.1791 15.7519 8.91965 15.75 8.6575V5.505C15.75 4.60417 15.11 3.82583 14.2192 3.6925C13.2753 3.55118 12.3266 3.44361 11.375 3.37M15.125 10.0417C14.9634 10.1792 14.775 10.2875 14.5642 10.3583C12.5277 11.034 10.3957 11.3773 8.25005 11.375C6.04338 11.375 3.92088 11.0175 1.93588 10.3583C1.73026 10.2899 1.53982 10.1824 1.37505 10.0417M1.37505 10.0417C1.17717 9.86971 1.01885 9.65696 0.910962 9.41803C0.803077 9.1791 0.748182 8.91965 0.750046 8.6575V5.505C0.750046 4.60417 1.39005 3.82583 2.28088 3.6925C3.22479 3.55118 4.17345 3.44361 5.12505 3.37M11.375 3.37V2.625C11.375 2.12772 11.1775 1.65081 10.8259 1.29917C10.4742 0.947544 9.99733 0.75 9.50005 0.75H7.00005C6.50277 0.75 6.02585 0.947544 5.67422 1.29917C5.32259 1.65081 5.12505 2.12772 5.12505 2.625V3.37M11.375 3.37C9.29482 3.20923 7.20528 3.20923 5.12505 3.37M8.25005 8.875H8.25671V8.88167H8.25005V8.875Z"
      stroke="#6B7A8F"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.47 9.5 19.79 19.79 0 01.4 4.87 2 2 0 012.37 2.68h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 10.09a16 16 0 006 6l1.46-1.41a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
      stroke="#6B7A8F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EmailIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="#6B7A8F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke="#6B7A8F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LocationIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 19 14.5 19 9.5C19 5.36 15.64 2 11.5 2C7.36 2 4 5.36 4 9.5C4 14.5 12 21 12 21Z"
      stroke="#6B7A8F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.5 12C12.88 12 14 10.88 14 9.5C14 8.12 12.88 7 11.5 7C10.12 7 9 8.12 9 9.5C9 10.88 10.12 12 11.5 12Z"
      stroke="#6B7A8F"
      strokeWidth={1.5}
    />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatExperience = (exp) => {
  const num = parseFloat(exp);
  if (isNaN(num)) return "-";
  if (Number.isInteger(num)) return `${num}+ Year${num !== 1 ? "s" : ""}`;
  return `${num} Years`;
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const CandidateDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { candidate } = route.params;

  const [userData, setUserData] = useState(null);
  const [jobList, setJobList] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const candidateData = candidate?.candidate ?? candidate;
  const name = candidateData?.candidate_name ?? "—";
  const isActive =
    candidateData?.is_active ??
    candidateData?.candidate_status === "active" ??
    true;
  const experience = candidateData?.total_experience_in_years ?? 0;
  const position = candidateData?.current_position ?? "—";
  const city = candidateData?.current_location_city ?? "—";
  const state = candidateData?.current_location_state ?? "";
  const phone = candidateData?.phone ?? "—";
  const email = candidateData?.email ?? "—";

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  const fetchJobList = async (ud = userData) => {
    if (!ud) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${base_url}/career/career_jobcandidate_r/${ud.user_id}/${ud.branchid?.companyid}/?candidate=${candidateData?.id}`,
        { headers: { Authorization: `Token ${ud.token}` } },
      );
      const formatted = (res.data || []).map((item) => ({
        id: item.jobposting?.id,
        job_name: item.jobposting?.job_name,
        department_name: item.jobposting?.department_name,
        cmp_name: item.jobposting?.cmp_name,
        experience_from: item.jobposting?.experience_form,
        job_candidate_status_name: item.job_candidate_status_name,
        raw: item,
      }));
      setJobList(formatted);
    } catch (err) {
      console.log("JobList error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResume = async () => {
    try {
      if (!candidateData?.resume_upload) {
        Alert.alert("No Resume", "Resume not available");
        return;
      }

      const fileUrl = `${base_url}/${candidateData.resume_upload}`;

      const supported = await Linking.canOpenURL(fileUrl);

      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert("Error", "Cannot open resume");
      }
    } catch (error) {
      console.log("Open error", error);
      Alert.alert("Error", "Failed to open resume");
    }
  };

  useEffect(() => {
    if (userData) fetchJobList(userData);
  }, [userData]);

  const filteredJobs = jobList.filter((j) =>
    (j.job_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidate Details</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── Candidate Info Card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.candidateName}>{name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? "#16A34A" : "#DC2626" },
                ]}
              >
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <ExperienceIcon />
            <Text style={styles.metaText}>
              {formatExperience(experience)} Experience
            </Text>
          </View>
          <View style={styles.metaRow}>
            <BriefcaseIcon />
            <Text style={styles.metaText}>{position}</Text>
          </View>
          <View style={styles.metaRow}>
            <LocationIcon />
            <Text style={styles.metaText}>
              {city}
              {state ? ` – ${state}` : ""}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <PhoneIcon />
            <Text style={styles.metaText}>{phone}</Text>
          </View>
          <View style={styles.metaRow}>
            <EmailIcon />
            <Text style={styles.metaText}>{email}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={handleOpenResume}
            >
              <DownloadIcon />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateBtn}>
              <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Job List Section ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Job List</Text>
            <TouchableOpacity
              style={styles.addJobBtn}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.addJobText}>Add Job</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <SearchIcon />
              <TextInput
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor="#A0AEC0"
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <FilterIcon />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              color="#2563EB"
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((item, idx) => (
              <JobCard key={item.id ?? idx} item={item} styles={styles} />
            ))
          ) : (
            <Text style={styles.emptyText}>No jobs found</Text>
          )}
        </View>
      </ScrollView>

      {/* ── Add Job Modal ── */}
      <AddJobModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        candidate={candidateData}
        userData={userData}
        onSubmit={() => {
          setShowModal(false);
          fetchJobList();
        }}
      />
    </View>
  );
};

export default CandidateDetails;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 14,
    backgroundColor: "#F4F6F8",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  candidateName: { fontSize: 22, fontWeight: "700", color: "#2563EB", flex: 1 },
  statusBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  statusText: { fontSize: 13, fontWeight: "600" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaText: { fontSize: 14, color: "#374151" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    backgroundColor: "#2563EB0F",
    borderColor: "#2563EB",
    borderRadius: 50,
    paddingVertical: 13,
  },
  downloadText: { color: "#2563EB", fontWeight: "600", fontSize: 15 },
  updateBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 50,
    paddingVertical: 13,
  },
  updateText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginVertical: 20,
  },

  section: { paddingHorizontal: 20, gap: 14 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  addJobBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
  },
  addJobText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 46,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827", paddingVertical: 0 },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  jobCardTitle: { fontSize: 16, fontWeight: "700", color: "#2563EB" },
  jobStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  jobStatusText: { fontSize: 12, fontWeight: "600" },
  jobCardCompany: { fontSize: 13, color: "#6B7A8F" },
  jobCardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  jobCardMetaText: { fontSize: 14, color: "#374151" },

  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 20,
    fontSize: 15,
  },
};
