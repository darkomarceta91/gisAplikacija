import { useState } from "react";
import ModuleBar from "./ModuleBar";
import TemporaryLayerBar from "./TemporaryLayerBar";
import { BiLayer, BiSliderAlt } from "react-icons/bi";
import { TbArrowsLeftRight } from "react-icons/tb";
import ImportShapeLayerForm from "../ModuleForms/ImportShapeLayerForm";

const CollapseDiv = () => {
  const [activeButton, setActiveButton] = useState(0);

  const renderActiveContent = () => {
    switch (activeButton) {
      case 0:
        return <ModuleBar layers="panels" />;
      case 1:
        return <TemporaryLayerBar />;
      case 2:
        return <ImportShapeLayerForm />;
      default:
        return null;
    }
  };

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  return (
    <div className="collapse-div">
      <div className="collapse-icons">
        <p>Map</p>
        <div className="buttons">
          <button
            className={
              activeButton === 0 ? "layer-button button-active" : "layer-button"
            }
            onClick={() => handleButtonClick(0)}
          >
            <BiLayer size={20} />
          </button>
          <button
            className={
              activeButton === 1 ? "layer-button button-active" : "layer-button"
            }
            onClick={() => handleButtonClick(1)}
          >
            <TbArrowsLeftRight size={20} />
          </button>
          <button
            className={
              activeButton === 2 ? "layer-button button-active" : "layer-button"
            }
            onClick={() => handleButtonClick(2)}
          >
            <BiSliderAlt size={20} />
          </button>
        </div>
      </div>
      {renderActiveContent()}
    </div>
  );
};

export default CollapseDiv;
