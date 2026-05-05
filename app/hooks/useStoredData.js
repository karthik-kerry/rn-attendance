import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStoredData = () => {
  const [userData, setUserData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = await AsyncStorage.getItem("userData");
      const company = await AsyncStorage.getItem("selectedCompany");
      if (user) setUserData(JSON.parse(user));
      if (company) setSelectedCompany(JSON.parse(company));
    };
    load();
  }, []);

  return { userData, selectedCompany };
};

export default useStoredData;
