import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const General = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingVertical: 20, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 40,
            paddingHorizontal: 30,
            width: "100%",
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              gap: 20,
              width: "50%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#DFF5E1",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#13950F",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  P
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Present
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE3E3",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#E4403B",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  A
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Absent
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#EDEDED",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#64748B",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  O
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Off Day
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE1CC",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Deduction
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE9F0",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FF9EBD",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  H
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Holiday
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#CDBAAF",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopLeftRadius: 20,
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Ignored
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#9C6BFF",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopLeftRadius: 20,
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Grace
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M12 4.5V12H17.625M23.25 12C23.25 13.4774 22.959 14.9403 22.3936 16.3052C21.8283 17.6701 20.9996 18.9103 19.955 19.955C18.9103 20.9996 17.6701 21.8283 16.3052 22.3936C14.9403 22.959 13.4774 23.25 12 23.25C10.5226 23.25 9.05972 22.959 7.69481 22.3936C6.3299 21.8283 5.08971 20.9996 4.04505 19.955C3.00039 18.9103 2.17172 17.6701 1.60636 16.3052C1.04099 14.9403 0.75 13.4774 0.75 12C0.75 9.01631 1.93526 6.15483 4.04505 4.04505C6.15483 1.93526 9.01631 0.75 12 0.75C14.9837 0.75 17.8452 1.93526 19.955 4.04505C22.0647 6.15483 23.25 9.01631 23.25 12Z"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>

              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Overtime
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFE6D5",
                  height: 16,
                  width: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 50,
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Overlapping Days
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              gap: 20,
              width: "50%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF7D1",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#F9DF66",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  L
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Leave
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#E3F2FD",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#5CB8FB",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  R
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Rest Day
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#D7F3FE",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "#6BD1F9",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 12,
                  }}
                >
                  OD
                </Text>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                On Duty
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FCF6DF",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Deduction Alert
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FF9C63",
                  height: 24,
                  width: 24,
                  borderTopLeftRadius: 20,
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Permission
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#F3E8FF",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Svg
                  width="11"
                  height="18"
                  viewBox="0 0 11 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M5.5 14.8337C6.19033 14.8337 6.75 15.3933 6.75 16.0837C6.75 16.774 6.19033 17.3337 5.5 17.3337C4.80967 17.3337 4.25 16.774 4.25 16.0837C4.25 15.3933 4.80967 14.8337 5.5 14.8337ZM5.5 0.666992C8.26142 0.666992 10.5 2.90557 10.5 5.66699C10.5 7.47082 9.87283 8.40924 8.27158 9.76957C6.6655 11.134 6.33333 11.7477 6.33333 13.167H4.66667C4.66667 11.1053 5.3225 10.088 7.1925 8.49941C8.45658 7.42549 8.83333 6.86177 8.83333 5.66699C8.83333 3.82604 7.34092 2.33366 5.5 2.33366C3.65905 2.33366 2.16667 3.82604 2.16667 5.66699V6.50032H0.5V5.66699C0.5 2.90557 2.73857 0.666992 5.5 0.666992Z"
                    fill="#9842F5"
                  />
                </Svg>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Status Unknown
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#3CDDCF",
                  height: 24,
                  width: 24,
                  borderTopLeftRadius: 20,
                }}
              />
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Regularized
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFD9CC",
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M12.5517 2.73937L13.9575 1.33271C14.2506 1.03964 14.648 0.875 15.0625 0.875C15.477 0.875 15.8744 1.03964 16.1675 1.33271C16.4606 1.62577 16.6252 2.02325 16.6252 2.43771C16.6252 2.85216 16.4606 3.24964 16.1675 3.54271L7.31833 12.3919C6.87777 12.8322 6.33447 13.1558 5.7375 13.3335L3.5 14.0002L4.16667 11.7627C4.3444 11.1657 4.66803 10.6224 5.10833 10.1819L12.5517 2.73937ZM12.5517 2.73937L14.75 4.93771M13.5 10.6669V14.6252C13.5 15.1225 13.3025 15.5994 12.9508 15.951C12.5992 16.3027 12.1223 16.5002 11.625 16.5002H2.875C2.37772 16.5002 1.90081 16.3027 1.54917 15.951C1.19754 15.5994 1 15.1225 1 14.6252V5.87521C1 5.37793 1.19754 4.90101 1.54917 4.54938C1.90081 4.19775 2.37772 4.00021 2.875 4.00021H6.83333"
                    stroke="#FF5A21"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text
                style={{ color: "#1B1B1B99", fontFamily: "Inter-SemiBold" }}
              >
                Override
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default General;
