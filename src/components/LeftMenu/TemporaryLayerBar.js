import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { setIsModalOpen } from "../../redux-store/userSlice";
import AddedTemporaryLayer from "./AddedTemporaryLayer";
import { useEffect } from "react";
import { setIsTemporaryVisible } from "../../redux-store/externalGeoJSONSlice";
import { useState } from "react";
import { turnOffDrawingEditModes } from "../../redux-store/panelSlice";


const TemporaryLayerBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const temporaryLayers = useSelector(
    (state) => state.geoJSON.temporaryLayer.geojson
  );

  const addButtonHandler = () => {
    dispatch(turnOffDrawingEditModes());
    setIsVisible(true);
    dispatch(setIsTemporaryVisible(true));
    dispatch(setIsModalOpen());
  };

  useEffect(() => {
    temporaryLayers.length === 0 && setIsVisible(false);
  }, [temporaryLayers]);
  return (
    <div className="collapsed-container">
     
      <div className="bar-container bar-container-down">
        <div className="logo-container logo-container-main">
          <button className="module-eye-icon">
            <FiEye color={`${isVisible ? "white" : "black"}`} />
          </button>
        </div>
        <div className="text-container">
          <h2>Temporary Layers</h2>
        </div>

        <Buttons type={<GoPlus />} onClick={addButtonHandler} />
      </div>
      <div className="expand-container show">
        {temporaryLayers.map((layer, i) => {
          const id = layer.id;
          return <AddedTemporaryLayer key={i} id={id} number={i + 1} />;
        })}
      </div>
    </div>
  );
};

export default TemporaryLayerBar;
