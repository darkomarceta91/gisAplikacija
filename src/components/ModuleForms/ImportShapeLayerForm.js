import { useForm } from "react-hook-form";
import { Form, Container, Button } from "react-bootstrap";
import InputGroup from "../InputGroup/InputGroup";

const ImportShapeLayerForm = () => {
  const { register, handleSubmit } = useForm();

  const handleFormSubmit = (data) => {
    //   onSubmit(data);
  };

  return (
    <Container className="h-100">
      <div className="d-flex my-5 align-items-center justify-content-center flex-column mt-1 mb-3 h-100 ">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <InputGroup
            name="Model:"
            nameValue="model"
            register={register}
            rules={{ required: true }}
            disabled={false}
            type={"select"}
            options={["global", "europe", "america"]}
          ></InputGroup>

          <InputGroup
            name="Projection:"
            nameValue="projection"
            register={register}
            rules={{ required: true }}
            disabled={false}
            type={"select"}
            options={["projection1", "projection2", "projection3"]}
          ></InputGroup>

          <InputGroup
            name="File:"
            nameValue="file"
            register={register}
            rules={{ required: true }}
            type="file"
            disabled={false}
          />

          <Button className="w-100 mt-4" variant="dark">
            Import
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ImportShapeLayerForm;
