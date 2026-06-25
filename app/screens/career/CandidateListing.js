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
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../../utils/axiosInstance";
import Svg, { Path, Circle } from "react-native-svg";
import { base_url } from "../../constant/api";
import Header from "@/app/components/Header";
import useStoredData from "@/app/hooks/useStoredData";

const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
  <Svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M15.75 9H17.25C17.4489 9 17.6397 8.92098 17.7803 8.78033C17.921 8.63968 18 8.44891 18 8.25C18 8.05109 17.921 7.86032 17.7803 7.71967C17.6397 7.57902 17.4489 7.5 17.25 7.5H15.75C15.5511 7.5 15.3603 7.57902 15.2197 7.71967C15.079 7.86032 15 8.05109 15 8.25C15 8.44891 15.079 8.63968 15.2197 8.78033C15.3603 8.92098 15.5511 9 15.75 9ZM9 2.25C9 2.05109 9.07902 1.86032 9.21967 1.71967C9.36032 1.57902 9.55109 1.5 9.75 1.5H17.25C17.4489 1.5 17.6397 1.57902 17.7803 1.71967C17.921 1.86032 18 2.05109 18 2.25C18 2.44891 17.921 2.63968 17.7803 2.78033C17.6397 2.92098 17.4489 3 17.25 3H9.75C9.55109 3 9.36032 2.92098 9.21967 2.78033C9.07902 2.63968 9 2.44891 9 2.25ZM9 14.25C9 14.0511 9.07902 13.8603 9.21967 13.7197C9.36032 13.579 9.55109 13.5 9.75 13.5H17.25C17.4489 13.5 17.6397 13.579 17.7803 13.7197C17.921 13.8603 18 14.0511 18 14.25C18 14.4489 17.921 14.6397 17.7803 14.7803C17.6397 14.921 17.4489 15 17.25 15H9.75C9.55109 15 9.36032 14.921 9.21967 14.7803C9.07902 14.6397 9 14.4489 9 14.25ZM0.75 3H2.25C2.44891 3 2.63968 2.92098 2.78033 2.78033C2.92098 2.63968 3 2.44891 3 2.25C3 2.05109 2.92098 1.86032 2.78033 1.71967C2.63968 1.57902 2.44891 1.5 2.25 1.5H0.75C0.551088 1.5 0.360322 1.57902 0.21967 1.71967C0.0790175 1.86032 0 2.05109 0 2.25C0 2.44891 0.0790175 2.63968 0.21967 2.78033C0.360322 2.92098 0.551088 3 0.75 3ZM2.25 15H0.75C0.551088 15 0.360322 14.921 0.21967 14.7803C0.0790175 14.6397 0 14.4489 0 14.25C0 14.0511 0.0790175 13.8603 0.21967 13.7197C0.360322 13.579 0.551088 13.5 0.75 13.5H2.25C2.44891 13.5 2.63968 13.579 2.78033 13.7197C2.92098 13.8603 3 14.0511 3 14.25C3 14.4489 2.92098 14.6397 2.78033 14.7803C2.63968 14.921 2.44891 15 2.25 15ZM0 8.25C0 8.05109 0.0790175 7.86032 0.21967 7.71967C0.360322 7.57902 0.551088 7.5 0.75 7.5H8.25C8.44891 7.5 8.63968 7.57902 8.78033 7.71967C8.92098 7.86032 9 8.05109 9 8.25C9 8.44891 8.92098 8.63968 8.78033 8.78033C8.63968 8.92098 8.44891 9 8.25 9H0.75C0.551088 9 0.360322 8.92098 0.21967 8.78033C0.0790175 8.63968 0 8.44891 0 8.25ZM6 0C5.40326 0 4.83097 0.237053 4.40901 0.65901C3.98705 1.08097 3.75 1.65326 3.75 2.25C3.75 2.84674 3.98705 3.41903 4.40901 3.84099C4.83097 4.26295 5.40326 4.5 6 4.5C6.59674 4.5 7.16903 4.26295 7.59099 3.84099C8.01295 3.41903 8.25 2.84674 8.25 2.25C8.25 1.65326 8.01295 1.08097 7.59099 0.65901C7.16903 0.237053 6.59674 0 6 0ZM9.75 8.25C9.75 7.65326 9.98705 7.08097 10.409 6.65901C10.831 6.23705 11.4033 6 12 6C12.5967 6 13.169 6.23705 13.591 6.65901C14.0129 7.08097 14.25 7.65326 14.25 8.25C14.25 8.84674 14.0129 9.41903 13.591 9.84099C13.169 10.2629 12.5967 10.5 12 10.5C11.4033 10.5 10.831 10.2629 10.409 9.84099C9.98705 9.41903 9.75 8.84674 9.75 8.25ZM6 12C5.40326 12 4.83097 12.2371 4.40901 12.659C3.98705 13.081 3.75 13.6533 3.75 14.25C3.75 14.8467 3.98705 15.419 4.40901 15.841C4.83097 16.2629 5.40326 16.5 6 16.5C6.59674 16.5 7.16903 16.2629 7.59099 15.841C8.01295 15.419 8.25 14.8467 8.25 14.25C8.25 13.6533 8.01295 13.081 7.59099 12.659C7.16903 12.2371 6.59674 12 6 12Z"
      fill="#64748B"
    />
  </Svg>
);

const ExperienceIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5z"
      stroke="#6B7A8F"
      strokeWidth={1.5}
    />
    <Path d="M2 22c0-4 4-7 10-7s10 3 10 7" stroke="#6B7A8F" strokeWidth={1.5} />
  </Svg>
);

const BriefcaseIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 17 17" fill="none">
    <Path
      d="M15.125 10.0417V13.5833C15.125 14.495 14.4692 15.28 13.565 15.4C11.8259 15.6308 10.0517 15.75 8.25005 15.75C6.44838 15.75 4.67421 15.6308 2.93505 15.4C2.03088 15.28 1.37505 14.495 1.37505 13.5833V10.0417M15.125 10.0417C15.3229 9.86971 15.4812 9.65696 15.5891 9.41803C15.697 9.1791 15.7519 8.91965 15.75 8.6575V5.505C15.75 4.60417 15.11 3.82583 14.2192 3.6925C13.2753 3.55118 12.3266 3.44361 11.375 3.37M15.125 10.0417C14.9634 10.1792 14.775 10.2875 14.5642 10.3583C12.5277 11.034 10.3957 11.3773 8.25005 11.375C6.04338 11.375 3.92088 11.0175 1.93588 10.3583C1.73026 10.2899 1.53982 10.1824 1.37505 10.0417M1.37505 10.0417C1.17717 9.86971 1.01885 9.65696 0.910962 9.41803C0.803077 9.1791 0.748182 8.91965 0.750046 8.6575V5.505C0.750046 4.60417 1.39005 3.82583 2.28088 3.6925C3.22479 3.55118 4.17345 3.44361 5.12505 3.37M11.375 3.37V2.625C11.375 2.12772 11.1775 1.65081 10.8259 1.29917C10.4742 0.947544 9.99733 0.75 9.50005 0.75H7.00005C6.50277 0.75 6.02585 0.947544 5.67422 1.29917C5.32259 1.65081 5.12505 2.12772 5.12505 2.625V3.37M11.375 3.37C9.29482 3.20923 7.20528 3.20923 5.12505 3.37"
      stroke="#6B7A8F"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatExperience = (exp) => {
  const num = parseFloat(exp);
  if (isNaN(num)) return "0 Years Experience";
  if (Number.isInteger(num))
    return `${num} Year${num !== 1 ? "s" : ""} Experience`;
  return `${num} Years Experience`;
};

// ─── Candidate Card ───────────────────────────────────────────────────────────

const CandidateCard = ({ item, onPress }) => {
  const isStatus = item.candidate_status || "Status Update";
  const name =
    item.candidate_name ||
    item.name ||
    (item.candidate && item.candidate.candidate_name) ||
    "Unknown";
  const experience =
    item.total_experience_in_years ||
    (item.candidate && item.candidate.total_experience_in_years) ||
    0;
  const position =
    item.current_position ||
    (item.candidate && item.candidate.current_position) ||
    "-";

  const isUpdate = !item.candidate_status;

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(item)}
      style={styles.card}
      activeOpacity={0.75}
    >
      {/* Row 1: Name + Status */}
      <View style={styles.cardRow}>
        <Text style={styles.cardName}>{name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isUpdate ? "#DBEAFE" : "#107B1D1F" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isUpdate ? "#2563EB" : "#065F46" },
            ]}
          >
            {(isUpdate
              ? "Update Status"
              : item.candidate_status
            )?.toUpperCase()}{" "}
          </Text>
        </View>
      </View>

      {/* Row 2: Experience */}
      <View style={styles.cardMeta}>
        <ExperienceIcon />
        <Text style={styles.cardMetaText}>{formatExperience(experience)}</Text>
      </View>

      {/* Row 3: Position */}
      <View style={styles.cardMeta}>
        <BriefcaseIcon />
        <Text style={styles.cardMetaText}>{position}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CandidateListing = () => {
  const navigation = useNavigation();
  const { userData, selectedCompany } = useStoredData();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData?.user_id || !selectedCompany?.id) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const endpoint = `${base_url}/career/career_candidate_cru/${userData.user_id}/${selectedCompany.id}/?branch=${selectedCompany.branchid}`;
        const res = await axiosInstance.get(endpoint);

        setCandidates(res.data || []);
      } catch (err) {
        console.log("Candidates error:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [userData, selectedCompany]);

  const filtered = candidates.filter((item) => {
    const name =
      item.candidate_name ||
      item.name ||
      (item.candidate && item.candidate.candidate_name) ||
      "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleCardPress = (item) => {
    navigation.navigate("candidateDetails", { candidate: item });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />

      {/* ── Header ── */}
      <Header title="Candidate Listing" navigate={() => navigation.goBack()} />

      {/* ── Search ── */}
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
          {/* <FilterIcon /> */}
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("addNewCandidateScreen")}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          color="#2563EB"
          size="large"
        />
      ) : (
        <ScrollView
          style={{ marginVertical: 20 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
        >
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <CandidateCard
                key={item.id ?? idx}
                item={item}
                onPress={handleCardPress}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No candidates found</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default CandidateListing;

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#EFF6FF",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 48,
    gap: 8,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 100,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardMetaText: {
    fontSize: 14,
    color: "#374151",
  },

  // Empty
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontSize: 15,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
};
