import { View, Text } from "react-native";
import React, { useState } from "react";
import { Checkbox } from "react-native-paper";

const UserEmpCard = ({ name, initial, code, role, profileBg, profileText }) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 51,
              width: 51,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: profileBg,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              {initial}
            </Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  color: "#1b1b1b",
                  fontSize: 16,
                }}
              >
                {name}
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                ({code})
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
              {role}
            </Text>
          </View>
        </View>
        <View>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
            color="#2563EB"
            uncheckedColor="#64748B"
          />
        </View>
      </View>
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 5,
        }}
      />
    </>
  );
};

export default UserEmpCard;
