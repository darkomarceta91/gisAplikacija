import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputGroup from "../../components/InputGroup/InputGroup";
import { Button, Form, Container } from "react-bootstrap";
import classes from "../../components/InputGroup/InputGroup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Puff } from "react-loader-spinner";
import {
  logout,
  changePassword,
  resetPasswordChanged,
} from "../../redux-store/userSlice";

const ChangePassword = () => {
  const { isLoading, passwordChanged } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const redirect = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      old_password: "",
      password: "",
      password2: "",
    },
    mode: "onChange",
  });

  const handleNewPassword = (data) => {
    dispatch(changePassword(data));
    reset();
  };

  useEffect(() => {
    if (passwordChanged) {
      toast.success(
        "You have successfully changed your password. Redirect you to LoginPage!"
      );
      setTimeout(() => {
        dispatch(resetPasswordChanged());
        dispatch(logout());
        redirect("/");
      }, 2700);
    }
  }, [passwordChanged, dispatch, redirect]);

  return (
    <Container>
      <ToastContainer
        position="bottom-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
        <div className="d-flex my-3 align-items-center justify-content-center flex-column my-xl-1 h-100 ">
          <Form
            onSubmit={handleSubmit(handleNewPassword)}
            className={`${classes.boxShadow} ${classes.formWidth} p-4 p-md-5 rounded-4`}
          >
            <InputGroup
              name="Current Password"
              placeholder="Current Password"
              type="password"
              nameValue="old_password"
              register={register}
              rules={{
                required: {
                  value: true,
                  message: "Current Password is required!",
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
              error={errors.old_password?.message}
            />
            <InputGroup
              name="New Password"
              placeholder="New Password"
              type="password"
              nameValue="password"
              register={register}
              rules={{
                required: {
                  value: true,
                  message: "New Password is required!",
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
              type="password"
              nameValue="password2"
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
              Update Password
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default ChangePassword;
