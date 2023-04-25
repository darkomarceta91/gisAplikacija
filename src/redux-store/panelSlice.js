import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../axios/api-interceptor";

//////////////////////              FETCH SOLAR PANELS                     ////////////////////////

////FetchSolarPanels
export const getSolarPanels = createAsyncThunk(
  "/energy/solar_panels",
  async (thunkAPI) => {
    try {
      const response = await axios.get("/energy/solar_panels");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////CreateSolarPanels
export const createSolarPanel = createAsyncThunk(
  "/energy/solar_panels_create",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/energy/solar_panels/", data);
      thunkAPI.dispatch(getSolarPanels());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////DeleteSolarPanels
export const deleteSolarPanel = createAsyncThunk(
  "delete_solar_panel/deleteSolarPanel",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/energy/solar_panel_update/${id}/`);
      thunkAPI.dispatch(getSolarPanels());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////UpdateSolarPanels
export const updateSolarPanel = createAsyncThunk(
  "update_solar_panel/updateSolarPanel",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/energy/solar_panel_update/${id}/`, data);
      thunkAPI.dispatch(getSolarPanels());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//////////////////////              FETCH WIND PANELS                     ////////////////////////

////FetchWindPanels
export const getWindPanel = createAsyncThunk(
  "/energy/wind_power_plants",
  async (thunkAPI) => {
    try {
      const response = await axios.get("/energy/wind_power_plants");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

////CreateWindPanels
export const createWindPanel = createAsyncThunk(
  "/energy/wind_power_plants_create",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/energy/wind_power_plants/", data);
      thunkAPI.dispatch(getWindPanel());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

////DeleteWindPanels
export const deleteWindPanel = createAsyncThunk(
  "delete_solar_panel/deleteWindPanel",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(
        `/energy/wind_power_plant_update/${id}/`
      );
      thunkAPI.dispatch(getWindPanel());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////UpdateWindPanels
export const updateWindPanel = createAsyncThunk(
  "update_solar_panel/updateWindPanel",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(
        `/energy/wind_power_plant_update/${id}/`,
        data
      );
      thunkAPI.dispatch(getWindPanel());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////Entity_Choice
export const entityChoice = createAsyncThunk(
  "entity_choice/entityChoice",
  async(thunkAPI) => {
    try {
      const response = await api.get("/energy/entity_choice/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////Canton_Choice
export const cantonChoice = createAsyncThunk(
  "canton_choice/cantonChoice",
  async(thunkAPI) => {
    try {
      const response = await api.get("/energy/canton_choice/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
////Zone_Choice
export const zoneChoice = createAsyncThunk(
  "zone_choice/zoneChoice",
  async(thunkAPI) => {
    try {
      const response = await api.get("/energy/zone_choice/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  solarPanel: {
    isVisible: false,
    isDrawingMode: false,
    isEditMode: false,
    createCoords: [],
    id: null,
    data: [],
    isLoading: false,
    error: {
      fetchError: null,
      createError: null,
      deleteError: null,
      updateError: null,
    },
  },
  windPanel: {
    isVisible: false,
    isDrawingMode: false,
    isEditMode: false,
    createCoords: [],
    id: null,
    data: [],
    isLoading: false,
    error: {
      fetchError: null,
      createError: null,
      deleteError: null,
      updateError: null,
    },
  },
  entityChoice: {
    data: [],
    isLoading: false,
    error: null
  },
  cantonChoice: {
    data: [],
    isLoading: false,
    error: null
  },
  zoneChoice: {
    data: [],
    isLoading: false,
    error: null
  },
};
export const panelSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {
    setSolarPanelCoords: (state, action) => {
      state.solarPanel.createCoords = action.payload;
    },
    setWindPanelCoords: (state, action) => {
      state.windPanel.createCoords = action.payload;
    },
    setSolarPanelVisible: (state) => {
      state.solarPanel.isVisible = !state.solarPanel.isVisible;
      state.solarPanel.isDrawingMode = false;
      state.solarPanel.isEditMode = false;
    },
    setWindPanelVisible: (state) => {
      state.windPanel.isVisible = !state.windPanel.isVisible;
      state.windPanel.isDrawingMode = false;
      state.windPanel.isEditMode = false;
    },
    turnOffDrawingEditModes: (state) => {
      state.solarPanel.isDrawingMode = false;
      state.windPanel.isDrawingMode = false;
      state.solarPanel.isEditMode = false;
      state.windPanel.isEditMode = false;
    },
    setSolarPanelDrawingMode: (state) => {
      state.solarPanel.isDrawingMode = !state.solarPanel.isDrawingMode;
      state.solarPanel.isEditMode = false;
      state.windPanel.isEditMode = false;
      state.windPanel.isDrawingMode = false;
      state.solarPanel.id = null;
      state.windPanel.id = null;
    },
    setWindPanelDrawingMode: (state) => {
      state.windPanel.isDrawingMode = !state.windPanel.isDrawingMode;
      state.solarPanel.isDrawingMode = false;
      state.windPanel.isEditMode = false;
      state.solarPanel.isEditMode = false;
      state.solarPanel.id = null;
      state.windPanel.id = null;
    },
    setSolarPanelEditMode: (state) => {
      state.solarPanel.isEditMode = !state.solarPanel.isEditMode;
      state.windPanel.isEditMode = false;
      state.solarPanel.isDrawingMode = false;
      state.windPanel.isDrawingMode = false;
    },
    setWindPanelEditMode: (state) => {
      state.windPanel.isEditMode = !state.windPanel.isEditMode;
      state.solarPanel.isEditMode = false;
      state.solarPanel.isDrawingMode = false;
      state.windPanel.isDrawingMode = false;
    },
    setSolarPanelId: (state, action) => {
      state.solarPanel.id = action.payload;
      state.windPanel.id = null;
    },
    setWindPanelId: (state, action) => {
      state.windPanel.id = action.payload;
      state.solarPanel.id = null;
    },
    toggleSolarPanels: (state) => {
      state.solarPanel.isVisible = !state.solarPanel.isVisible;
      state.solarPanel.isDrawingMode = false;
      state.solarPanel.isEditMode = false;
    },
    turnOffPanelVisibility: (state) => {
      state.solarPanel.isVisible = false;
      state.windPanel.isVisible = false;
      state.solarPanel.isDrawingMode = false;
      state.windPanel.isDrawingMode = false;
      state.solarPanel.isEditMode = false;
      state.windPanel.isEditMode = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSolarPanels.pending, (state) => {
        state.solarPanel.isLoading = true;
      })
      .addCase(getSolarPanels.fulfilled, (state, action) => {
        state.solarPanel.data = action.payload;
        state.solarPanel.isLoading = false;
      })
      .addCase(getSolarPanels.rejected, (state, action) => {
        state.solarPanel.isLoading = false;
      })
      .addCase(createSolarPanel.pending, (state) => {
        state.solarPanel.isLoading = true;
      })
      .addCase(createSolarPanel.rejected, (state, action) => {
        state.solarPanel.error.createError = action.payload;
        state.solarPanel.isLoading = false;
      })
      .addCase(deleteSolarPanel.pending, (state) => {
        state.solarPanel.isLoading = true;
      })
      .addCase(deleteSolarPanel.fulfilled, (state) => {
        // state.solarPanel.isLoading = false;
      })
      .addCase(deleteSolarPanel.rejected, (state, action) => {
        state.solarPanel.error.deleteError = action.payload;
        state.solarPanel.isLoading = false;
      })
      .addCase(updateSolarPanel.pending, (state) => {
        state.solarPanel.isLoading = true;
      })
      .addCase(updateSolarPanel.fulfilled, (state, action) => {
        state.solarPanel.isLoading = false;
      })
      .addCase(updateSolarPanel.rejected, (state, action) => {
        state.solarPanel.error.updateError = action.payload;
        state.solarPanel.isLoading = false;
      })
      ////////////////////////////////////   WIND PANELS  /////////////////////////////
      .addCase(getWindPanel.pending, (state) => {})
      .addCase(getWindPanel.fulfilled, (state, action) => {
        state.windPanel.data = action.payload;
      })
      .addCase(getWindPanel.rejected, (state, action) => {})
      .addCase(createWindPanel.fulfilled, (state, action) => {
        // state.windPanel.data = action.payload;
      })
      .addCase(createWindPanel.rejected, (state, action) => {})
      .addCase(deleteWindPanel.fulfilled, (state, action) => {
        // state.windPanel.data = action.payload;
      })
      .addCase(deleteWindPanel.rejected, (state, action) => {})
      .addCase(deleteWindPanel.pending, (state) => {
        state.windPanel.isLoading = true;
      })
      .addCase(updateWindPanel.fulfilled, (state, action) => {
        // state.windPanel.data = action.payload;
      })
      .addCase(updateWindPanel.rejected, (state, action) => {})
      .addCase(updateWindPanel.pending, (state) => {
        state.windPanel.isLoading = true;
      })
      ///////////////////////////////////////// CHOICES ///////////////////////////////////////
      .addCase(entityChoice.fulfilled, (state, action) => {
        state.entityChoice.data = action.payload;              
      })
      .addCase(cantonChoice.fulfilled, (state, action) => {
        state.cantonChoice.data = action.payload;              
      })
      .addCase(zoneChoice.fulfilled, (state, action) => {
        state.zoneChoice.data = action.payload;              
      });

  },
});

export const {
  setSolarPanelCoords,
  setWindPanelCoords,
  setSolarPanelVisible,
  setWindPanelVisible,
  setSolarPanelDrawingMode,
  setWindPanelDrawingMode,
  setSolarPanelEditMode,
  setWindPanelEditMode,
  setSolarPanelId,
  setWindPanelId, 
  turnOffPanelVisibility,
  turnOffDrawingEditModes
} = panelSlice.actions;

export default panelSlice.reducer;

