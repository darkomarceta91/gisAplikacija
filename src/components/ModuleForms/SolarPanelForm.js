import InputGroup from "../InputGroup/InputGroup";
import classes from "../../components/InputGroup/InputGroup.module.css";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createSolarPanel,
  deleteSolarPanel,
  updateSolarPanel,
} from "../../redux-store/panelSlice";
import { setIsModalOpen } from "../../redux-store/userSlice";
import { useEffect } from "react";

const SolarPanelForm = () => {
  const dispatch = useDispatch();
  const solarPanelsData = useSelector((state) => state.panels.solarPanel.data);
  const solarPanelId = useSelector((state) => state.panels.solarPanel.id);
  const entityChoices = useSelector((state) => state.panels.entityChoice.data);
  const entiteti = entityChoices.map((entitet) => entitet.name);
  const cantonChoices = useSelector((state) => state.panels.cantonChoice.data);
  const kantoni = cantonChoices.map((canton) => canton.name);
  const zoneChoices = useSelector((state) => state.panels.zoneChoice.data);
  const zone = zoneChoices.map((zona) => zona.name);
  const isDrawingMode = useSelector(
    (state) => state.panels.solarPanel.isDrawingMode
  );
  const isEditMode = useSelector((state) => state.panels.solarPanel.isEditMode);
  const createPanelCoords = useSelector(
    (state) => state.panels.solarPanel.createCoords
  );
  const [lat, lng] = createPanelCoords;

  const deleteHandler = () => {
    dispatch(deleteSolarPanel(solarPanelId));
    dispatch(setIsModalOpen());
  };

  const defaultValues = {
    manufacturer: "",
    owner_name: "",
    note: "",
    panel_angle: "",
    canton: "",
    zone: "",
    entity: "",
    city: "",
    altitude: "",
    field_strength: "",
    document: null,
    geometry: `POINT(${lat} ${lng})`,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });
  
  

