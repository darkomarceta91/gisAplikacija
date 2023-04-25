import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./Map.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useSelector, useDispatch } from "react-redux";
import { area, length } from "@turf/turf";
import Modal from "../../components/Modal/Modal";
import solarPanelIcon from "../../assets/images/solarpanel.png";
import windPanelIcon from "../../assets/images/windmill.png";
import LeftMenu from "../../components/LeftMenu/LeftMenu";
import {
  setSolarPanelCoords,
  setWindPanelCoords,
  setSolarPanelId,
  setWindPanelId,
  getSolarPanels,
  getWindPanel,
  turnOffPanelVisibility,
} from "../../redux-store/panelSlice";
import { setIsModalOpen } from "../../redux-store/userSlice";
import {
  removeTemporaryLayerIndex,
  setIsTemporaryVisible,
  removeExternalData,
} from "../../redux-store/externalGeoJSONSlice";
import { Puff } from "react-loader-spinner";
import Toast from "../../components/Toast/Toast";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapContainer = () => {
  const dispatch = useDispatch();
  const [isLeftMenuVisible, setIsLeftMenuVisible] = useState(true);
  const solarPanelsData = useSelector((state) => state.panels.solarPanel.data);
  const windPanelsData = useSelector((state) => state.panels.windPanel.data);
  const isTemporaryVisible = useSelector(
    (state) => state.geoJSON.isTemporaryVisible
  );
  const temporaryLayerIndex = useSelector(
    (state) => state.geoJSON.temporaryLayerIndex
  );
  const temporaryLayer = useSelector(
    (state) => state.geoJSON.temporaryLayer.geojson
  );
  const isModalOpen = useSelector((state) => state.user.isModalOpen);
  const isSolarPanelVisible = useSelector(
    (state) => state.panels.solarPanel.isVisible
  );
  const isWindPanelVisible = useSelector(
    (state) => state.panels.windPanel.isVisible
  );
  const solarPanelDrawingMode = useSelector(
    (state) => state.panels.solarPanel.isDrawingMode
  );
  const windPanelDrawingMode = useSelector(
    (state) => state.panels.windPanel.isDrawingMode
  );
  const solarPanelEditMode = useSelector(
    (state) => state.panels.solarPanel.isEditMode
  );
  const windPanelEditMode = useSelector(
    (state) => state.panels.windPanel.isEditMode
  );
  const solarPanelLoading = useSelector(
    (state) => state.panels.solarPanel.isLoading
  );
  const [measurement, setMeasurement] = useState(null);
  const mapContainer = useRef(null);
  const drawControlsRef = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(17.19948023557663);
  const [lat, setLat] = useState(44.77592815172716);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    dispatch(getSolarPanels());
    dispatch(getWindPanel());
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.loadImage(solarPanelIcon, function (error, image) {
      if (error) throw error;
      map.current.addImage("solar-panel-icon", image);
    });

    map.current.loadImage(windPanelIcon, function (error, image) {
      if (error) throw error;
      map.current.addImage("wind-panel-icon", image);
    });

    ///za crtanje u desnom meniju
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
        line_string: true,
      },
    });

    map.current.addControl(draw, "top-right");
    map.current.addControl(new mapboxgl.NavigationControl());
    drawControlsRef.current = draw;

    ///////////////////////////  REMOVE LEFTMENU IF DRAWING  ///////////////////////////
    map.current.on("draw.modechange", (event) => {
      if (event.mode === "draw_polygon") {
        setIsLeftMenuVisible(false);
      } else if (event.mode === "draw_line_string") {
        setIsLeftMenuVisible(false);
      } else if (event.mode === "draw_trash") {
        setIsLeftMenuVisible(false);
      } else {
        setIsLeftMenuVisible(true);
      }
    });

    //////////////////////////// MAPBOXDRAW EVENTS ////////////////////////////
    map.current.on("draw.create", (e) => {
      const features = draw.getAll().features;

      if (features.length > 1) {
        draw.delete(features[0].id);
      }

      const newFeature = e.features[0];
      const measurementType = newFeature.geometry.type;
      let measurementValue;

      if (measurementType === "Polygon") {
        const areaValue = area(newFeature);
        console.log(areaValue);
        if (areaValue >= 100000) {
          const areaValueInKm = (areaValue / 1000000).toFixed(2);
          measurementValue = `${areaValueInKm} km²`;
        } else {
          measurementValue = `${areaValue.toFixed(2)} m²`;
        }
      } else if (measurementType === "LineString") {
        const distanceValue = length(newFeature);
        if (distanceValue * 1000 >= 1000) {
          measurementValue = `${distanceValue.toFixed(2)} km`;
        } else {
          measurementValue = `${(distanceValue * 1000).toFixed(2)} m`;
        }
      }

      setMeasurement(measurementValue);
    });

    map.current.on("draw.delete", () => {
      setMeasurement(null);
    });

    return () => {
      dispatch(turnOffPanelVisibility());
      dispatch(removeExternalData());
    };
  }, [isSolarPanelVisible, isWindPanelVisible, dispatch, lat, lng, zoom]);

  /////////////// CHANGE MOUSE CURSOR WHEN DRAWING //////////////////////
  useEffect(() => {
    if (solarPanelDrawingMode || windPanelDrawingMode) {
      map.current.getCanvas().style.cursor = "crosshair";
    } else {
      map.current.getCanvas().style.cursor = "";
    }
  }, [solarPanelDrawingMode, windPanelDrawingMode]);

  /////////////// Add/remove solar-panels to map when isSolarVisible changes /////////////////////

  // Generate a random color for the circle
  const color = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
  const colorCode =
    "#" + color.map((c) => c.toString(16).padStart(2, "0")).join("");

  //////////////////////// ADDING TEMPORARY LAYER //////////////////////////
  const addTemporaryPanel = useCallback(() => {
    if (temporaryLayer.length > 0) {
      temporaryLayer.forEach((layer) => {
        const features = layer.features;
        const id = layer.id;
        const layerType =
          features[0].geometry.type === "Point" ? "circle" : "fill";
        const existingSources = map.current
          .getStyle()
          .layers.filter((layer) => layer.source === `imported-geojson-${id}`);
        if (existingSources.length > 0) {
          return;
        } // source already exists, don't add it again

        return map.current.addLayer({
          id: `imported-geojson-${id}`,
          type: layerType,
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features,
            },
          },
          layout: {
            visibility: "visible",
          },
          paint:
            features[0].geometry.type === "Point"
              ? {
                  "circle-color": colorCode,
                  "circle-radius": 6,
                  "circle-opacity": 1,
                }
              : { "fill-color": colorCode, "fill-opacity": 0.5 },
        });
      });
    }
  }, [temporaryLayer, colorCode]);
  useEffect(() => {
    if (map.current.loaded()) {
      if (isTemporaryVisible) {
        addTemporaryPanel();
      }
    }
  }, [isTemporaryVisible, addTemporaryPanel]);

  ////////////////////// TOGGLE VISIBILITY OF TEMPORARY LAYER //////////////////////////
  useEffect(() => {
    function toggleLayerVisibility(layerId) {
      const layers = map.current.getStyle().layers;
      const myLayer = layers.find(
        (layer) => layer.id === `imported-geojson-${layerId}`
      );
      const visibility = myLayer.layout.visibility;

      if (visibility === "visible") {
        map.current.setLayoutProperty(
          `imported-geojson-${layerId}`,
          "visibility",
          "none"
        );
      } else {
        map.current.setLayoutProperty(
          `imported-geojson-${layerId}`,
          "visibility",
          "visible"
        );
      }
      dispatch(removeTemporaryLayerIndex());
    }
    if (map.current.loaded()) {
      temporaryLayerIndex && toggleLayerVisibility(temporaryLayerIndex);
    }
    return () => {
      if (map.current.loaded()) {
        temporaryLayerIndex && toggleLayerVisibility(temporaryLayerIndex);
      }
    };
  }, [temporaryLayerIndex, map, dispatch]);

  //////////////////////// ADDING SOLAR PANELS LAYER //////////////////////////
  useEffect(() => {
    function addSolarPanel() {
      if (map.current.getSource("solar-panels")) {
        map.current.removeLayer("solar-panels");
        map.current.removeSource("solar-panels");
      }
      //ovo dodaje izvor markere
      map.current.addSource("solar-panels", {
        type: "geojson",
        data: solarPanelsData,
      });

      //ovo iscitava markere
      map.current.addLayer({
        id: "solar-panels",
        type: "circle",
        source: "solar-panels",
        paint: {
          "circle-radius": 10,
          "circle-color": "#f00",
          "circle-opacity": 0.8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000",
        },
        layout: {
          visibility: "visible",
        },
      });
    }

    if (map.current.loaded()) {
      if (isSolarPanelVisible) {
        addSolarPanel();
      }
    }
  }, [solarPanelsData, isSolarPanelVisible]);

  /////////////////////// TOGGLE VISIBILITY OF SOLAR PANELS LAYER //////////////////////////
  useEffect(() => {
    function toggleSolarLayersVisibility() {
      const layers = map.current.getStyle().layers;
      const myLayer = layers.find((layer) => layer.id === "solar-panels");
      const visibility = myLayer.layout.visibility;

      if (visibility === "visible") {
        map.current.setLayoutProperty(`solar-panels`, "visibility", "none");
      } else {
        map.current.setLayoutProperty(`solar-panels`, "visibility", "visible");
      }
    }

    if (map.current.loaded()) {
      const layers = map.current.getStyle().layers;
      const myLayer = layers.find((layer) => layer.id === "solar-panels");
      if (myLayer) {
        toggleSolarLayersVisibility();
      } else {
      }
    }
  }, [map, isSolarPanelVisible]);

  //////////////////////// ADDING WIND PANELS LAYER //////////////////////////
  useEffect(() => {
    function addWindPanel() {
      if (map.current.getSource("wind-panels")) {
        map.current.removeLayer("wind-panels");
        map.current.removeSource("wind-panels");
      }

      map.current.addSource("wind-panels", {
        type: "geojson",
        data: windPanelsData,
      });

      map.current.addLayer({
        id: "wind-panels",
        type: "circle",
        source: "wind-panels",
        paint: {
          "circle-radius": 10,
          "circle-color": "#33AFFF",
          "circle-opacity": 1,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000",
        },
        layout: {
          visibility: "visible",
        },
      });
    }
    if (map.current.loaded()) {
      if (isWindPanelVisible) {
        addWindPanel();
      }
    }
  }, [windPanelsData, isWindPanelVisible]);

  ///////////////////////// TOGGLE VISIBILITY OF WIND PANELS LAYER //////////////////////////
  useEffect(() => {
    function toggleWindLayersVisibility() {
      const layers = map.current.getStyle().layers;
      const myLayer = layers.find((layer) => layer.id === "wind-panels");
      const visibility = myLayer.layout.visibility;

      if (visibility === "visible") {
        map.current.setLayoutProperty(`wind-panels`, "visibility", "none");
      } else {
        map.current.setLayoutProperty(`wind-panels`, "visibility", "visible");
      }
    }

    if (map.current.loaded()) {
      const layers = map.current.getStyle().layers;
      const myLayer = layers.find((layer) => layer.id === "wind-panels");
      if (myLayer) {
        toggleWindLayersVisibility();
      } else {
      }
    }
  }, [map, isWindPanelVisible]);

  ///////////////////////////////////////////////////////////////////////////////////

  ////Ispod je postavljanje mape(osnova)
  useEffect(() => {
    if (map.current) return;
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  const handleRemoveDrawControls = () => {
    const drawControlsEl = document.querySelector(".mapboxgl-ctrl");

    drawControlsEl.classList.add("hidden");
  };
  const handleAddDrawControls = () => {
    const drawControlsEl = document.querySelector(".mapboxgl-ctrl");
    drawControlsEl.classList.remove("hidden");
  };

  useEffect(() => {
    if (
      solarPanelDrawingMode ||
      windPanelDrawingMode ||
      solarPanelEditMode ||
      windPanelEditMode
    ) {
      handleRemoveDrawControls();
    }
    if (
      !solarPanelDrawingMode &&
      !windPanelDrawingMode &&
      !solarPanelEditMode &&
      !windPanelEditMode
    ) {
      handleAddDrawControls();
    }
  }, [
    solarPanelDrawingMode,
    windPanelDrawingMode,
    solarPanelEditMode,
    windPanelEditMode,
  ]);

  const handleClick = useCallback(
    (e) => {
      if (solarPanelDrawingMode) {
        dispatch(setSolarPanelCoords([e.lngLat.lng, e.lngLat.lat]));
        dispatch(setIsModalOpen());
      }
      if (windPanelDrawingMode) {
        dispatch(setWindPanelCoords([e.lngLat.lng, e.lngLat.lat]));
        dispatch(setIsModalOpen());
      }
    },
    [solarPanelDrawingMode, windPanelDrawingMode, dispatch]
  );

  useEffect(() => {
    if (solarPanelDrawingMode || windPanelDrawingMode) {
      map.current.on("click", handleClick);
      return () => map.current.off("click", handleClick);
    }
  }, [solarPanelDrawingMode, windPanelDrawingMode, handleClick]);
  //////////////////// CLICK ON SOLAR PANELS ///////////////////////
  const handleSolarPanelClick = useCallback(
    (e) => {
      dispatch(setSolarPanelId(e.features[0].id));
      dispatch(setSolarPanelCoords(e.features[0].geometry.coordinates));
      dispatch(setIsModalOpen());
    },
    [dispatch]
  );

  useEffect(() => {
    if (solarPanelEditMode) {
      map.current.on("click", "solar-panels", handleSolarPanelClick);
    }
    return () => {
      map.current.off("click", "solar-panels", handleSolarPanelClick);
    };
  }, [solarPanelEditMode, handleSolarPanelClick]);

  //////////////////// CLICK ON WIND PANELS ///////////////////////
  const handleWindPanelClick = useCallback(
    (e) => {
      dispatch(setWindPanelId(e.features[0].id));
      dispatch(setWindPanelCoords(e.features[0].geometry.coordinates));
      dispatch(setIsModalOpen());
    },
    [dispatch]
  );

  useEffect(() => {
    if (windPanelEditMode) {
      map.current.on("click", "wind-panels", handleWindPanelClick);
    }
    return () => {
      map.current.off("click", "wind-panels", handleWindPanelClick);
    };
  }, [windPanelEditMode, handleWindPanelClick]);

  const typesOfActionsForOpeningModal = [
    {
      condition: solarPanelDrawingMode || solarPanelEditMode,     
      value: "Solar Panel",
    },
    {
      condition: windPanelDrawingMode || windPanelEditMode,
      value: "Wind Panel",
    },
    {
      condition: isTemporaryVisible,
      value: "Temporary Layer",
    },
  ];

  const type =
    typesOfActionsForOpeningModal.find((t) => t.condition)?.value || null;

  const handleCloseModal = () => {
    dispatch(setIsModalOpen());
    dispatch(setIsTemporaryVisible(false));
  };

  return (
    <div className="mapContainer" style={{ position: "relative" }}>
      {isModalOpen && <Modal onClose={handleCloseModal} type={type}></Modal>}
      {isLeftMenuVisible && <LeftMenu />}
      {measurement && (
        <div className="measurement">
          <div>{measurement}</div>
        </div>
      )}
      {solarPanelLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        >
          <Puff color="#414141" />
        </div>
      )}
      <div ref={mapContainer} className="map" />
      <Toast />
    </div>
  );
};

export default MapContainer;
