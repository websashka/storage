import React from "react"
import { createBrowserRouter } from "react-router-dom"
import { RequireAuth } from "entities/User"
import { RootTemplate } from "widgets/RootTemplate"
import { Error404Page } from "./Error404"
import { Error500Page } from "./Error500"
import { FeaturesPage } from "./Features"
import { RequestConnectPage } from "./RequestConnect"
import { TorrentsPage } from "./Torrents"

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error500Page />,
    element: <RootTemplate />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <TorrentsPage />
          </RequireAuth>
        ),
      },
      {
        path: "/login",
        element: <RequestConnectPage />,
      },
      {
        path: "/features",
        element: <FeaturesPage />,
      },
      {
        path: "*",
        element: <Error404Page />,
      },
    ],
  },
])
