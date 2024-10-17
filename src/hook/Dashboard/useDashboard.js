import { useState, useEffect } from "react";
import { sampleOrders } from "../../components/Hello/sampleOrders";

const useDashboard = () => {
  const [data, setData] = useState(sampleOrders);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [viewBy, setViewBy] = useState("value");
  const [selectedCategory, setSelectedCategory] = useState("status");
  const [categoryData, setCategoryData] = useState({});
  const [timeSeriesData, setTimeSeriesData] = useState({});
  const [chartType, setChartType] = useState("pie");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDates, setCustomDates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stackedChartData, setStackedChartData] = useState(data);
  const [topCategoryCount, setTopCategoryCount] = useState(5);

  useEffect(() => {
    const today = new Date();
    let startDate = new Date(0);

    switch (dateFilter) {
      case "last 5-years":
        startDate = new Date(
          today.getFullYear() - 5,
          today.getMonth(),
          today.getDate()
        );
        break;
      case "last 3-years":
        startDate = new Date(
          today.getFullYear() - 3,
          today.getMonth(),
          today.getDate()
        );
        break;
      case "last 1-year":
        startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        break;
      case "last 6-months":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          today.getDate()
        );
        break;
      case "last 3-months":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        );
        break;
      case "today":
        startDate = today;
        break;

      default:
        return;
    }

    const filtered = data.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const matchesDate = orderDate >= startDate && orderDate <= today;
      const matchesState = selectedState ? order.state === selectedState : true;
      return matchesDate && matchesState;
    });

    setFilteredData(filtered);
  }, [data, dateFilter, selectedState, selectedDates]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    if (value !== "custom") {
      setCustomDates([]);
    }
  };

  const handleDateChange = (dates) => {
    setCustomDates(dates);
  };

  const getDisplayValue = () => {
    if (dateFilter === "custom" && customDates.length === 2) {
      return `${customDates[0].format("YYYY-MM-DD")} - ${customDates[1].format(
        "YYYY-MM-DD"
      )}`;
    }
    return dateFilter;
  };

  useEffect(() => {
    const aggregateCategoryData = filteredData.reduce((acc, order) => {
      const key = order[selectedCategory];
      if (!acc[key]) {
        acc[key] = { orderValue: 0, orderCount: 0 };
      }
      acc[key].orderValue += order.orderValue;
      acc[key].orderCount += 1;
      return acc;
    }, {});

    const top5Categories = Object.entries(aggregateCategoryData)
      .sort(([, a], [, b]) =>
        viewBy === "value"
          ? b.orderValue - a.orderValue
          : b.orderCount - a.orderCount
      )
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    setCategoryData(top5Categories);
  }, [filteredData, selectedCategory, viewBy]);

  useEffect(() => {
    const aggregateTimeSeries = filteredData.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      if (!acc[orderDate]) {
        acc[orderDate] = { orderValue: 0, orderCount: 0 };
      }
      acc[orderDate].orderValue += order.orderValue;
      acc[orderDate].orderCount += 1;
      return acc;
    }, {});
    setTimeSeriesData(aggregateTimeSeries);
  }, [filteredData]);

  const handleStateClick = (stateId) => {
    setSelectedState(stateId);
  };

  const handleResetStateFilter = () => {
    setSelectedState(null);
  };

  const chartData = {
    series: Object.values(categoryData).map((item) =>
      viewBy === "value" ? item.orderValue : item.orderCount
    ),
    labels: Object.keys(categoryData),
  };

  const timeSeriesChartData = {
    series: [
      {
        name: viewBy === "value" ? "Order Value" : "Order Count",
        data: Object.keys(timeSeriesData).map((date) =>
          viewBy === "value"
            ? timeSeriesData[date].orderValue
            : timeSeriesData[date].orderCount
        ),
      },
    ],
    categories: Object.keys(timeSeriesData),
  };

  useEffect(() => {
    const aggregateStackedData = filteredData.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const filterKey = order[selectedCategory]; // Grouping by status, state, city, or NP

      if (!acc[date]) {
        acc[date] = {};
      }

      if (!acc[date][filterKey]) {
        acc[date][filterKey] = { orderValue: 0, orderCount: 0 };
      }

      acc[date][filterKey].orderValue += order.orderValue;
      acc[date][filterKey].orderCount += 1;

      return acc;
    }, {});

    // Get all unique filter keys (e.g., all statuses, states, cities, etc.)
    const uniqueCategories = Array.from(
      new Set(
        Object.values(aggregateStackedData).flatMap((group) =>
          Object.keys(group)
        )
      )
    );

    const seriesData = uniqueCategories.map((filterKey) => ({
      name: filterKey,
      data: Object.keys(aggregateStackedData).map((date) => {
        // Check if the category exists for the given date
        return aggregateStackedData[date][filterKey]
          ? viewBy === "value"
            ? aggregateStackedData[date][filterKey].orderValue
            : aggregateStackedData[date][filterKey].orderCount
          : 0;
      }),
    }));

    setStackedChartData(seriesData);
  }, [filteredData, selectedCategory, viewBy]);

  const handleTopCategoryChange = (value) => {
    setTopCategoryCount(Number(value));
  };

  return {
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
  };
};

export default useDashboard;
