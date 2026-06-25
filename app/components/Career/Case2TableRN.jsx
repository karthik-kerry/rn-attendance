import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import ChartCard from "./ChartCard";
import RNDot from "./RNDot";
import RNLegendItem from "./RNLegendItem";
import { SHORT_MONTHS, PERIOD_COLORS } from "../../constant/filterConstants";
import { BarChartSVG } from "./Charts";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── TABLE STYLES ─────────────────────────────────────────────────────────────
const thStyle = {
  backgroundColor: "#1E3A5F",
  padding: 6,
  borderWidth: 0.5,
  borderColor: "#152D4A",
};
const thTxt = {
  fontSize: 10,
  fontWeight: "600",
  color: "#fff",
  textAlign: "center",
};
const thLightStyle = {
  backgroundColor: "#EEF4FF",
  padding: 6,
  borderWidth: 0.5,
  borderColor: "#D0D9F0",
};
const thLightTxt = {
  fontSize: 9,
  fontWeight: "600",
  color: "#2563EB",
  textAlign: "center",
};
const tdStyle = {
  padding: 6,
  borderWidth: 0.5,
  borderColor: "#E8EEFF",
};
const tdTxt = {
  fontSize: 10,
  textAlign: "center",
  color: "#1B1B1B",
};
const tdLabelStyle = {
  padding: 6,
  borderWidth: 0.5,
  borderColor: "#E8EEFF",
  backgroundColor: "#FAFBFF",
};

const SNO_W = 36;
const MONTH_W = 120;
const CELL_W = 70;

// ─── PERIOD LABEL HELPER ──────────────────────────────────────────────────────
const getPeriodLabel = (p) => {
  const dStart = p.start ? new Date(p.start) : null;
  const dEnd = p.end ? new Date(p.end) : null;
  if (!dStart) return p.label || "—";
  const startStr = `${SHORT_MONTHS[dStart.getMonth()]} ${dStart.getFullYear()}`;
  if (
    dEnd &&
    !(
      dStart.getMonth() === dEnd.getMonth() &&
      dStart.getFullYear() === dEnd.getFullYear()
    )
  ) {
    return `${startStr} – ${SHORT_MONTHS[dEnd.getMonth()]} ${dEnd.getFullYear()}`;
  }
  return startStr;
};

