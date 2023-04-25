import React, { useState } from "react";
import CollapseDiv from "./CollapseDiv";
import { IoMdArrowRoundDown } from "react-icons/io";
import { MdGroups2 } from "react-icons/md";
import Buttons from "./Buttons";
import "./LeftMenu.css";

function LeftMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const arrowIcon = <IoMdArrowRoundDown />;
  return (
    <div className="left-menu">
      <div className="bar-container bar-container-top">
        <div className="top-logo-container">
          <MdGroups2 size={30} color='#414141'/>
        </div>
        <p className="divider">|</p>
        <div className="text-container">
          <h6 className="main-title">Group #2</h6>
        </div>
        <Buttons
          type={arrowIcon}
          isCollapsed={isCollapsed}
          onClick={handleCollapse}
        />
      </div>
      <div className={`expand-container ${isCollapsed ? "show" : "hide"}`}>
        <CollapseDiv />
      </div>
    </div>
  );
}

export default LeftMenu;
