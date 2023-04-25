import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Define the async thunk
export const fetchingGeoJson = createAsyncThunk(
  "geoJSON/fetchingGeoJson",
  async (url, thunkAPI) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      // Return the error message as part of the rejected action
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  temporaryLayer: {
    geojson: [],
  },
  isTemporaryVisible: false,
  isLoading: false,
  geoJsonError: null,
  temporaryLayerIndex: null,
  showTemporaryLayer: null,
};

export const externalGeoJSONSlice = createSlice({
  name: "geoJSON",
  initialState,
  reducers: {   
    setIsTemporaryVisible(state, action) {
      state.isTemporaryVisible = action.payload;
    },
    removeExternalData(state) {
      state.temporaryLayer.geojson = [];
    },
    removeTemporaryLayer: (state, action) => {
      const idToRemove = action.payload;
      state.temporaryLayer.geojson = state.temporaryLayer.geojson.filter(
        (layer) => layer.id !== idToRemove
      );
    },
    hideRemovedTemporaryLayer: (state, action) => {
      const index = action.payload;
      state.temporaryLayerIndex = index;
    },

    removeTemporaryLayerIndex: (state) => {
      state.temporaryLayerIndex = null;
    },
    setShowTemporaryLayer: (state, action) => {
      const index = action.payload;
      state.showTemporaryLayer = index;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchingGeoJson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchingGeoJson.fulfilled, (state, action) => {
        const newGeoJson = {
          ...action.payload,
          id: uuidv4(), // Generate a unique id using a library like uuid
        };
        state.temporaryLayer.geojson.push(newGeoJson);
        state.isLoading = false;
        state.isTemporaryVisible = true;
        state.geoJsonError = null;
      })
      .addCase(fetchingGeoJson.rejected, (state, action) => {
        state.isLoading = false;
        state.geoJsonError = `There is no valid GeoJSON data at this URL.`;
      });
  },
});

export const {
  setIsTempButtonClicked,
  setIsTemporaryVisible,
  removeExternalData,
  removeTemporaryLayer,
  hideRemovedTemporaryLayer,
  setShowTemporaryLayer,
  removeTemporaryLayerIndex,
} = externalGeoJSONSlice.actions;

export default externalGeoJSONSlice.reducer;
