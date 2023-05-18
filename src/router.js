import { useRoutes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/login";
import PrivateRoute from "./pages/privateRoute";
import ListInvoices from "./pages/listInvoices";

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
        {
          path: "/list-invoices",
          element: <ListInvoices />,
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
