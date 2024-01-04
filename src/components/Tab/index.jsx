import React from "react";
import "./index.css";

const Tab = ({ setActiveTab, isActivity }) => {
  return (
    <div className="tab">
      <h1
        className={isActivity ? "tab-btn active-tab-btn" : "tab-btn"}
        onClick={() => {
          setActiveTab("Activity");
        }}
      >
        Activity Feed
      </h1>
      <h1
        className={!isActivity ? "tab-btn active-tab-btn" : "tab-btn"}
        onClick={() => {
          setActiveTab("Archive");
        }}
      >
        Archived Calls
      </h1>
    </div>
  );
};

export default Tab;
