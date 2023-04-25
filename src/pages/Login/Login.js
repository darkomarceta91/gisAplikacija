import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button, Form, Container } from "react-bootstrap";
import InputGroup from "../../components/InputGroup/InputGroup";
import classes from "../../components/InputGroup/InputGroup.module.css";
import { loginUser } from "../../redux-store/userSlice";
import { Puff } from "react-loader-spinner";

const Login = () => {
  const redirect = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, loginError } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const loginUserAsync = async (data) => {
    dispatch(loginUser(data));
    redirect("/map");
  };

  return (
    <Container className="h-100">
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Puff color="#414141" />
        </div>
      ) : (
        <div className="d-flex my-3 align-items-center justify-content-center flex-column h-100 my-xl-0">
          <Form
            onSubmit={handleSubmit(loginUserAsync)}
            className={`${classes.boxShadow} ${classes.formWidth} p-4 p-md-5 rounded-4`}
          >
            <div className="text-center mb-4">
              <h1>Member Login</h1>
              <span className="text-muted my-4 lh-lg">
                If you don't have account? Sign up below.
              </span>
            </div>
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
              name="Password"
              placeholder="password"
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
              }}
              error={
                errors.password ? errors.password?.message : loginError?.detail
              }
            />
            <Button className="w-100 mt-3" variant="dark" type="submit">
              Login
            </Button>
          </Form>
          <span className="fs-5 mt-4">
            You don't have accoount? Register for free.{" "}
            <Link to="/register">Register</Link>
          </span>
        </div>
      )}
    </Container>
  );
};

export default Login;
