
import { http } from "./httpSetup";
import type { RegisterForm } from "../types/Register";


export const registerUser = async (registerForm: RegisterForm) => {
  console.log(registerForm)
  return http.post(`/users/register`, registerForm)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loginUser = async (loginForm: any) => {
  return http.post(`/users/login`, loginForm)
}
