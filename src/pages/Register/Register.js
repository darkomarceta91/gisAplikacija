import React from "react";
import axios from "axios";
import InputGroup from "../../components/InputGroup/InputGroup";
import classes from "../../components/InputGroup/InputGroup.module.css";
import "react-toastify/dist/ReactToastify.css";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password2: "",
    },
    mode: "onChange",
  });

  const catchError = (errors) => {
    Object.keys(errors).map((error) => {
      errors[error].map((text) => {
        if (error) {
          setError(error, {
            type: "400",
            message: `${text}`,
          });
        }
      });
    });
  };

  const handleRegister = async (data) => {
    try {
      const response = await axios.post("/users/registration/", data);
      reset();
      toast("You are registered! You can login now!");
    } catch (error) {
      console.log("Response error:", error);
      catchError(error.response.data);
    }
  };

  return (
    <Container className="h-100">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="d-flex my-3 align-items-center justify-content-center flex-column my-xl-1 h-100 ">
        <Form
          onSubmit={handleSubmit(handleRegister)}
          className={`${classes.boxShadow} ${classes.formWidth} p-4 p-md-5 rounded-4`}
        >
          <div className="text-center mb-4">
            <h1>Register</h1>
            <span className="text-muted my-4 lh-lg">
              Create your account, It's free and only takes a minute.
            </span>
          </div>
          <Row>
            <Col xs={12} md={6}>
              <InputGroup
                name="First Name"
                placeholder="First Name"
                type="text"
                nameValue="first_name"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "First Name is required!",
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
                error={errors.first_name?.message}
              />
            </Col>
            <Col xs={12} md={6}>
              <InputGroup
                name="Last Name"
                placeholder="Last Name"
                type="text"
                nameValue="last_name"
                register={register}
                rules={{
                  required: {
                    value: true,
                    message: "Last Name is required!",
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
                error={errors.last_name?.message}
              />
            </Col>
          </Row>
          <InputGroup
            name="Username"
            placeholder="Username"
            type="text"
            nameValue="username"
            register={register}
            rules={{
              required: {
                value: true,
                message: "Username is required!",
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
            error={errors.username?.message}
          />
          <InputGroup
            name="Email"
            placeholder="Email"
            type="email"
            nameValue="email"
            register={register}
            rules={{
              required: {
                value: true,
                message: "Email is required!",
              },
              pattern: {
                value: /^\s*\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})\s*/,
                message: "Please type valid email!",
              },
            }}
            error={errors.email?.message}
          />
          <InputGroup
            name="Password"
            placeholder="Password"
            type="password"
            nameValue="password"
            register={register}
            rules={{
              required: {
                value: true,
                message: "Password is required!",
              },
              minLength: {
                value: 8,
                message: "Minimum length is 8 words!",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{8,}$/,
                message:
                  "Password must contain letter, number and character(!@#$)",
              },
            }}
            error={errors.password?.message}
          />
          <InputGroup
            name="Confirm Password"
            placeholder="Confirm Password"
            nameValue="password2"
            type="password"
            register={register}
            rules={{
              required: {
                value: true,
                message: "Confirm you password!",
              },
              minLength: {
                value: 8,
                message: "Minimum length is 8 words!",
              },
              validate: (value) => {
                const { password } = getValues();
                return password === value || "Passwords should match!";
              },
            }}
            error={errors.password2?.message}
          />
          <Button className="w-100" variant="dark" type="submit">
            Register Now
          </Button>
        </Form>
        <span className="fs-5 mt-4">
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      </div>
    </Container>
  );
};

export default Register;
