import React, { useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import SolarPanelLayer from "./SolarPanelLayer";
import WindPowerPlantLayer from "./WindPowerPlantLayer";

const ModuleBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="collapsed-container">
      <div className="bar-container bar-container-down">
        <div className="logo-container logo-container-main">
          <button className="module-eye-icon">
            <FiEye color={`${isCollapsed ? "white" : "black"}`} />
          </button>
        </div>
        <div className="text-container">
          <h2>Infrastructure</h2>
          <p>Module</p>
        </div>
        <Buttons
          type={<IoMdArrowRoundDown />}
          isCollapsed={isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className={`expand-container ${isCollapsed ? "show" : "hide"}`}>
        <SolarPanelLayer />
        <WindPowerPlantLayer />
      </div>
    </div>
  );
};

export default ModuleBar;
