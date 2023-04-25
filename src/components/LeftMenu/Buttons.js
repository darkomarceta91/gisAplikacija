const Buttons = ({type, isCollapsed, onClick, active}) => {
    return (
      <button className={`collapse-button ${isCollapsed? `collapse-button-active` : ""}} ${active? "collapse-button-placing" : ""}`} onClick={onClick}>
        {type}
      </button>
    );
  };
  
  export default Buttons;
  