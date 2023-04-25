import InputGroup from "../InputGroup/InputGroup";
import classes from "../../components/InputGroup/InputGroup.module.css";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchingGeoJson,
  setIsTemporaryVisible,
} from "../../redux-store/externalGeoJSONSlice";
import { setIsModalOpen } from "../../redux-store/userSlice";
import { useEffect } from "react";

const TemporaryLayerForm = () => {
  const fetchError = useSelector((state) => state.geoJSON.geoJsonError);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      geojson_url: "",
    },
    mode: "onChange",
  });

  const handlePanel = (data) => {
    dispatch(fetchingGeoJson(data.geojson_url));
    dispatch(setIsTemporaryVisible(false));
    dispatch(setIsModalOpen());
  };

  useEffect(() => {
    reset();
  }, [dispatch, reset]);

  return (
    <Container className="h-100">
      <div className="d-flex my-3 align-items-center justify-content-center flex-column my-xl-0 h-100 ">
        <Form
          onSubmit={handleSubmit(handlePanel)}
          className={`${classes.boxShadow}  position-relative p-4 p-md-5 rounded-4 bg-white`}
        >
          <div className="text-center mb-4">
            <h3>Enter URL for geoJSON data</h3>
            <span className="text-muted my-4 lh-lg">
              Please add link bellow for external geoJSON data
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
            <Col xs={6} md={12}>
              <InputGroup
                placeholder="GeoJSON URL"
                type="text"
                nameValue="geojson_url"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "URL is required!",
                  },
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Please enter a valid website link",
                  },
                }}
                error={
                  errors.geojson_url ? errors.geojson_url?.message : fetchError
                }
              />
            </Col>
          </Row>
          <Button className="w-100 mt-4" variant="dark" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default TemporaryLayerForm;
