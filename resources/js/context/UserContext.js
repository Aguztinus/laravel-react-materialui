import React from "react";
import { loginUri, register } from '../api/auth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

toast.configure();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, registerUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  loginUri({
    email: login,
    password: password
  })
    .then(({ user, token }) => {
      localStorage.setItem('id_token', token);
      localStorage.setItem('users', user);
      setError(null);
      setIsLoading(false)
      dispatch({ type: 'LOGIN_SUCCESS' })
      history.push('/app/dashboard');
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      setError(true);
      setIsLoading(false);
    });
}

function registerUser(dispatch, email, name, password, passwordconfirmation, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  register({
    email: email,
    name: name,
    password: password,
    password_confirmation: passwordconfirmation
  })
    .then(({ user, token }) => {
      localStorage.setItem('id_token', token);
      localStorage.setItem('users', user);
      setError(null);
      setIsLoading(false)
      dispatch({ type: 'LOGIN_SUCCESS' })
      history.push('/app/dashboard');
    })
    .catch((error) => {
      toast.error(error.response.data.message);
      setError(true);
      setIsLoading(false);
    });
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
