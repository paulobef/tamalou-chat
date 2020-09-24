import React from "react";

export const useSnackBar = (
  defaultMessage: string = "",
  initialVisibility: boolean = false
) => {
  const [snackbarState, setSnackbarState] = React.useState({
    visible: initialVisibility,
    message: defaultMessage,
    error: false,
  });

  const toggleSnackBar = (message: string, error: boolean = false) =>
    setSnackbarState({ visible: !snackbarState.visible, message, error });
  const dismissSnackBar = () =>
    setSnackbarState({
      visible: false,
      message: snackbarState.message,
      error: snackbarState.error,
    });

  const state: [
    { visible: boolean; error: boolean; message: string },
    (message: string, error?: boolean) => void,
    () => void
  ] = [snackbarState, toggleSnackBar, dismissSnackBar];

  return state;
};
