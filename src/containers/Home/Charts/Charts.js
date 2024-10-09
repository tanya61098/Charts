import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DatePicker, Select, Table } from "antd";
import { sampleOrders } from "../../../components/Hello/sampleOrders";
import "./Charts.css";
import Hello from "../../../components/Hello/Hello";

const { Option } = Select;

const Charts = () => {
  const [data, setData] = useState(sampleOrders);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalOrderValue, setTotalOrderValue] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterType, setFilterType] = useState("city");
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const filtered = data
      .filter((order) => {
        if (!selectedDates[0] || !selectedDates[1]) return true;
        const orderDate = new Date(order.createdAt);
        return orderDate >= selectedDates[0] && orderDate <= selectedDates[1];
      })
      .filter((order) => {
        if (selectedStatus && order.status !== selectedStatus) return false;
        if (selectedCity && order.city !== selectedCity) return false;
        return true;
      });

    setFilteredData(filtered);
    setTotalOrders(filtered.length);
    setTotalOrderValue(
      filtered.reduce((sum, order) => sum + order.orderValue, 0)
    );
  }, [data, selectedDates, selectedStatus, selectedCity]);

  const handleOrderClick = (type) => {
    const filteredOrders = data.filter(
      (order) =>
        (type === "total" && order.status !== "Cancelled") ||
        (type === "cancelled" && order.status === "Cancelled")
    );
    setSelectedOrders(filteredOrders);
    setShowDetails(true);
  };

  const handleDateChange = (dates) => setSelectedDates(dates);
  const handleStatusChange = (value) => setSelectedStatus(value);
  const handleCityChange = (value) => setSelectedCity(value);

  const aggregateData = (field) => {
    return filteredData.reduce((acc, order) => {
      acc[order[field]] = (acc[order[field]] || 0) + order.orderValue;
      return acc;
    }, {});
  };

  const topData =
    filterType === "city" ? aggregateData("city") : aggregateData("state");
  const sortedData = Object.entries(topData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const barChartData = {
    series: [{ name: "Order Value", data: sortedData.map(([, v]) => v) }],
    categories: sortedData.map(([k]) => k),
  };

  const orderStatusData = {
    series: [
      filteredData.filter((order) => order.status === "Completed").length,
      filteredData.filter((order) => order.status === "Cancelled").length,
      filteredData.filter((order) => order.status === "In-Progress").length,
      filteredData.filter((order) => order.status === "Accepted").length,
    ],
    labels: ["Completed", "Cancelled", "In-Progress", "Accepted"],
  };

  const pieChartOptions = {
    labels: orderStatusData.labels,
    dataLabels: {
      enabled: true,
      formatter: (val, { seriesIndex }) => {
        return orderStatusData.series[seriesIndex]; // Show the number of orders
      },
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          return `${orderStatusData.series[seriesIndex]} Orders`; // Show the number of orders in tooltip
        },
      },
    },
  };
  useEffect(() => {
    const trends = {};
    data.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      if (!trends[date]) {
        trends[date] = {
          totalValue: 0,
          totalPending: 0,
          avgOrderValue: 0,
          count: 0,
        };
      }
      trends[date].totalValue += order.orderValue;
      trends[date].totalPending += order.pendingAmount;
      trends[date].avgOrderValue += order.orderValue; // Accumulate for average
      trends[date].count += 1;
    });

    const categories = Object.keys(trends);
    const totalValues = categories.map((date) => trends[date].totalValue);
    const totalPendings = categories.map((date) => trends[date].totalPending);
    const avgOrderValues = categories.map(
      (date) => trends[date].avgOrderValue / trends[date].count
    );

    setLineChartData({
      categories,
      series: [
        { name: "Total Order Value", data: totalValues },
        { name: "Total Pending Amount", data: totalPendings },
        { name: "Average Order Value", data: avgOrderValues },
      ],
    });
  }, [data, selectedDates]);

  const lineChartOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { width: [3, 3, 3], curve: "smooth" },
    title: { text: "Order Trends", align: "left" },
    xaxis: { categories: lineChartData.categories || [] },
    tooltip: {
      y: {
        formatter: (val) => `${val} Rs.`,
      },
    },
  };

  const avgFinderFeeByStatus = {};
  filteredData.forEach((order) => {
    if (!avgFinderFeeByStatus[order.status]) {
      avgFinderFeeByStatus[order.status] = { totalFee: 0, count: 0 };
    }
    avgFinderFeeByStatus[order.status].totalFee += order.buyerFinderFee;
    avgFinderFeeByStatus[order.status].count += 1;
  });

  const avgFinderFeeData = {
    series: [
      {
        name: "Avg Finder Fee",
        data: Object.entries(avgFinderFeeByStatus).map(
          ([, { totalFee, count }]) => totalFee / count
        ),
      },
    ],
    categories: Object.keys(avgFinderFeeByStatus),
  };

  const heatmapData = {};
  filteredData.forEach((order) => {
    const city = order.city || "Unknown";
    const status = order.status || "Unknown";
    const key = `${city}-${status}`;

    if (!heatmapData[key]) {
      heatmapData[key] = 0;
    }

    heatmapData[key] += order.orderValue;
  });

  const heatmapCategories = [
    ...new Set(filteredData.map((order) => order.city)),
  ];
  const statuses = [...new Set(filteredData.map((order) => order.status))];

  const heatmapSeries = statuses.map((status) => ({
    name: status,
    data: heatmapCategories.map(
      (city) => heatmapData[`${city}-${status}`] || 0
    ),
  }));

  const stackedSeries = statuses.map((status) => ({
    name: status,
    data: heatmapCategories.map((city) => {
      return filteredData
        .filter((order) => order.city === city && order.status === status)
        .reduce((sum, order) => sum + order.orderValue, 0);
    }),
  }));

  const columns = [
    { title: "NP", dataIndex: "np", key: "np" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Order Value", dataIndex: "orderValue", key: "orderValue" },
    {
      title: "Buyer Finder Fee",
      dataIndex: "buyerFinderFee",
      key: "buyerFinderFee",
    },
  ];

  return (
    <>
      <Hello />
      <div className="dashboard-container">
        <div className="stats">
          <div className="stat">
            <h6>Total Orders: {totalOrders}</h6>
          </div>
          <div className="stat">
            <h6>Total Order Value: Rs. {totalOrderValue}</h6>
          </div>
          <div className="stat">
            <h6>
              Cancelled Orders:{" "}
              {
                filteredData.filter((order) => order.status === "Cancelled")
                  .length
              }
            </h6>
          </div>
        </div>
        {showDetails && (
          <div className="order-details-modal">
            <h3>Order Details</h3>
            <Table
              dataSource={selectedOrders}
              columns={columns}
              pagination={false}
            />
            <button onClick={() => setShowDetails(false)}>Close</button>
          </div>
        )}
        <div className="filters">
          <Select
            defaultValue={null}
            onChange={handleStatusChange}
            style={{ width: 200, marginRight: 16 }}
          >
            <Option value={null}>All Statuses</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="In-Progress">In-Progress</Option>
            <Option value="Accepted">Accepted</Option>
          </Select>

          <DatePicker.RangePicker
            onChange={handleDateChange}
            style={{ marginRight: 16 }}
          />

          <Select
            defaultValue={filterType}
            onChange={handleCityChange}
            style={{ width: 200 }}
          >
            <Option value={null}>All Cities</Option>
            <Option value="Mumbai">Mumbai</Option>
            <Option value="Delhi">Delhi</Option>
            <Option value="Chennai">Chennai</Option>
          </Select>
        </div>

        <div className="chart-container">
          <div className="chart">
            <h3>Order Status Distribution</h3>
            <Chart
              options={pieChartOptions}
              series={orderStatusData.series}
              type="pie"
            />
          </div>
          <div className="chart">
            <h3>
              Top 5 {filterType.charAt(0).toUpperCase() + filterType.slice(1)}s
              by Order Value
            </h3>
            <Select
              defaultValue="city"
              onChange={setFilterType}
              style={{ width: 100, marginBottom: 16 }}
            >
              <Option value="city">City</Option>
              <Option value="state">State</Option>
            </Select>
            <Chart
              options={{
                xaxis: { categories: barChartData.categories },
                toolbar: { show: false },
              }}
              series={barChartData.series}
              type="bar"
            />
          </div>
          <div className="chart">
            <h3>Order Trends</h3>
            <Chart
              options={{ lineChartOptions, toolbar: { show: false } }}
              series={lineChartData.series || []}
              type="line"
              height={350}
            />
          </div>

          <div className="chart">
            <h3>Order Heatmap</h3>
            <Chart
              options={{
                chart: {
                  type: "heatmap",
                },
                colors: ["#f5f5f5", "#ff5722"], // Light color for low values and a bold color for high values
                xaxis: {
                  categories: heatmapCategories,
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    colors: ["#000"], // Text color inside the heatmap
                  },
                },
                tooltip: {
                  y: {
                    formatter: (val) => `${val} Rs.`,
                  },
                },
              }}
              series={heatmapSeries}
              type="heatmap"
              height={350}
            />
          </div>

          <div className="chart">
            <h3>Orders by Category</h3>
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { categories: heatmapCategories },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    endingShape: "rounded",
                  },
                },
                dataLabels: {
                  style: {
                    colors: ["#fff"],
                  },
                },
              }}
              series={stackedSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Charts;
