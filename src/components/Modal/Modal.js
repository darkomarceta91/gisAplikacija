import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import SolarPanelForm from "../ModuleForms/SolarPanelForm";
import WindPowerPlant from "../ModuleForms/WindPowerPlant";
import TemporaryLayerForm from "../ModuleForms/TemporaryLayerForm";

const Modal = ({ onClose, type }) => {
  const components = {
    "Solar Panel": SolarPanelForm,
    "Wind Panel": WindPowerPlant,
    "Temporary Layer": TemporaryLayerForm,
  };

  const Component = components[type];

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modalContainer">{Component && <Component />}</div>
    </>,
    document.getElementById("portal")
  );
};

export default Modal;
