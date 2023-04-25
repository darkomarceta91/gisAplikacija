import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
const _ = require("lodash");

const Toast = () => {
  const temporaryLayerData = useSelector(
    (state) => state.geoJSON.temporaryLayer.geojson
  );
  const solarPanelData = useSelector((state) => state.panels.solarPanel.data);
  const windPanelData = useSelector((state) => state.panels.windPanel.data);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [hasMounted, setHasMounted] = useState(false);

  const previoustemporaryLayerData = useRef(temporaryLayerData);
  const previoussolarPanelData = useRef(solarPanelData);
  const previouswindPanelData = useRef(windPanelData);

  useEffect(() => {
    if (previoustemporaryLayerData.current.length < temporaryLayerData.length) {
      toast.success("Temporary Layer added!");
    }
    previoustemporaryLayerData.current = temporaryLayerData;
  }, [temporaryLayerData]);

  useEffect(() => {
    if (
      previoussolarPanelData?.current?.length < solarPanelData.features?.length
    ) {
      toast.success("Solar Panel Layer added!");
    }
    if (
      previouswindPanelData?.current?.length < windPanelData.features?.length
    ) {
      toast.success("Wind Panel Layer added!");
    }
    if (
      previoussolarPanelData?.current?.length > solarPanelData.features?.length
    ) {
      toast.success("Solar Panel Successfuly Removed!");
    }
    if (
      previouswindPanelData?.current?.length > windPanelData.features?.length
    ) {
      toast.success("Wind Panel Successfuly Removed!");
    }
    if (
      previoussolarPanelData?.current?.length ===
      solarPanelData.features?.length
    ) {
      if (!_.isEqual(previoussolarPanelData?.current, solarPanelData.features))
        toast.success("Solar Panel Updated!");
    }
    if (
      previouswindPanelData?.current?.length === windPanelData.features?.length
    ) {
      if (!_.isEqual(previouswindPanelData?.current, windPanelData.features))
        toast.success("Wind Panel Updated!");
    }

    previoussolarPanelData.current = solarPanelData?.features;
    previouswindPanelData.current = windPanelData?.features;
  }, [solarPanelData, windPanelData]);

  useEffect(() => {
    if (hasMounted) {
      if (isLoggedIn) {
        toast.success(`You are Logged In!`);
      } else {
        toast.success("You are Logged out!");
      }
    } else {
      setHasMounted(true);
    }
  }, [isLoggedIn,]);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};

export default Toast;
