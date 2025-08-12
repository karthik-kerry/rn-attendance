import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const FlexibleBreakCard = ({ id, title, icon, duration, openModal }) => {
  const { width } = Dimensions.get("window");

  return (
    <TouchableOpacity
      onPress={() => console.log("Card Pressed =>", id)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        height: 114,
        width: width - 225,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 10 }}>
          {icon}
          <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
            {title}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        <Text
          style={{
            color: "#64748B",
            fontSize: 12,
            fontWeight: "Inter-SemiBold",
          }}
        >
          {duration} mins
        </Text>
        <TouchableOpacity onPress={openModal}>
          <Svg
            width="3"
            height="15"
            viewBox="0 0 3 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M1.5 0.5C1.89782 0.5 2.27936 0.658035 2.56066 0.93934C2.84196 1.22064 3 1.60218 3 2C3 2.39782 2.84196 2.77936 2.56066 3.06066C2.27936 3.34196 1.89782 3.5 1.5 3.5C1.10218 3.5 0.720644 3.34196 0.43934 3.06066C0.158035 2.77936 0 2.39782 0 2C0 1.60218 0.158035 1.22064 0.43934 0.93934C0.720644 0.658035 1.10218 0.5 1.5 0.5ZM1.5 6C1.89782 6 2.27936 6.15804 2.56066 6.43934C2.84196 6.72064 3 7.10218 3 7.5C3 7.89782 2.84196 8.27936 2.56066 8.56066C2.27936 8.84196 1.89782 9 1.5 9C1.10218 9 0.720644 8.84196 0.43934 8.56066C0.158035 8.27936 0 7.89782 0 7.5C0 7.10218 0.158035 6.72064 0.43934 6.43934C0.720644 6.15804 1.10218 6 1.5 6ZM3 13C3 12.6022 2.84196 12.2206 2.56066 11.9393C2.27936 11.658 1.89782 11.5 1.5 11.5C1.10218 11.5 0.720644 11.658 0.43934 11.9393C0.158035 12.2206 0 12.6022 0 13C0 13.3978 0.158035 13.7794 0.43934 14.0607C0.720644 14.342 1.10218 14.5 1.5 14.5C1.89782 14.5 2.27936 14.342 2.56066 14.0607C2.84196 13.7794 3 13.3978 3 13Z"
              fill="#64748B"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FlexibleBreakCard;
