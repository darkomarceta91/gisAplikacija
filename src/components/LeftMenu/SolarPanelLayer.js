import { GoPlus } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import { useSelector, useDispatch } from "react-redux";
import {
  setSolarPanelVisible,
  entityChoice,
  zoneChoice,
  cantonChoice,
} from "../../redux-store/panelSlice";
import {
  setSolarPanelDrawingMode,
  setSolarPanelEditMode,
} from "../../redux-store/panelSlice";

const SolarPanelLayer = () => {
  const dispatch = useDispatch();
  const isSolarPanelVisible = useSelector(
    (state) => state.panels.solarPanel.isVisible
  );
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const solarPanelDrawingMode = useSelector(
    (state) => state.panels.solarPanel.isDrawingMode
  );
  const solarPanelEditMode = useSelector(
    (state) => state.panels.solarPanel.isEditMode
  );

  const handleVisible = () => {
    dispatch(setSolarPanelVisible());
    dispatch(entityChoice());
    dispatch(zoneChoice());
    dispatch(cantonChoice());
  };

  const modalHandler = () => {
    isSolarPanelVisible && dispatch(setSolarPanelDrawingMode());
  };

  const plusIcon = <GoPlus />;
  const pencilIcon = <HiOutlinePencil />;

  const handleEdit = () => {
    isSolarPanelVisible && dispatch(setSolarPanelEditMode());
  };
  return (
    <>
      <div className="collapsed-container">
        <div
          className={`bar-container bar-container-individual solar ${
            isSolarPanelVisible ? "active" : ""
          }`}
        >
          <button
            className={`logo-container logo-container-individual solar ${
              isSolarPanelVisible ? "active" : ""
            }`}
            onClick={handleVisible}
          >
            <div className="module-eye-icon">
              <FiEye />
            </div>
          </button>
          <div className="text-container container-individual">
            <h2>Solar Panel</h2>
            <p>Model</p>
          </div>
          {isLoggedIn && (
            <Buttons
              type={plusIcon}
              onClick={modalHandler}
              active={solarPanelDrawingMode}
            />
          )}
          {isLoggedIn && (
            <Buttons
              type={pencilIcon}
              onClick={handleEdit}
              active={solarPanelEditMode}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SolarPanelLayer;
