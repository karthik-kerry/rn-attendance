import React from "react";
import { ScrollView } from "react-native";
import ChartCard from "../Career/ChartCard";
import LegendRow from "../Career/LegendRow";
import OverallDonutsSection from "../Career/OverallDonutsSection";
import { C } from "../../constant/colors";
import { SpiralChart, PyramidSVG, BudgetBarChartSVG } from "../Career/Charts";

const OverallChartsView = ({
  dynamicOverallDonuts,
  dynamicSpiralData,
  overallSourceOfHiring,
  overallLevelCounts,
  budgetVsFinalData,
}) => (
  <>
    <OverallDonutsSection donuts={dynamicOverallDonuts} />

    <ChartCard
      title="Source of Hiring"
      legend={
        <LegendRow
          items={[
            ["Consultancy", C.blueLight],
            ["Internal", C.blue],
            ["Portal", C.blueDark],
            ["Website", C.blueDark1],
          ]}
          wrap
        />
      }
    >
      <SpiralChart
        data={
          dynamicSpiralData ?? [
            { name: "Consultancy", value: 0, color: C.blueLight },
            { name: "Internal", value: 0, color: C.blue },
            { name: "Portal", value: 0, color: C.blueDark },
            { name: "Website", value: 0, color: C.blueDark1 },
          ]
        }
        center={{
          value: overallSourceOfHiring?.total ?? 0,
          label: "Total Hires",
        }}
      />
    </ChartCard>

    <ChartCard title="Job Levels">
      {overallLevelCounts && <PyramidSVG levelCounts={overallLevelCounts} />}
    </ChartCard>

    <ChartCard
      title="Budget vs Actual CTC by Month"
      legend={
        <LegendRow
          items={[
            ["Budget", C.blueLight],
            ["Actual CTC", C.blue],
          ]}
        />
      }
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BudgetBarChartSVG data={budgetVsFinalData} />
      </ScrollView>
    </ChartCard>
  </>
);

export default OverallChartsView;
