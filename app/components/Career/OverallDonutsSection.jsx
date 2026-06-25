import React from "react";
import ChartCard from "./ChartCard";
import LegendRow from "./LegendRow";
import { DonutChart } from "./Charts";

const OverallDonutsSection = ({ donuts }) =>
  donuts.map((d) => (
    <ChartCard
      key={d.title}
      title={d.title}
      legend={<LegendRow items={d.data.map((s) => [s.name, s.color])} wrap />}
    >
      <DonutChart data={d.data} center={d.center} />
    </ChartCard>
  ));

export default OverallDonutsSection;
