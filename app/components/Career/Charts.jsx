import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, {
  Path,
  Circle,
  Rect,
  Text as SvgText,
  G,
  Line,
  Polyline,
  Polygon,
} from "react-native-svg";
import { C } from "../../constant/colors";
import RNDot from "../Career/RNDot";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── SHARED TICK HELPER ───────────────────────────────────────────────────────
export const generateYTicks = (maxVal, tickCount = 5) => {
  if (maxVal === 0) return [0];
  const intMax = Math.ceil(maxVal);
  if (intMax <= tickCount)
    return Array.from({ length: intMax + 1 }, (_, i) => i);
  const rawStep = intMax / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude || 1;
  const niceMax = Math.ceil(intMax / niceStep) * niceStep;
  const ticks = [];
  for (let v = 0; v <= niceMax; v += niceStep) ticks.push(Math.round(v));
  return ticks;
};

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
export const DonutChart = ({ data, center, size = 160 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.32;
  const r = size * 0.22;
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  const CORNER = 0.05;

  const arcs = [];
  let startAngle = -Math.PI / 2;

  data.forEach((d, i) => {
    const pct = total > 0 ? d.value / total : 1 / data.length;
    const angle = pct * 2 * Math.PI;
    const endAngle = startAngle + angle;
    if (angle < 0.01) {
      startAngle = endAngle;
      return;
    }

    const polarToCart = (a, radius) => ({
      x: cx + radius * Math.cos(a),
      y: cy + radius * Math.sin(a),
    });
    const s1 = polarToCart(startAngle + CORNER, R);
    const e1 = polarToCart(endAngle - CORNER, R);
    const s2 = polarToCart(endAngle - CORNER, r);
    const e2 = polarToCart(startAngle + CORNER, r);
    const lg = angle > Math.PI ? 1 : 0;

    arcs.push(
      <Path
        key={i}
        d={`M ${s1.x} ${s1.y} A ${R} ${R} 0 ${lg} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${r} ${r} 0 ${lg} 0 ${e2.x} ${e2.y} Z`}
        fill={d.color}
      />,
    );
    startAngle = endAngle;
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 8,
      }}
    >
      <View style={{ position: "relative", width: size, height: size }}>
        <Svg width={size} height={size}>
          {arcs}
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1B1B1B" }}>
            {center.value}
          </Text>
          <Text style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>
            {center.label}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <RNDot color={d.color} size={10} />
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#1B1B1B" }}
              >
                {d.value}
              </Text>
              <Text style={{ fontSize: 10, color: "#888" }}>{d.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── SPIRAL CHART ─────────────────────────────────────────────────────────────
export const SpiralChart = ({ data, center }) => {
  const svgW = 220;
  const svgH = 140;
  const cx = svgW * 0.45;
  const cy = svgH * 0.95;
  const baseInner = 20;
  const thickness = 16;
  const gap = 5;
  const total = center.value || 1;

  const polarToCart = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(Math.PI - rad),
      y: cy - r * Math.sin(Math.PI - rad),
    };
  };

  const arcs = [];
  data.forEach((d, i) => {
    const inner = baseInner + i * (thickness + gap);
    const outer = inner + thickness;
    const pct = Math.min(d.value / total, 1);
    const sweepDeg = pct * 180;

    const bgS = polarToCart(0, inner);
    const bgE = polarToCart(180, inner);
    const bgSO = polarToCart(0, outer);
    const bgEO = polarToCart(180, outer);
    arcs.push(
      <Path
        key={`bg-${i}`}
        d={`M ${bgSO.x} ${bgSO.y} A ${outer} ${outer} 0 0 1 ${bgEO.x} ${bgEO.y} L ${bgE.x} ${bgE.y} A ${inner} ${inner} 0 0 0 ${bgS.x} ${bgS.y} Z`}
        fill="#E5E7EB"
      />,
    );

    if (sweepDeg > 1) {
      const s = polarToCart(0, inner);
      const e = polarToCart(sweepDeg, inner);
      const sO = polarToCart(0, outer);
      const eO = polarToCart(sweepDeg, outer);
      const lg = sweepDeg > 90 ? 1 : 0;
      arcs.push(
        <Path
          key={`val-${i}`}
          d={`M ${sO.x} ${sO.y} A ${outer} ${outer} 0 ${lg} 1 ${eO.x} ${eO.y} L ${e.x} ${e.y} A ${inner} ${inner} 0 ${lg} 0 ${s.x} ${s.y} Z`}
          fill={d.color}
          fillOpacity={0.9}
        />,
      );
    }
  });

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ position: "relative", width: svgW, height: svgH }}>
        <Svg width={svgW} height={svgH}>
          {arcs}
        </Svg>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700" }}>
            {center.value}
          </Text>
          <Text style={{ fontSize: 10, color: "#9CA3AF" }}>{center.label}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <RNDot color={d.color} size={10} />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700" }}>{d.value}</Text>
              <Text style={{ fontSize: 10, color: "#888" }}>{d.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── BAR CHART ────────────────────────────────────────────────────────────────
export const BarChartSVG = ({
  data,
  keys,
  colors,
  height = 200,
  fixedWidth,
}) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );
  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];
  const groupW = chartW / Math.max(data.length, 1);
  const barW = Math.max(groupW / (keys.length + 1) - 2, 4);

  return (
    <Svg width={svgW} height={height}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {data.map((d, di) => {
        const groupX = PAD_L + di * groupW + groupW * 0.1;
        return keys.map((k, ki) => {
          const val = d[k] || 0;
          const barH = (val / niceMax) * chartH;
          const x = groupX + ki * (barW + 2);
          const y = PAD_T + chartH - barH;
          return (
            <Rect
              key={`${di}-${ki}`}
              x={x}
              y={y}
              width={barW}
              height={Math.max(barH, 0)}
              fill={colors[ki]}
              rx={2}
            />
          );
        });
      })}
      {data.map((d, di) => {
        const x = PAD_L + di * groupW + groupW / 2;
        const words = (d.name || "").split(" ");
        return (
          <G key={`lbl-${di}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={x}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── LINE CHART ───────────────────────────────────────────────────────────────
export const LineChartSVG = ({
  data,
  keys,
  colors,
  height = 180,
  fixedWidth,
}) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );
  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];
  const n = data.length;
  const xOf = (i) => PAD_L + (n < 2 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yOf = (v) => PAD_T + chartH - (v / niceMax) * chartH;

  return (
    <Svg width={svgW} height={height}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {keys.map((k, ki) => {
        const pts = data.map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`).join(" ");
        return (
          <G key={`line-${ki}`}>
            <Polyline
              points={pts}
              fill="none"
              stroke={colors[ki]}
              strokeWidth={2}
            />
            {data.map((d, i) => (
              <Circle
                key={i}
                cx={xOf(i)}
                cy={yOf(d[k] || 0)}
                r={3}
                fill={colors[ki]}
              />
            ))}
          </G>
        );
      })}
      {data.map((d, i) => {
        const words = (d.name || "").split(" ");
        return (
          <G key={`lbl-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={xOf(i)}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── AREA CHART ───────────────────────────────────────────────────────────────
export const AreaChartSVG = ({
  data,
  keys,
  colors,
  height = 180,
  fixedWidth,
}) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );
  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];
  const n = data.length;
  const xOf = (i) => PAD_L + (n < 2 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yOf = (v) => PAD_T + chartH - (v / niceMax) * chartH;
  const baseY = PAD_T + chartH;

  return (
    <Svg width={svgW} height={height}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {keys.map((k, ki) => {
        if (!data.length) return null;
        const linePts = data
          .map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`)
          .join(" ");
        const fillPts =
          `${xOf(0)},${baseY} ` +
          data.map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`).join(" ") +
          ` ${xOf(n - 1)},${baseY}`;
        return (
          <G key={`area-${ki}`}>
            <Polygon points={fillPts} fill={colors[ki]} fillOpacity={0.18} />
            <Polyline
              points={linePts}
              fill="none"
              stroke={colors[ki]}
              strokeWidth={2}
            />
          </G>
        );
      })}
      {data.map((d, i) => {
        const words = (d.name || "").split(" ");
        return (
          <G key={`lbl-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={xOf(i)}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── BULLET BAR CHART ─────────────────────────────────────────────────────────
export const BulletBarChartSVG = ({
  data,
  mainKey,
  subKey,
  mainColor,
  subColor,
}) => {
  const svgW = SCREEN_W - 80;
  const LABEL_W = 80,
    PAD_R = 8,
    ROW_H = 24,
    MAIN_H = 8,
    AXIS_H = 20;
  const BAR_AREA = svgW - LABEL_W - PAD_R;
  const svgH = data.length * ROW_H + AXIS_H;
  const maxVal = Math.max(
    ...data.map((d) => (d[mainKey] || 0) + (d[subKey] || 0)),
    1,
  );
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));
  const toX = (v) => LABEL_W + (v / maxVal) * BAR_AREA;

  return (
    <Svg width={svgW} height={svgH}>
      {xTicks.map((t, ti) => (
        <G key={`tick-${ti}`}>
          <Line
            x1={toX(t)}
            y1={0}
            x2={toX(t)}
            y2={svgH - AXIS_H}
            stroke="#E5E7EB"
            strokeWidth={1}
            strokeDasharray="4,3"
          />
          <SvgText
            x={toX(t)}
            y={svgH - 4}
            fontSize={9}
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {t}
          </SvgText>
        </G>
      ))}
      {data.map((d, i) => {
        const midY = i * ROW_H + ROW_H / 2;
        const mainW = Math.max(((d[mainKey] || 0) / maxVal) * BAR_AREA, 2);
        const subW = Math.max(((d[subKey] || 0) / maxVal) * BAR_AREA, 0);
        const words = (d.name || "").split(" ");
        return (
          <G key={`row-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={LABEL_W - 6}
                y={midY - (words.length - 1) * 5 + wi * 10 + 4}
                fontSize={8}
                fill="#6B7280"
                textAnchor="end"
              >
                {w}
              </SvgText>
            ))}
            <Rect
              x={LABEL_W}
              y={midY - MAIN_H / 2}
              width={mainW}
              height={MAIN_H}
              rx={MAIN_H / 2}
              fill={mainColor}
            />
            {subW > 0 && (
              <Rect
                x={LABEL_W}
                y={midY - MAIN_H / 2}
                width={subW}
                height={MAIN_H}
                rx={MAIN_H / 2}
                fill={subColor}
              />
            )}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── BUDGET BAR CHART ─────────────────────────────────────────────────────────
export const BudgetBarChartSVG = ({ data }) => {
  const svgW = SCREEN_W - 80;
  const PAD_L = 44,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = 220 - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.budget || 0, d.final || 0]),
    1,
  );
  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];
  const n = data.length;
  const groupW = chartW / Math.max(n, 1);
  const barW = Math.max(groupW * 0.3 - 2, 4);
  const toY = (v) => PAD_T + chartH - (v / niceMax) * chartH;
  const fmtK = (v) =>
    v >= 100000
      ? `${(v / 100000).toFixed(1)}L`
      : v >= 1000
        ? `${(v / 1000).toFixed(0)}K`
        : String(v);

  return (
    <Svg width={svgW} height={220}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={8}
              fill="#888"
              textAnchor="end"
            >
              {fmtK(val)}
            </SvgText>
          </G>
        );
      })}
      {data.map((d, di) => {
        const cx = PAD_L + di * groupW + groupW / 2;
        const budH = ((d.budget || 0) / niceMax) * chartH;
        const finH = ((d.final || 0) / niceMax) * chartH;
        return (
          <G key={`bar-${di}`}>
            <Rect
              x={cx - barW - 1}
              y={toY(d.budget || 0)}
              width={barW}
              height={Math.max(budH, 0)}
              fill={C.blueLight}
              rx={2}
            />
            <Rect
              x={cx + 1}
              y={toY(d.final || 0)}
              width={barW}
              height={Math.max(finH, 0)}
              fill={C.blue}
              rx={2}
            />
            {d.name.split(" ").map((w, wi) => (
              <SvgText
                key={wi}
                x={cx}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── PYRAMID ──────────────────────────────────────────────────────────────────
const PYRAMID_LEVELS_FALLBACK = [
  { color: "#0B045A", widthPct: 20 },
  { color: "#C35A12", widthPct: 40 },
  { color: "#B28D00", widthPct: 60 },
  { color: "#305898", widthPct: 80 },
  { color: "#3A5525", widthPct: 100 },
];

export const PyramidSVG = ({ levelCounts }) => {
  if (!levelCounts || Object.keys(levelCounts).length === 0) return null;

  const levels = Object.entries(levelCounts)
    .sort((a, b) => b[1] - a[1])
    .reverse()
    .map(([label, count], i) => ({
      label,
      count,
      color: PYRAMID_LEVELS_FALLBACK[i % PYRAMID_LEVELS_FALLBACK.length].color,
      widthPct:
        PYRAMID_LEVELS_FALLBACK[i % PYRAMID_LEVELS_FALLBACK.length].widthPct,
    }));

  const SEG_H = 36;
  const SVG_W = 200;
  const CX = SVG_W / 2;
  const LABEL_W = 90;
  const GAP = 10;
  const totalH = levels.length * SEG_H;
  const totalW = LABEL_W + GAP + SVG_W;
  const px = LABEL_W + GAP;

  return (
    <View style={{ alignItems: "center", paddingVertical: 10 }}>
      <Svg
        width={Math.min(totalW, SCREEN_W - 60)}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
      >
        {levels.map((l, i) => {
          const botW = (l.widthPct / 100) * SVG_W;
          const topW = i === 0 ? 0 : (levels[i - 1].widthPct / 100) * SVG_W;
          const y = i * SEG_H;
          const midY = y + SEG_H / 2;
          const topL = px + CX - topW / 2;
          const botL = px + CX - botW / 2;
          const leftEdge = (topL + botL) / 2;
          return (
            <G key={`${l.label}-${i}`}>
              <Polygon
                points={`${topL},${y} ${topL + topW},${y} ${botL + botW},${y + SEG_H} ${botL},${y + SEG_H}`}
                fill={l.color}
                fillOpacity={0.9}
              />
              <Line
                x1={LABEL_W}
                y1={midY}
                x2={leftEdge - 2}
                y2={midY}
                stroke="#C0C0C0"
                strokeWidth={0.8}
              />
              <SvgText
                x={LABEL_W - 30}
                y={midY + 4}
                fontSize={11}
                fill="#444"
                textAnchor="end"
              >
                {l.label} - {l.count}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};
