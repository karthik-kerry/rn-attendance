import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Help & Support" navigate={() => navigation.goBack()} />
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
      >
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: "#fff",
            height: 74,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.5 3.5C0.5 2.70435 0.816071 1.94129 1.37868 1.37868C1.94129 0.816071 2.70435 0.5 3.5 0.5H4.872C5.732 0.5 6.482 1.086 6.691 1.92L7.796 6.343C7.88554 6.701 7.86746 7.07746 7.74401 7.42522C7.62055 7.77299 7.39723 8.07659 7.102 8.298L5.809 9.268C5.674 9.369 5.645 9.517 5.683 9.62C6.24738 11.1549 7.1386 12.5487 8.29495 13.7051C9.4513 14.8614 10.8451 15.7526 12.38 16.317C12.483 16.355 12.63 16.326 12.732 16.191L13.702 14.898C13.9234 14.6028 14.227 14.3794 14.5748 14.256C14.9225 14.1325 15.299 14.1145 15.657 14.204L20.08 15.309C20.914 15.518 21.5 16.268 21.5 17.129V18.5C21.5 19.2956 21.1839 20.0587 20.6213 20.6213C20.0587 21.1839 19.2956 21.5 18.5 21.5H16.25C7.552 21.5 0.5 14.448 0.5 5.75V3.5Z"
              fill="#2563EB"
            />
          </Svg>
          <View style={{ gap: 10 }}>
            <Text>Call Us</Text>
            <Text>+91-88888 88888</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpScreen;
