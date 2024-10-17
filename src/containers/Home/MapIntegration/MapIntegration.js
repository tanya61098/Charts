import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india2019High from "@amcharts/amcharts4-geodata/india2019High";
import animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(animated);

const MapIntegration = () => {
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
    polygonTemplate.tooltipText = "{name}: Orders: {count}, Value: {value}";
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

    polygonSeries.mapPolygons.each((polygon) => {
      if (top5States.includes(polygon.dataItem.dataContext.id)) {
        polygon.fill = am4core.color("#000000");
      }
    });

    const legendContainer = chart.createChild(am4core.Container);
    legendContainer.layout = "vertical";
    legendContainer.align = "right";
    legendContainer.valign = "middle";
    legendContainer.marginRight = 15;

    const legendTitle = legendContainer.createChild(am4core.Label);

    legendTitle.fontSize = 10;
    legendTitle.marginTop = 50;

    legendTitle.marginBottom = 10;

    top5States.forEach((stateId) => {
      const stateData = stateOrderData.find((state) => state.id === stateId);
      const legendItem = legendContainer.createChild(am4core.Label);
      legendItem.text = `${stateData.name}: ${stateData.value}`;
      legendItem.fill = am4core.color("#000000");
      legendItem.marginBottom = 5;
    });

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }} />
    </>
  );
};

export default MapIntegration;
