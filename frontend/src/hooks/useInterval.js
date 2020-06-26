import { useState, useEffect } from "react";

export default (handler, interval, active) => {
  const [intervalId, setIntervalId] = useState();
  useEffect(() => {
    let id = setInterval(handler, interval);
    if (active) {
      setIntervalId(id);
    } else {
      clearInterval(id)
    }

    return () => clearInterval(id);
  }, [active]);
  return () => clearInterval(intervalId);
};
