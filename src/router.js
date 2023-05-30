import { useRoutes } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/login";
import PrivateRoute from "./pages/privateRoute";
import ListInvoices from "./pages/listInvoices";
import UploadInvoice from "./pages/uploadInvoice";

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
        {
          path: "/list-invoices/:idExpense",
          element: <ListInvoices />,
        },
        {
          path: "/upload-invoice",
          element: <UploadInvoice />,
        },
        {
          path: "/upload-invoice/:idInvoice",
          element: <UploadInvoice />,
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
