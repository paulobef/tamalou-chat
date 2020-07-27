import {
  handleTextInput,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
} from "react-native-formik";
import { TextInput } from "react-native-paper";
import { View } from "./Themed";

export const FormInput = handleTextInput(
  withNextInputAutoFocusInput(TextInput)
);
export const Form = withNextInputAutoFocusForm(View);
