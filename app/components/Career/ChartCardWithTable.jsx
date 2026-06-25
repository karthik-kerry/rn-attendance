import React from "react";
import { ScrollView, Dimensions } from "react-native";
import ChartCard from "./ChartCard";
import ChartTableRN from "./ChartTableRN";

const { width: SCREEN_W } = Dimensions.get("window");

const ChartCardWithTable = ({
  title,
  legend,
  chartData,
  chartKeys,
  chartColors,
  ChartComponent,
  chartProps = {},
  tableColumns,
  tableRows,
  fixedWidthBase,
}) => {
  const fixedWidth = Math.max(SCREEN_W - 80, fixedWidthBase + 60);
  return (
    <ChartCard title={title} legend={legend}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <ChartComponent
          data={chartData}
          keys={chartKeys}
          colors={chartColors}
          fixedWidth={fixedWidth}
          {...chartProps}
        />
      </ScrollView>
      <ChartTableRN columns={tableColumns} rows={tableRows} />
    </ChartCard>
  );
};

export default ChartCardWithTable;