// ─── CASE2 TABLE ─────────────────────────────────────────────────────────────
const Case2TableRN = ({ title, periods, deptIds, deptNames, subRows }) => {
  // ── Bar chart data ───────────────────────────────────────────────────────────
  const barData = deptIds.map((deptId, di) => {
    const entry = { name: deptNames[di] };
    periods.forEach((p, pi) => {
      subRows.forEach((sr) => {
        const key = `P${pi + 1}__${sr.label}`;
        entry[key] = sr.getter(p._raw, deptId) || 0;
      });
    });
    return entry;
  });

  const barKeys = [];
  const barColors = [];
  periods.forEach((p, pi) => {
    subRows.forEach((sr) => {
      barKeys.push(`P${pi + 1}__${sr.label}`);
      barColors.push(
        subRows.length > 1
          ? sr.color
          : PERIOD_COLORS[pi % PERIOD_COLORS.length],
      );
    });
  });

  const chartWidth = Math.max(
    SCREEN_W - 80,
    deptIds.length * subRows.length * 40 + 60,
  );

  const tableWidth =
    SNO_W +
    MONTH_W +
    (deptIds.length * subRows.length + subRows.length) * CELL_W;

  return (
    <ChartCard title={title}>
      {/* ── Legend + Bar chart ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        <View style={{ flexDirection: "column", gap: 6 }}>
          {/* Legend */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {(subRows.length > 1
              ? subRows.map((sr) => ({ label: sr.label, color: sr.color }))
              : periods.map((p, pi) => ({
                  label: getPeriodLabel(p),
                  color: PERIOD_COLORS[pi % PERIOD_COLORS.length],
                }))
            ).map((l, i) => (
              <RNLegendItem key={i} color={l.color} label={l.label} />
            ))}
          </View>
          {/* Chart */}
          <BarChartSVG
            data={barData}
            keys={barKeys}
            colors={barColors}
            height={200}
            fixedWidth={chartWidth}
          />
        </View>
      </ScrollView>

      {/* ── Table ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        <View style={{ width: tableWidth }}>
          {/* Header row 1 */}
          <View style={{ flexDirection: "row" }}>
            <View style={[thStyle, { width: SNO_W }]}>
              <Text style={thTxt}>S.No</Text>
            </View>
            <View style={[thStyle, { width: MONTH_W }]}>
              <Text style={thTxt}>Month</Text>
            </View>
            {deptNames.map((name) => (
              <View
                key={name}
                style={[thStyle, { width: CELL_W * subRows.length }]}
              >
                <Text style={thTxt} numberOfLines={2}>
                  {name}
                </Text>
              </View>
            ))}
            <View style={[thStyle, { width: CELL_W * subRows.length }]}>
              <Text style={thTxt}>Total</Text>
            </View>
          </View>

          {/* Header row 2 — sub-row labels */}
          {subRows.length > 1 && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: SNO_W }} />
              <View style={{ width: MONTH_W }} />
              {deptNames.map((name) =>
                subRows.map((sr) => (
                  <View
                    key={`${name}-${sr.label}`}
                    style={[thLightStyle, { width: CELL_W }]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <RNDot color={sr.color} size={6} />
                      <Text style={thLightTxt}>{sr.label}</Text>
                    </View>
                  </View>
                )),
              )}
              {subRows.map((sr) => (
                <View
                  key={`tot-${sr.label}`}
                  style={[thLightStyle, { width: CELL_W }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <RNDot color={sr.color} size={6} />
                    <Text style={thLightTxt}>{sr.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Data rows */}
          {periods.map((period, pi) => (
            <View
              key={pi}
              style={{
                flexDirection: "row",
                backgroundColor: pi % 2 === 0 ? "#fff" : "#F7F9FF",
                minWidth: SCREEN_W - 40,
              }}
            >
              <View style={[tdStyle, { width: SNO_W }]}>
                <Text style={{ ...tdTxt, color: "#888" }}>{pi + 1}</Text>
              </View>
              <View style={[tdLabelStyle, { width: MONTH_W }]}>
                <Text
                  style={{ fontSize: 10, fontWeight: "600", color: "#374151" }}
                >
                  {getPeriodLabel(period)}
                </Text>
                {period.label ? (
                  <Text style={{ fontSize: 8, color: "#888" }}>
                    ({period.label})
                  </Text>
                ) : null}
              </View>
              {deptIds.map((deptId) =>
                subRows.map((sr) => (
                  <View
                    key={`${deptId}-${sr.label}`}
                    style={[tdStyle, { width: CELL_W }]}
                  >
                    <Text style={tdTxt}>{sr.getter(period._raw, deptId)}</Text>
                  </View>
                )),
              )}
              {subRows.map((sr) => {
                const rowTotal = deptIds.reduce(
                  (sum, id) => sum + (sr.getter(period._raw, id) || 0),
                  0,
                );
                return (
                  <View
                    key={`row-tot-${sr.label}`}
                    style={[
                      tdStyle,
                      { width: CELL_W, backgroundColor: "#EEF4FF" },
                    ]}
                  >
                    <Text style={{ ...tdTxt, fontWeight: "600" }}>
                      {rowTotal}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Total row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F0F5FF",
              minWidth: SCREEN_W - 40,
            }}
          >
            <View style={[tdStyle, { width: SNO_W }]}>
              <Text style={tdTxt} />
            </View>
            <View
              style={[
                tdLabelStyle,
                { width: MONTH_W, backgroundColor: "#F0F5FF" },
              ]}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "700", color: "#1E3A5F" }}
              >
                Total
              </Text>
            </View>
            {deptIds.map((deptId) =>
              subRows.map((sr) => {
                const colTotal = periods.reduce(
                  (sum, p) => sum + (sr.getter(p._raw, deptId) || 0),
                  0,
                );
                return (
                  <View
                    key={`col-tot-${deptId}-${sr.label}`}
                    style={[
                      tdStyle,
                      { width: CELL_W, backgroundColor: "#F0F5FF" },
                    ]}
                  >
                    <Text
                      style={{ ...tdTxt, fontWeight: "700", color: "#1E3A5F" }}
                    >
                      {colTotal}
                    </Text>
                  </View>
                );
              }),
            )}
            {subRows.map((sr) => {
              const grandTotal = periods.reduce(
                (sum, p) =>
                  sum +
                  deptIds.reduce(
                    (s2, id) => s2 + (sr.getter(p._raw, id) || 0),
                    0,
                  ),
                0,
              );
              return (
                <View
                  key={`grand-${sr.label}`}
                  style={[
                    tdStyle,
                    { width: CELL_W, backgroundColor: "#D6E4FF" },
                  ]}
                >
                  <Text
                    style={{ ...tdTxt, fontWeight: "700", color: "#1E3A5F" }}
                  >
                    {grandTotal}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ChartCard>
  );
};

export default Case2TableRN;
