import { createBrowserRouter } from "react-router-dom";
import App from "./App";

export default function createAppRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
  ]);
}
