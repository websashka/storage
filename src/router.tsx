import React from "react"
import { createBrowserRouter } from "react-router-dom"
import TorrentsPage from "@/pages/TorrentsPage"
import RequireAuth from "@/components/RequireAuth"
import FeaturesPage from "@/pages/FeaturesPage"
import Error404Page from "@/pages/Error404Page"
import Error500Page from "@/pages/Error500Page"

const router = createBrowserRouter([
  {
    errorElement: <Error500Page />,
    path: "/",
    element: (
      <RequireAuth>
        <TorrentsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/features",
    element: <FeaturesPage />,
  },
  {
    path: "*",
    element: <Error404Page />,
  },
])

export default router
