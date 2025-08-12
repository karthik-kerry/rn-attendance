import { View, Text, TouchableOpacity } from "react-native";

const FixedBreakCard = ({ title, icon, duration }) => {
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        borderWidth: 1,
        borderColor: "#00000033",
        borderRadius: 8,
        height: 72,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 20,
          height: "100%",
        }}
      >
        {icon}
        <View>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
            }}
          >
            {title}
          </Text>
          <Text style={{ color: "#64748B", fontFamily: "Inter-SemiBold" }}>
            {duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FixedBreakCard;
