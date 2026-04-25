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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Svg, { Path, Circle } from "react-native-svg";
import { base_url } from "../../constant/api";
import Header from "@/app/components/Header";

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
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16M7 12h10M10 18h4"
      stroke="#6B7A8F"
      strokeWidth={2}
      strokeLinecap="round"
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
  const isActive = item.candidate_status === "active" || item.is_active;
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
  const status =
    item.candidate_status_name ||
    item.status_name ||
    (isActive ? "Active" : "Inactive");

  const statusIsActive =
    status?.toLowerCase() === "active" ||
    item.is_active === true ||
    item.candidate_status === "active";

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
            { backgroundColor: statusIsActive ? "#DCFCE7" : "#FEE2E2" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusIsActive ? "#16A34A" : "#DC2626" },
            ]}
          >
            {statusIsActive ? "Active" : "Inactive"}
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
  const [userData, setUserData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userData?.user_id || !userData?.branchid?.companyid) return;

    const fetchCandidates = async () => {
      setLoading(true);

      try {
        const endpoint = `${base_url}/career/career_candidate_cr/${userData.user_id}/${userData.branchid.companyid}/?branch=${userData.branchid.branchid}`;
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Token ${userData.token}`,
          },
        });

        setCandidates(res.data || []);
      } catch (err) {
        console.log("Candidates error:", err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [userData]);

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
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <FilterIcon />
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
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
