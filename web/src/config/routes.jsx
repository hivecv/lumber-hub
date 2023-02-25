import React from "react";
import {Navigate, useRouteError} from "react-router-dom";
import {DATA_PAGE, DEVICES_PAGE, HOME_PAGE, INDEX_PAGE, LOGIN_PAGE, REGISTER_PAGE} from "./paths";
import Devices from "../pages/devices";
import Login from "../pages/login";
import Data from "../pages/data";
import Home from "../pages/home";
import Nav from "../nav";
import Register from "../pages/register";
import {useSelector} from "react-redux";
import {authTokenSelector} from "../redux";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
const Protected = ({ children }) => {
  const token = useSelector(authTokenSelector);
  if (!token) {
    return <Navigate to={LOGIN_PAGE} replace/>;
  }

  return children;
};

export default [
  {
    path: INDEX_PAGE,
    element: <Nav />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: HOME_PAGE,
        element: <Protected><Home /></Protected>,
        errorElement: <ErrorPage />,
      },
      {
        path: DEVICES_PAGE,
        element: <Protected><Devices /></Protected>,
        errorElement: <ErrorPage />,
      },
      {
        path: DATA_PAGE,
        element: <Protected><Data /></Protected>,
        errorElement: <ErrorPage />,
      },
      {
        path: LOGIN_PAGE,
        element: <Login />,
        errorElement: <ErrorPage />,
      },
      {
        path: REGISTER_PAGE,
        element: <Register />,
        errorElement: <ErrorPage />,
      },
    ]
  },
]