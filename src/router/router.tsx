import { FC } from "react";
import { useRoutes } from "react-router-dom";
import App from "../App";
import BaseExample from "../pages/baseExample/Index";
import Sortable from "../pages/sortable/Index";

export const routesList = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "baseexample",
        element: <BaseExample />,
      },
      {
        path: "sortable",
        element: <Sortable />,
      },
    ],
  },
];

const GetRoutes: FC = () => {
  const routes = useRoutes(routesList);
  return routes;
};

export default GetRoutes;
