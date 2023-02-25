import React from "react";
import { useRouteError } from "react-router-dom";
import {DATA_PAGE, DEVICES_PAGE, HOME_PAGE, INDEX_PAGE, LOGIN_PAGE} from "./paths";
import Devices from "../pages/devices";
import Login from "../pages/login";
import Data from "../pages/data";
import Home from "../pages/home";
import Nav from "../nav";

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

export default [
  {
    path: INDEX_PAGE,
    element: <Nav />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: HOME_PAGE,
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: DEVICES_PAGE,
        element: <Devices />,
        errorElement: <ErrorPage />,
      },
      {
        path: DATA_PAGE,
        element: <Data />,
        errorElement: <ErrorPage />,
      },
      {
        path: LOGIN_PAGE,
        element: <Login />,
        errorElement: <ErrorPage />,
      },
    ]
  },
]