import { FC } from "react";
import { useRoutes } from "react-router-dom";
import App from "../App";
import BaseExample from "../pages/baseExample/Index";

const GetRoutes: FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "baseexample",
          element: <BaseExample />,
        },
      ],
    },
  ]);
  return routes;
};

export default GetRoutes;