useEffect(() => {
  if (solarPanelId) {
    const filteredPanel = solarPanelsData.features.find(
      (feature) => feature.id === solarPanelId
    )?.properties;
    let updatedCanton = cantonChoices.find(
      (canton) => canton.code === filteredPanel?.canton
    )?.name;
    let updatedZone = zoneChoices.find(
      (zona) => zona.code === filteredPanel?.zone
    )?.name;
    let updatedEntity = entityChoices.find(
      (entitet) => entitet.code === filteredPanel?.entity
    )?.name;
    const updatedFilteredPanel = { ...filteredPanel, canton: updatedCanton, zone: updatedZone, entity: updatedEntity };

    Object.keys(updatedFilteredPanel).forEach((key) => {
      defaultValues[key] = updatedFilteredPanel[key];
    });   
    reset(updatedFilteredPanel);
  } else {
    reset(defaultValues);
  }
}, [solarPanelId, reset,]);


  const handlePanel = (data) => {   
    const features = {
      geometry: `POINT(${lat} ${lng})`,
      manufacturer: data.manufacturer,
      owner_name: data.owner_name,
      note: data.note,
      panel_angle: data.panel_angle,
      canton: cantonChoices.find((canton) => canton.name === data.canton).code,
      zone: zoneChoices.find((zona) => zona.name === data.zone).code,
      entity: entityChoices.find((entitet) => entitet.name === data.entity)
        .code,
      city: data.city,
      altitude: data.altitude,
      field_strength: data.field_strength,
      document: data.document,
    };

    isDrawingMode && dispatch(createSolarPanel(features));
    isEditMode &&
      dispatch(updateSolarPanel({ id: solarPanelId, data: features }));
    reset();
    dispatch(setIsModalOpen());
  };

  return (
    <Container className="h-100">
      <div className="d-flex my-3 align-items-center justify-content-center flex-column my-xl-0 h-100 ">
        <Form
          onSubmit={handleSubmit(handlePanel)}
          className={`${classes.boxShadow} w-100 position-relative p-4 p-md-5 rounded-4 bg-white`}
        >
          <div className="text-center mb-4">
            {!solarPanelId ? (
              <h3>Create new Solar Panel</h3>
            ) : (
              <h3>Details for Solar Panel</h3>
            )}
            <span className="text-muted my-4 lh-lg">
              {!solarPanelId
                ? "Please add details bellow for new Solar Panel"
                : "Check details bellow for Solar Panel"}
            </span>
            <Button
              className="position-absolute top-0 end-0 m-3"
              variant="dark"
              size="sm"
              onClick={() => dispatch(setIsModalOpen())}
            >
              ✕
            </Button>
          </div>
          <Row>
            <Col xs={6} md={4}>
              <InputGroup
                name="Owner Name"
                placeholder="Owner Name"
                type="text"
                nameValue="owner_name"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Owner name is required!",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Please text letters only!",
                  },
                }}
                error={errors.owner_name?.message}
              />
            </Col>
            <Col xs={6} md={4}>
              <InputGroup
                name="note"
                placeholder="note"
                type="text"
                nameValue="note"
                register={register}
                rules={{
                  maxLength: {
                    value: 50,
                    message: "Max length is 50 letters!",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Please text letters only!",
                  },
                }}
                error={errors.note?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Angle of Panel"
                placeholder="Angle of Panel"
                type="number"
                nameValue="panel_angle"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Angle of Panel is required!",
                  },
                }}
                error={errors.panel_angle?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="canton"
                placeholder="canton"
                type={"select"}
                options={kantoni}
                nameValue="canton"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "canton is required!",
                  },
                  minLength: {
                    value: 3,
                    message: "Minimum length is 3 words!",
                  },
                }}
                error={errors.canton?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Zone"
                placeholder="Zone"
                nameValue="zone"
                type={"select"}
                options={zone}
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Zone is required!",
                  },
                }}
                error={errors.zone?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Geometry"
                placeholder="Geometry"
                nameValue="geometry"
                register={register}               
                error={errors.geometry?.message}
                disabled={true}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Manufacturer"
                placeholder="Manufacturer"
                type="text"
                nameValue="manufacturer"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Manufacturer is required!",
                  },
                  maxLength: {
                    value: 20,
                    message: "Max length is 20 letters!",
                  },
                  pattern: {
                    value: /^[A-Za-z]+$/i,
                    message: "Please text letters only!",
                  },
                }}
                error={errors.manufacturer?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Field Power"
                placeholder="Field Power"
                type="number"
                nameValue="field_strength"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Field Power is required!",
                  },
                  maxLength: {
                    value: 20,
                    message: "Max length is 20 letters!",
                  },
                  pattern: {
                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please numbers only!",
                  },
                }}
                error={errors.field_strength?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="entity"
                placeholder="entity"
                nameValue="entity"
                register={register}
                type={"select"}
                options={entiteti}
                rules={{
                  required: {
                    value: true,
                    message: "Entity is required!",
                  },
                }}
                error={errors.entity?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="City"
                placeholder="City"
                type="text"
                nameValue="city"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "City is required!",
                  },
                  minLength: {
                    value: 2,
                    message: "Minimum length is 2 letters!",
                  },
                }}
                error={errors.city?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="altitude"
                placeholder="altitude"
                nameValue="altitude"
                type="number"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "altitude is required!",
                  },
                }}
                error={errors.altitude?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Document"
                placeholder="Document"
                nameValue="document"
                type="text"
                register={register}
                rules={{}}
                error={errors.document?.message}
              />
            </Col>
          </Row>
          {!solarPanelId ? (
            <Button className="w-100 mt-4" variant="dark" type="submit">
              Create
            </Button>
          ) : (
            <Col className="mt-4 d-flex justify-content-end">
              <Button variant="danger" className="me-3" onClick={deleteHandler}>
                Remove
              </Button>
              <Button variant="success" className="px-5" type="submit">
                Submit
              </Button>
            </Col>
          )}
        </Form>
      </div>
    </Container>
  );
};

export default SolarPanelForm;
