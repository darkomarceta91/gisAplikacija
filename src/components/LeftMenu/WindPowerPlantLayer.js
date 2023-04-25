import { GoPlus } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import { useSelector, useDispatch } from "react-redux";
import {
  setWindPanelVisible,
  setWindPanelDrawingMode,
  setWindPanelEditMode,
  entityChoice,
  zoneChoice,
  cantonChoice,
} from "../../redux-store/panelSlice";

const WindPowerPlantLayer = () => {
  const dispatch = useDispatch();  
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isWindPanelVisible = useSelector(
    (state) => state.panels.windPanel.isVisible
  );
  const windPanelDrawingMode = useSelector(
    (state) => state.panels.windPanel.isDrawingMode
  );
  const windPanelEditMode = useSelector(
    (state) => state.panels.windPanel.isEditMode
  );

  const handleVisible = () => {
    dispatch(setWindPanelVisible());    
    dispatch(entityChoice());
    dispatch(zoneChoice());
    dispatch(cantonChoice());
  };

  const modalHandler = () => {
    isWindPanelVisible && dispatch(setWindPanelDrawingMode());
  };

  const handlePencilIconClick = () => {
    isWindPanelVisible && dispatch(setWindPanelEditMode());
  };

  const plusIcon = <GoPlus />;
  const pencilIcon = <HiOutlinePencil />;
  return (
    <>
      <div className="collapsed-container">
        <div className={`bar-container bar-container-individual wind ${
              isWindPanelVisible ? "active" : ""
            }`}>
          <button
            className={`logo-container logo-container-individual wind ${
              isWindPanelVisible ? "active" : ""
            }`}
            onClick={handleVisible}
          >
            <div className="module-eye-icon">
              <FiEye />
            </div>
          </button>
          <div className="text-container container-individual">
            <h2>Wind Power Plants</h2>
            <p>Model</p>
          </div>
          {isLoggedIn && (
            <Buttons
              type={plusIcon}
              onClick={modalHandler}
              active={windPanelDrawingMode}
            />
          )}
          {isLoggedIn && (
            <Buttons
              type={pencilIcon}
              onClick={handlePencilIconClick}
              active={windPanelEditMode}
            />
          )}
        </div>        
      </div>
    </>
  );
};

export default WindPowerPlantLayer;
