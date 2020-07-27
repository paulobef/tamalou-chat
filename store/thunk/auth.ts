import { ThunkAction } from "redux-thunk'";
import { Action } from "redux";
import { RootState } from "../../types";
import { ExtendedFirebaseInstance } from "react-redux-firebase";

interface CreateNewUserParamList {
  email: string;
  password: string;
  username: string;
}

export const createNewUser = ({
  email,
  password,
  username,
}: CreateNewUserParamList): ThunkAction<
  void,
  RootState,
  () => ExtendedFirebaseInstance,
  Action<string>
> => async (dispatch, getState, getFirebase) => {
  const firebase = getFirebase();
  firebase.createUser({ email, password }, { username, email });
};
