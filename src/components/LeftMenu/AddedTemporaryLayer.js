import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { GoDash } from "react-icons/go";
import {
  removeTemporaryLayer,
  hideRemovedTemporaryLayer,
} from "../../redux-store/externalGeoJSONSlice";

const AddedTemporaryLayer = ({ id, number }) => {
  const dispatch = useDispatch();

  const [isVisible, setIsVisible] = useState(true);

  const handleVisible = () => {
    setIsVisible(!isVisible);
    dispatch(hideRemovedTemporaryLayer(id));
  };
  const handleRemove = () => {
    dispatch(removeTemporaryLayer(id));
    dispatch(hideRemovedTemporaryLayer(id));
  };

  const dashIcon = <GoDash />;

  return (
    <>
      <div className="collapsed-container">
        <div className="bar-container bar-container-individual">
          <button
            className={`logo-container logo-container-individual ${
              isVisible ? "active" : ""
            }`}
            onClick={handleVisible}
          >
            <div className="module-eye-icon">
              <FiEye />
            </div>
          </button>
          <div className="text-container container-individual">
            <h2>{`Layer #${number}`}</h2>
          </div>
          <Buttons type={dashIcon} onClick={handleRemove} />
        </div>
      </div>
    </>
  );
};

export default AddedTemporaryLayer;
