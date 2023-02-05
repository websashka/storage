import React from "react"
import Header from "@/ui/Header"
import Content from "@/ui/Content"
import { RouterProvider } from "react-router-dom"
import router from "@/router"
import Footer from "@/ui/Footer"
import Layout from "@/ui/Layout"
function App() {
  return (
    <Layout>
      <Header />
      <Content>
        <RouterProvider router={router} />
      </Content>
      <Footer />
    </Layout>
  )
}

export default App
