import React, { useState } from "react";
import { useFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, TextInput } from "react-native-paper";
import { View } from "react-native";
import { RootState, ScreenProps } from "../types";
import { ActivityIndicator } from "react-native-paper";

interface UserInfo {
  email: string;
  password: string;
  username: string;
}

const SignUpScreen = ({ navigation }: ScreenProps) => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const formik = useFormik({
    initialValues: { email: "", password: "", username: "" },
    validationSchema: Yup.object().shape({
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
      username: Yup.string().required("Username is required"),
    }),
    onSubmit: ({ email, password, username }: UserInfo) => {
      firebase.createUser({ email, password }, { username, email });
    },
  });

  const { handleChange, handleBlur, handleSubmit, errors, values } = formik;
  return !isLoaded(auth) && isEmpty(auth) ? (
    <ActivityIndicator animating={true} />
  ) : (
    <View>
      <TextInput
        label="Email"
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        error={
          typeof errors.email === null ||
          typeof errors.email === undefined ||
          errors.email === ""
        }
        value={values.email}
      />
      <TextInput
        label="Password"
        secureTextEntry={true}
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        error={
          typeof errors.password === null ||
          typeof errors.password === undefined ||
          errors.password === ""
        }
        value={values.password}
      />
      <TextInput
        label="Username"
        onChangeText={handleChange("username")}
        onBlur={handleBlur("username")}
        error={
          typeof errors.username === null ||
          typeof errors.username === undefined ||
          errors.username === ""
        }
        value={values.username}
      />
      <Button onPress={handleSubmit}>Submit</Button>
      <Button onPress={() => navigation.navigate("SignInScreen")}>
        Sign in
      </Button>
    </View>
  );
};

export default SignUpScreen;
