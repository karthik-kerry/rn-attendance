import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RequestCard = ({
  initial,
  name,
  content,
  profileBg,
  profileText,
  time,
  btnText1,
  btnPrimary1,
  btnSecondary1,
  btnOnPress1,
  btnText2,
  btnPrimary2,
  btnSecondary2,
  btnOnPress2,
  isApproved,
  isNotificationSend,
}) => {
  if (isApproved) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 50,
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
              width: "80%",
            }}
          >
            <Text
              style={{
                lineHeight: 20,
              }}
            >
              <Text
                style={{
                  color: profileText,
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {name}{" "}
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: "Inter-Regular",
                }}
              >
                {content}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#64748B",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {time}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            marginVertical: 10,
          }}
        >
          <Ionicons name="checkmark-done-sharp" size={20} color="#13950F" />
          <Text style={{ color: "#13950F", fontFamily: "Inter-SemiBold" }}>
            Approved
          </Text>
        </View>
        <View
          style={{
            height: 0.8,
            width: "100%",
            backgroundColor: "#E2E8F0",
            marginVertical: 10,
          }}
        />
      </View>
    );
  }

  if (isNotificationSend) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 50,
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
              width: "80%",
            }}
          >
            <Text
              style={{
                lineHeight: 20,
              }}
            >
              <Text
                style={{
                  color: profileText,
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {name}{" "}
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: "Inter-Regular",
                }}
              >
                {content}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#64748B",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {time}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            marginVertical: 10,
          }}
        >
          <Ionicons name="checkmark-done-sharp" size={20} color="#13950F" />
          <Text style={{ color: "#13950F", fontFamily: "Inter-SemiBold" }}>
            Notification Send
          </Text>
        </View>
        <View
          style={{
            height: 0.8,
            width: "100%",
            backgroundColor: "#E2E8F0",
            marginVertical: 10,
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <View
          style={{
            height: 46,
            width: 46,
            borderRadius: 50,
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            width: "80%",
          }}
        >
          <Text
            style={{
              lineHeight: 20,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
              }}
            >
              {name}{" "}
            </Text>
            <Text
              style={{
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              {content}
            </Text>
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: "Inter-SemiBold",
          color: "#64748B",
          fontSize: 12,
          textAlign: "right",
        }}
      >
        {time}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={btnOnPress1}
          style={{
            backgroundColor: btnSecondary1,
            borderWidth: 1,
            borderColor: btnPrimary1,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: btnPrimary1, fontFamily: "Inter-SemiBold" }}>
            {btnText1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={btnOnPress2}
          style={{
            backgroundColor: btnSecondary2,
            borderWidth: 1,
            borderColor: btnPrimary2,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: btnPrimary2, fontFamily: "Inter-SemiBold" }}>
            {btnText2}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 10,
        }}
      />
    </View>
  );
};

export default RequestCard;
