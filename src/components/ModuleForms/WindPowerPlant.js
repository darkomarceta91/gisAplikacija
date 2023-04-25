import InputGroup from "../InputGroup/InputGroup";
import classes from "../../components/InputGroup/InputGroup.module.css";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createWindPanel,
  updateWindPanel,
  deleteWindPanel,
} from "../../redux-store/panelSlice";
import { setIsModalOpen } from "../../redux-store/userSlice";

const WindPowerPlant = () => {
  const dispatch = useDispatch();
  const windPanelsData = useSelector((state) => state.panels.windPanel.data);
  const windPanelId = useSelector((state) => state.panels.windPanel.id);
  const entityChoices = useSelector((state) => state.panels.entityChoice.data);
  const entiteti = entityChoices.map((entitet) => entitet.name);
  const cantonChoices = useSelector((state) => state.panels.cantonChoice.data);
  const kantoni = cantonChoices.map((canton) => canton.name);
  const zoneChoices = useSelector((state) => state.panels.zoneChoice.data);
  const zone = zoneChoices.map((zona) => zona.name);
  const isDrawingMode = useSelector(
    (state) => state.panels.windPanel.isDrawingMode
  );
  const isEditMode = useSelector((state) => state.panels.windPanel.isEditMode);
  const createPanelCoords = useSelector(
    (state) => state.panels.windPanel.createCoords
  );
  const [lat, lng] = createPanelCoords;

  const deleteHandler = () => {
    dispatch(deleteWindPanel(windPanelId));
    dispatch(setIsModalOpen());
  };

  const defaultValues = {
    manufacturer: "",
    owner_name: "",
    note: "",
    power_supplied: "",
    canton: "",
    zone: "",
    terms_of_use: "",
    entity: "",
    city: "",
    altitude: "",
    wind_direction: "",
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
    if (windPanelId) {
      const filteredPanel = windPanelsData.features.find(
        (feature) => feature.id === windPanelId
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
      const updatedFilteredPanel = {
        ...filteredPanel,
        canton: updatedCanton,
        zone: updatedZone,
        entity: updatedEntity,
      };

      Object.keys(updatedFilteredPanel).forEach((key) => {
        defaultValues[key] = updatedFilteredPanel[key];
      });
      reset(updatedFilteredPanel);
    } else {
      reset(defaultValues);
    }
  }, [windPanelId, reset]);

  const handlePanel = (data) => {
    const features = {
      geometry: `POINT(${lat} ${lng})`,
      manufacturer: data.manufacturer,
      owner_name: data.owner_name,
      note: data.note,
      power_supplied: data.power_supplied,
      canton: cantonChoices.find((canton) => canton.name === data.canton).code,
      zone: zoneChoices.find((zona) => zona.name === data.zone).code,
      entity: entityChoices.find((entitet) => entitet.name === data.entity)
        .code,
      city: data.city,
      altitude: data.altitude,
      wind_direction: data.wind_direction,
      document: data.document,
    };
    isDrawingMode && dispatch(createWindPanel(features));
    isEditMode &&
      dispatch(updateWindPanel({ id: windPanelId, data: features }));
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
            {!windPanelId ? (
              <h3>Create new Wind Panel</h3>
            ) : (
              <h3>Details for Wind Panel</h3>
            )}
            <span className="text-muted my-4 lh-lg">
              {!windPanelId
                ? "Please add details bellow for new Wind Panel"
                : "Check details bellow for Wind Panel"}
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
                name="Note"
                placeholder="Note"
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
                error={errors.reminder?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Power Supplied"
                placeholder="Power Supplied"
                type="number"
                nameValue="power_supplied"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Angle of Panel is required!",
                  },
                }}
                error={errors.angle_of_panel?.message}
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
                type="text"
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
                }}
                error={errors.manufacturer?.message}
              />
            </Col>

            <Col xs={6} md={4}>
              <InputGroup
                name="Wind Direction"
                placeholder="Wind Direction"
                type="number"
                nameValue="wind_direction"
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
                error={errors.field_power?.message}
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
                name="Altitude"
                placeholder="Altitude"
                nameValue="altitude"
                type="number"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Elevation is required!",
                  },
                }}
                error={errors.elevation?.message}
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
          {!windPanelId ? (
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

export default WindPowerPlant;
