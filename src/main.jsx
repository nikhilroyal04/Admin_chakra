import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./Routes/Routes";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import Store from "../src/app/Store/Store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={Store}>
      <ChakraProvider>
        <RouterProvider router={routes}></RouterProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
