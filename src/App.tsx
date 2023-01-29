import React from "react"
import Header from "@/components/Header"
import Content from "@/ui/Content"
import { RouterProvider } from "react-router-dom"
import router from "@/router"
function App() {
  return (
    <>
      <Header />
      <Content>
        <RouterProvider router={router} />
      </Content>
    </>
  )
}

export default App
