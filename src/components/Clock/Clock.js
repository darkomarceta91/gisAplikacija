import { useState, useEffect } from "react";
import classes from "./Clock.module.css";
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div>
      <h3 className={classes.clockTime}>{time.toLocaleTimeString()}</h3>
      <h5>{time.toLocaleDateString()}</h5>
    </div>
  );
};

export default Clock;
