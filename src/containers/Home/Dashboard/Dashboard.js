import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { DatePicker, Select } from "antd";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india2019High from "@amcharts/amcharts4-geodata/india2019High";
import animated from "@amcharts/amcharts4/themes/animated";

import "./Dashboard.css";
import useDashboard from "../../../hook/Dashboard/useDashboard";
import Hello from "../../../components/Hello/Hello";

am4core.useTheme(animated);
const { Option } = Select;

const Dashboard = () => {
  const {
    viewBy,
    setViewBy,
    categoryData,
    selectedCategory,
    setSelectedCategory,
    chartType,
    setChartType,
    handleDateChange,
    handleStateClick,
    chartData,
    timeSeriesChartData,
    handleDateFilterChange,
    handleResetStateFilter,
    stackedChartData,
    timeSeriesData,
    getDisplayValue,
    dateFilter,
    handleTopCategoryChange,
    topCategoryCount,
  } = useDashboard();

  useEffect(() => {
    const chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.geodata = am4geodata_india2019High;

    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    const stateOrderData = [
      { id: "IN-JK", name: "Jammu and Kashmir", value: 10000, count: 10 },
      { id: "IN-MH", name: "Maharashtra", value: 12000, count: 12 },
      { id: "IN-UP", name: "Uttar Pradesh", value: 8000, count: 8 },
      { id: "IN-RJ", name: "Rajasthan", value: 15000, count: 15 },
      { id: "IN-AP", name: "Andhra Pradesh", value: 9000, count: 9 },
      { id: "IN-MP", name: "Madhya Pradesh", value: 20000, count: 20 },
      { id: "IN-TN", name: "Tamil Nadu", value: 18000, count: 18 },
      { id: "IN-JH", name: "Jharkhand", value: 5000, count: 5 },
      { id: "IN-WB", name: "West Bengal", value: 3000, count: 3 },
      { id: "IN-GJ", name: "Gujarat", value: 7000, count: 7 },
      { id: "IN-BR", name: "Bihar", value: 4000, count: 4 },
      { id: "IN-TG", name: "Telangana", value: 10000, count: 10 },
      { id: "IN-KA", name: "Karnataka", value: 17000, count: 17 },
      { id: "IN-HP", name: "Himachal Pradesh", value: 1500, count: 1 },
      { id: "IN-PB", name: "Punjab", value: 6000, count: 6 },
    ];

    polygonSeries.data = stateOrderData;

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#ff7d01");

    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonTemplate,
      min: am4core.color("#f3f3f3"),
      max: am4core.color("#007BFF"),
      dataField: "value",
    });

    const top5States = stateOrderData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item) => item.id);

    polygonSeries.events.on("validated", () => {
      const legendContainer = chart.createChild(am4core.Container);
      legendContainer.layout = "vertical";
      legendContainer.align = "right";
      legendContainer.valign = "middle";
      legendContainer.marginRight = 15;
      legendContainer.paddingTop = 150;

      top5States.forEach((stateId) => {
        const stateData = stateOrderData.find((state) => state.id === stateId);

        const legendItemContainer = legendContainer.createChild(
          am4core.Container
        );
        legendItemContainer.layout = "horizontal";
        legendItemContainer.marginRight = 10;
        legendItemContainer.padding(0, 0, 0, 0);

        const polygon = polygonSeries.mapPolygons.values.find(
          (p) => p.dataItem.dataContext.id === stateId
        );

        const bulletColor = polygon.fill;

        const bullet = legendItemContainer.createChild(am4core.Circle);
        bullet.radius = 6;
        bullet.fill = bulletColor;
        bullet.marginRight = 5;

        const label = legendItemContainer.createChild(am4core.Label);
        label.text =
          viewBy === "value"
            ? `${stateData.name}: ${stateData.value}`
            : `${stateData.name}: ${stateData.count}`;
        label.fontSize = 12;
      });
    });

    polygonTemplate.events.on("hit", (ev) => {
      const stateData = ev.target.dataItem.dataContext;
      handleStateClick(stateData.id);
    });

    return () => {
      chart.dispose();
    };
  }, [handleStateClick]);

  const renderTable = () => {
    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>{selectedCategory}</th>
            <th>{viewBy === "value" ? "Order Value" : "Order Count"}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(categoryData).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {viewBy === "value"
                  ? categoryData[key].orderValue
                  : categoryData[key].orderCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Hello />
      <div
        className="row d-flex align-items-center"
        style={{ padding: "10px 40px", borderBottom: "1px solid #ddd" }}
      >
        <div className="col d-flex">
          <button className="OrdersButton">Orders</button>
          <button className="IgmButton">Igm</button>
        </div>

        <div className="col d-flex justify-content-end">
          <div
            style={{ marginRight: "30px", fontSize: "16px", fontWeight: "500" }}
          >
            Lifetime Sales:
          </div>
          <span
            style={{
              marginRight: "20px",
              fontWeight: "bold",
              color: "#007BFF",
            }}
          >
            Order Value = 20,000
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: "#FF5733",
            }}
          >
            Order Count = 10
          </span>
        </div>
      </div>

      <div
        className="row d-flex align-items-center"
        style={{ padding: "10px 40px", borderBottom: "1px solid #ddd" }}
      >
        <div className="col d-flex">
          <button
            onClick={() => setViewBy(viewBy === "value" ? "count" : "value")}
            style={{
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f1f1f1",
              borderRadius: "20px",
              width: "250px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span
              style={{
                color: viewBy === "value" ? "#007BFF" : "#CCC",
                fontWeight: viewBy === "value" ? "bold" : "normal",
              }}
            >
              Order Value
            </span>
            {viewBy === "value" ? (
              <FiToggleLeft size={30} style={{ color: "#007BFF" }} />
            ) : (
              <FiToggleRight size={30} style={{ color: "#FF5733" }} />
            )}

            <span
              style={{
                color: viewBy === "count" ? "#FF5733" : "#CCC",
                fontWeight: viewBy === "count" ? "bold" : "normal",
              }}
            >
              Order Count
            </span>
          </button>
        </div>

        <div className="col d-flex justify-content-end">
          {dateFilter === "custom" && (
            <DatePicker.RangePicker
              onChange={handleDateChange}
              style={{ marginRight: 16 }}
            />
          )}

          <Select
            value={getDisplayValue()}
            style={{ width: 200, marginRight: 16 }}
            onChange={handleDateFilterChange}
          >
            <Option value="all">All</Option>
            <Option value="last 5-years">Last 5 Years</Option>
            <Option value="last 3-years">Last 3 Years</Option>
            <Option value="last 1-year">Last Year</Option>
            <Option value="last 6-months">Last 6 Months</Option>
            <Option value="last 3-months">Last 3 Months</Option>
            <Option value="today">Today</Option>
            <Option value="custom">Custom</Option>
          </Select>
        </div>
      </div>

      <div className="row tableontent ml-4 mt-4">
        <div className="col-4 totalSales">
          <h6>Total Sales</h6>
          <span>Rs 20,00,000</span>
          <h6>Average Order</h6>
          <span>Rs 19,567</span>
        </div>
        <div className="col-8 rightTable">
          <div className="row d-flex align-items-center">
            <div className="col d-flex">
              <button>Bestsellers</button>
              <button>Vacant</button>
            </div>
            <div className="col d-flex justify-content-end">
              <Select
                defaultValue="Category"
                style={{ width: 150, marginBottom: "20px" }}
              >
                <Option value="pie">Category 1</Option>
                <Option value="pie">Category 2</Option>
                <Option value="pie">Category 3</Option>
              </Select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {/* {orderData.fulfillmentDetails.map((fulfillment, index) => ( */}
                {/* <tr key={index}> */}
                <tr>
                  <td>Product 1</td>
                  <td>Rs 2000</td>
                  <td>Rs 19,08,766</td>
                </tr>
                <tr>
                  <td>Product 2</td>
                  <td>Rs 2000</td>
                  <td>Rs 19,08,766</td>
                </tr>
                <tr>
                  <td>Product 3</td>
                  <td>Rs 2000</td>
                  <td>Rs 19,08,766</td>
                </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="chart">
          <h3>
            {viewBy === "value" ? "Order Value" : "Order Count"} vs Time Series
          </h3>
          <Chart
            options={{
              xaxis: { categories: timeSeriesChartData.categories },
              yaxis: {
                title: {
                  text:
                    viewBy === "value"
                      ? "Total Order Value ($)"
                      : "Total Order Count",
                },
              },
              stroke: { curve: "smooth" },
              toolbar: { show: false },
            }}
            series={timeSeriesChartData.series}
            type="line"
          />
        </div>

        <div className="chart">
          <div id="chartdiv" style={{ width: "100%", height: "500px" }} />
        </div>

        <div className="row">
          <div className="col-6">
            <button
              onClick={() => setSelectedCategory("status")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor:
                  selectedCategory === "status" ? "#007BFF" : "#CCC",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Status
            </button>
            <button
              onClick={() => setSelectedCategory("state")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor:
                  selectedCategory === "state" ? "#007BFF" : "#CCC",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              State
            </button>
            <button
              onClick={() => setSelectedCategory("city")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor:
                  selectedCategory === "city" ? "#007BFF" : "#CCC",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              City
            </button>
            <button
              onClick={() => setSelectedCategory("np")}
              style={{
                padding: "10px",
                marginRight: "10px",
                backgroundColor: selectedCategory === "np" ? "#007BFF" : "#CCC",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              NP
            </button>
          </div>

          <div className="col-6 d-flex justify-content-between">
            <Select
              defaultValue="pie"
              style={{ width: 150, marginBottom: "20px" }}
              onChange={(value) => setChartType(value)}
            >
              <Option value="pie">Pie Chart</Option>
              <Option value="bar">Bar Chart</Option>
              <Option value="table">Table</Option>
              <Option value="stacked">Stacked</Option>
            </Select>

            <Select
              defaultValue="5" // Default to top 5
              style={{ width: 150, marginBottom: "20px" }}
              onChange={(value) => handleTopCategoryChange(value)}
            >
              <Option value="2">Top 2</Option>
              <Option value="5">Top 5</Option>
              <Option value="10">Top 10</Option>
            </Select>
          </div>

          {chartType === "pie" && (
            <Chart
              options={{
                labels: chartData.labels.slice(0, topCategoryCount), // Show top categories
                title: {
                  text: `${
                    viewBy === "value" ? "Order Value" : "Order Count"
                  } by ${selectedCategory}`,
                  align: "center",
                },
              }}
              series={chartData.series.slice(0, topCategoryCount)} // Show top categories
              type="pie"
              height={350}
            />
          )}

          {chartType === "bar" && (
            <Chart
              options={{
                xaxis: {
                  categories: chartData.labels.slice(0, topCategoryCount),
                }, // Show top categories
                title: {
                  text: `${
                    viewBy === "value" ? "Order Value" : "Order Count"
                  } by ${selectedCategory}`,
                  align: "center",
                },
              }}
              series={[
                {
                  name: viewBy === "value" ? "Order Value" : "Order Count",
                  data: chartData.series.slice(0, topCategoryCount), // Show top categories
                },
              ]}
              type="bar"
              height={350}
            />
          )}

          {chartType === "table" && renderTable()}

          {chartType === "stacked" && (
            <Chart
              options={{
                chart: {
                  type: "bar",
                  stacked: true,
                },
                xaxis: {
                  categories: Object.keys(timeSeriesData).slice(
                    0,
                    topCategoryCount
                  ), // Show top categories
                },
                yaxis: {
                  title: {
                    text: viewBy === "value" ? "Order Value" : "Order Count",
                  },
                },
                title: {
                  text: `${
                    viewBy === "value" ? "Order Value" : "Order Count"
                  } by ${selectedCategory}`,
                  align: "center",
                },
              }}
              series={stackedChartData.slice(0, topCategoryCount)} // Show top categories
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
