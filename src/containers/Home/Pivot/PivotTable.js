import React, { useState, useMemo } from "react";
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable";
import { sampleOrders } from "../../../components/Hello/sampleOrders";
import Hello from "../../../components/Hello/Hello";
import "./PivotTable.css"; // Import your CSS file

const PivotTable = () => {
  const [pivotState, setPivotState] = useState({
    rows: ["category"],
    cols: ["status"],
    vals: ["orderValue", "buyerFinderFee"],
    aggregatorName: "Sum",
  });

  const chartData = useMemo(() => {
    const rowKeys = pivotState.rows;
    const colKeys = pivotState.cols;
    const aggregatedData = {};

    sampleOrders.forEach((order) => {
      const rowKey = order[rowKeys[0]];
      const colKey = order[colKeys[0]];

      if (!aggregatedData[rowKey]) {
        aggregatedData[rowKey] = { orderValue: 0, buyerFinderFee: 0 };
      }

      if (colKey) {
        aggregatedData[rowKey].orderValue += order.orderValue;
        aggregatedData[rowKey].buyerFinderFee += order.buyerFinderFee;
      }
    });

    return {
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          label: "Order Value",
          data: Object.values(aggregatedData).map((data) => data.orderValue),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Buyer Finder Fee",
          data: Object.values(aggregatedData).map(
            (data) => data.buyerFinderFee
          ),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    };
  }, [pivotState]);

  return (
    <>
      <Hello />
      <div className="pivot-table-container">
        <h1 className="pivot-table-header">Retail Order Insights</h1>
        <PivotTableUI
          data={sampleOrders}
          onChange={setPivotState}
          {...pivotState}
          className="pivot-table"
          unusedOrientationCutoff={0}
        />
      </div>
    </>
  );
};

export default PivotTable;
