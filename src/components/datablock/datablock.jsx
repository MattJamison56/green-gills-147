/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { FaThermometerHalf, FaFlask, FaTint } from "react-icons/fa";
import { useEffect, useState } from "react";

// Need to eventually pass thresholds into here so the GREEN=OK and RED=BAD not just up and down
const DataBlock = ({ name, data }) => {
  const [stat, setStat] = useState(0);
  const [change, setChange] = useState(0);

  const dataFields = {
    Temp: 'temp_fahrenheit',
    Ph: 'ph_value',
    Tds: 'tds_value'
  };

  const getDataField = (name) => {
    return dataFields[name];
  };

  // Get the change from the previous data entry
  const calculateStatAndChange = (data, field) => {
    if (!data || data.length < 2) return { stat: 0, change: 0 };
    const stat = data[data.length - 1][field];
    const prevStat = data[data.length - 2][field];
    if (stat === undefined || prevStat === undefined) return { stat: 0, change: 0 };
    const change = stat - prevStat;
    return { stat, change };
  };

  // Always checking for changes in the specific stat and change since last entry
  useEffect(() => {
    const field = getDataField(name);
    const { stat, change } = calculateStatAndChange(data, field);
    setStat(stat);
    setChange(change);
  }, [data, name]);
  

  // Color of datablock depending if change is up or down
  const isPositive = change >= 0;
  const changeColor = isPositive ? "green" : "red";
  const changeBGColor = isPositive ? "#f0fff0" : "#fff5f5";
  const changeBorder = isPositive ? "2px solid #d5f5d5" : "2px solid #fc8383";
  const changeIconColor = isPositive ? "#28a745" : "#fc8181";

  // changes icon based on data type
  const getIcon = () => {
    switch (name) {
      case "Temp":
        return <FaThermometerHalf style={{ fontSize: "30px", color: changeIconColor }} />;
      case "Ph":
        return <FaFlask style={{ fontSize: "30px", color: changeIconColor }} />;
      case "Tds":
        return <FaTint style={{ fontSize: "30px", color: changeIconColor }} />;
      default:
        return null;
    }
  };

  const formatStat = () => {
    switch (name) {
      case "Temp":
        return `${stat.toFixed(2)}° F`;
      case "Ph":
      case "Tds":
        return `${stat.toFixed(2)}`;
      default:
        return `${stat.toFixed(2)}`;
    }
  };

  const formatChange = () => {
    switch (name) {
      case "Temp":
        return `${Math.abs(change).toFixed(2)}° F`;
      case "Ph":
      case "Tds":
        return `${Math.abs(change).toFixed(2)}`;
      default:
        return `${Math.abs(change).toFixed(2)}`;
    }
  };
  

  return (
    <div style={{ backgroundColor: changeBGColor, border: changeBorder, borderRadius: "10px", padding: "20px", width: "260px", height: "140px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#555" }}>
        <span>{name}</span>
        {getIcon()}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333", margin: "10px 0" }}>
        {formatStat()}
      </div>
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center", color: changeColor }}>
        <span style={{ fontSize: "18px", marginRight: "5px" }}>{isPositive ? "▲" : "▼"}</span>
        {formatChange()}
      </div>
    </div>
  );
};

export default DataBlock;
