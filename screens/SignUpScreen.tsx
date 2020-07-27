import React from "react";
import { Form, FormInput } from "../components/ConfiguredForm";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button } from "react-native-paper";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required()
    .email("Email is required & must be of format example@domain.com"),
  password: Yup.string()
    .required()
    .min(8, "Password is required & must be longer than 8 characters"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match"
  ),
  username: Yup.string().required.name("Username is required"),
});

const SignUpScreen = (props) => {
  return (
    <Formik
      onSubmit={(values) => console.log(values)}
      validationSchema={validationSchema}
      render={(props) => {
        return (
          <Form>
            <FormInput label="Email" name="email" type="email" />
            <FormInput label="Password" name="password" type="password" />
            <FormInput label="First Name" name="firstName" type="name" />
            <Button onPress={props.handleSubmit} title="SUBMIT" />
          </Form>
        );
      }}
    />
  );
};

export default SignUpScreen;
