import { Outlet, useRoutes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/login";
import PrivateRoute from "./pages/privateRoute";

export default function RouterElement() {
  const routes = useRoutes([
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
    {
      path: "",
      element: <LoginPage isLogin={true} />,
    },
    {
      path: "/register",
      element: <LoginPage isLogin={false} />,
    },
  ]);
  return routes;
}
