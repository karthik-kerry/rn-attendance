import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const NotifyHeader = ({ title, navigate }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#64748B1F",
            height: 38,
            width: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
          onPress={navigate}
        >
          <Svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.43376 7.44163C0.316718 7.32444 0.250977 7.16559 0.250977 6.99996C0.250977 6.83434 0.316718 6.67549 0.43376 6.5583L6.68376 0.308299C6.74098 0.246893 6.80998 0.197641 6.88664 0.163481C6.96331 0.129321 7.04607 0.110953 7.12999 0.109472C7.21391 0.107992 7.29727 0.123429 7.37509 0.154863C7.45291 0.186297 7.52361 0.233084 7.58296 0.292433C7.64231 0.351782 7.68909 0.422477 7.72053 0.5003C7.75196 0.578124 7.7674 0.661482 7.76592 0.745401C7.76444 0.82932 7.74607 0.912081 7.71191 0.988747C7.67775 1.06541 7.6285 1.13441 7.56709 1.19163L1.75876 6.99996L7.56709 12.8083C7.6285 12.8655 7.67775 12.9345 7.71191 13.0112C7.74607 13.0878 7.76444 13.1706 7.76592 13.2545C7.7674 13.3384 7.75196 13.4218 7.72053 13.4996C7.68909 13.5775 7.64231 13.6481 7.58296 13.7075C7.52361 13.7668 7.45291 13.8136 7.37509 13.8451C7.29727 13.8765 7.21391 13.8919 7.12999 13.8905C7.04607 13.889 6.96331 13.8706 6.88664 13.8364C6.80998 13.8023 6.74098 13.753 6.68376 13.6916L0.43376 7.44163Z"
              fill="#64748B"
            />
          </Svg>
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#1b1b1b" }}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity onPress={() => {}}>
        <Svg
          width="4"
          height="18"
          viewBox="0 0 4 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M2 2.77778C1.73478 2.77778 1.48043 2.68413 1.29289 2.51743C1.10536 2.35073 1 2.12464 1 1.88889C1 1.65314 1.10536 1.42705 1.29289 1.26035C1.48043 1.09365 1.73478 1 2 1C2.26522 1 2.51957 1.09365 2.70711 1.26035C2.89464 1.42705 3 1.65314 3 1.88889C3 2.12464 2.89464 2.35073 2.70711 2.51743C2.51957 2.68413 2.26522 2.77778 2 2.77778ZM2 9.88889C1.73478 9.88889 1.48043 9.79524 1.29289 9.62854C1.10536 9.46184 1 9.23575 1 9C1 8.76425 1.10536 8.53816 1.29289 8.37146C1.48043 8.20476 1.73478 8.11111 2 8.11111C2.26522 8.11111 2.51957 8.20476 2.70711 8.37146C2.89464 8.53816 3 8.76425 3 9C3 9.23575 2.89464 9.46184 2.70711 9.62854C2.51957 9.79524 2.26522 9.88889 2 9.88889ZM2 17C1.73478 17 1.48043 16.9064 1.29289 16.7397C1.10536 16.573 1 16.3469 1 16.1111C1 15.8754 1.10536 15.6493 1.29289 15.4826C1.48043 15.3159 1.73478 15.2222 2 15.2222C2.26522 15.2222 2.51957 15.3159 2.70711 15.4826C2.89464 15.6493 3 15.8754 3 16.1111C3 16.3469 2.89464 16.573 2.70711 16.7397C2.51957 16.9064 2.26522 17 2 17Z"
            stroke="#1B1B1B"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export default NotifyHeader;
