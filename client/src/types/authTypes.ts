import { AuthActionTypes } from "@/actions/actionTypes";
import type { SerializedError } from "@reduxjs/toolkit/react";

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: SerializedError | null;
}

// Define action creators
export interface LoginRequestAction {
  type: AuthActionTypes.LOGIN_REQUEST;
}

export interface LoginSuccessAction {
  type: AuthActionTypes.LOGIN_SUCCESS;
  payload: { user: User; token: string };
}

export interface LoginFailureAction {
  type: AuthActionTypes.LOGIN_FAILURE;
  error: string;
}
export interface RegisterRequestAction {
  type: AuthActionTypes.REGISTER_REQUEST;
}

export interface RegisterSuccessAction {
  type: AuthActionTypes.REGISTER_SUCCESS;
  payload: { user: User; token: string };
}
export interface RegisterFailureAction {
  type: AuthActionTypes.REGISTER_FAILURE;
  error: string;
}

export type AuthActions =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailureAction;
