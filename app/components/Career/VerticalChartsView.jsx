import React from "react";
import { ScrollView } from "react-native";
import ChartCard from "./ChartCard";
import LegendRow from "./LegendRow";
import ChartCardWithTable from "../Career/ChartCardWithTable";
import OpenPositionTable from "../Career/OpenPositionTable";
import { C } from "../../constant/colors";
import {
  PyramidSVG,
  BudgetBarChartSVG,
  LineChartSVG,
  AreaChartSVG,
  BarChartSVG,
  BulletBarChartSVG,
} from "../Career/Charts";

const VerticalChartsView = ({
  newVsReplacementData,
  priorityOpenData,
  hireVerticalData,
  hireVsExitData,
  sourceOfHiringData,
  overallLevelCounts,
  budgetVsFinalData,
}) => (
  <>
    <ChartCardWithTable
      title="New vs Replacement Hiring by Vertical"
      legend={
        <LegendRow
          items={[
            ["New", C.orange],
            ["Replacement", C.blue],
          ]}
        />
      }
      chartData={newVsReplacementData}
      chartKeys={["new", "rep"]}
      chartColors={[C.orange, C.blue]}
      ChartComponent={LineChartSVG}
      fixedWidthBase={newVsReplacementData.length * 60}
      tableColumns={newVsReplacementData.map((d) => d.name)}
      tableRows={[
        {
          label: "New",
          color: C.orange,
          values: newVsReplacementData.map((d) => d.new),
        },
        {
          label: "Replacement",
          color: C.blue,
          values: newVsReplacementData.map((d) => d.rep),
        },
      ]}
    />

    <OpenPositionTable data={priorityOpenData} />

    <ChartCardWithTable
      title="Hire - Vertical Wise"
      legend={
        <LegendRow
          items={[
            ["Male", C.violet],
            ["Female", C.orange],
          ]}
        />
      }
      chartData={hireVerticalData}
      chartKeys={["male", "female"]}
      chartColors={[C.violet, C.orange]}
      ChartComponent={BulletBarChartSVG}
      chartProps={{
        mainKey: "male",
        subKey: "female",
        mainColor: C.violet,
        subColor: C.orange,
      }}
      fixedWidthBase={hireVerticalData.length * 60}
      tableColumns={hireVerticalData.map((d) => d.name)}
      tableRows={[
        {
          label: "Male",
          color: C.violet,
          values: hireVerticalData.map((d) => d.male),
        },
        {
          label: "Female",
          color: C.orange,
          values: hireVerticalData.map((d) => d.female),
        },
      ]}
    />

    <ChartCardWithTable
      title="Employee Hire vs Exit"
      legend={
        <LegendRow
          items={[
            ["Hire", C.blue],
            ["Exit", "#FAC6D0"],
          ]}
        />
      }
      chartData={hireVsExitData}
      chartKeys={["hire", "exit"]}
      chartColors={[C.blue, "#FAC6D0"]}
      ChartComponent={AreaChartSVG}
      fixedWidthBase={hireVsExitData.length * 60}
      tableColumns={hireVsExitData.map((d) => d.name)}
      tableRows={[
        {
          label: "Hire",
          color: C.blue,
          values: hireVsExitData.map((d) => d.hire),
        },
        {
          label: "Exit",
          color: "#FAC6D0",
          values: hireVsExitData.map((d) => d.exit),
        },
      ]}
    />

    <ChartCardWithTable
      title="Source of Hiring"
      legend={
        <LegendRow
          items={[
            ["Consultancy", C.blue],
            ["Internal", C.orange],
            ["Portal", C.grey],
            ["Website", C.amber],
          ]}
          wrap
        />
      }
      chartData={sourceOfHiringData}
      chartKeys={["consultancy", "internal", "portal", "website"]}
      chartColors={[C.blue, C.orange, C.grey, C.amber]}
      ChartComponent={BarChartSVG}
      fixedWidthBase={sourceOfHiringData.length * 80}
      tableColumns={sourceOfHiringData.map((d) => d.name)}
      tableRows={[
        {
          label: "Consultancy",
          color: C.blue,
          values: sourceOfHiringData.map((d) => d.consultancy),
        },
        {
          label: "Internal",
          color: C.orange,
          values: sourceOfHiringData.map((d) => d.internal),
        },
        {
          label: "Portal",
          color: C.grey,
          values: sourceOfHiringData.map((d) => d.portal),
        },
        {
          label: "Website",
          color: C.amber,
          values: sourceOfHiringData.map((d) => d.website),
        },
      ]}
    />

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

export default VerticalChartsView;
