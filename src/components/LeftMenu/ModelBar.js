import { useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import Buttons from "./Buttons";
import Modal from "../Modal/Modal";

const ModelBar = ({ type }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="collapsed-container">
        <div className="bar-container bar-container-individual">
          <div className="logo-container logo-container-individual">
            <button
              className="module-eye-icon"
              onClick={() => setIsVisible(!isVisible)}
            >
              <FiEye color={`${isVisible ? "white" : "black"}`} />
            </button>
          </div>
          <div className="text-container container-individual">
            <h2>{type}</h2>
            <p>Model</p>
          </div>
          <Buttons type={<GoPlus />} onClick={() => setShowModal(true)} />
          <Buttons type={<HiOutlinePencil />} />
          <Buttons
            type={<IoMdArrowRoundDown />}
            isCollapsed={isCollapsed}
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
        <div className={`expand-container ${isCollapsed ? "show" : "hide"}`}>
          <div className="bar-container bar-container-individual details">
            <p>Details about Model...</p>
          </div>
        </div>
      </div>
      {showModal && <Modal onClose={handleCloseModal} />}
    </>
  );
};

export default ModelBar;
