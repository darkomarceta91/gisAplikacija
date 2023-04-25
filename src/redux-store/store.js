import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import panelSlice from "./panelSlice";
import geoJSONSlice from "./externalGeoJSONSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    panels: panelSlice,
    geoJSON: geoJSONSlice,
  },
});
