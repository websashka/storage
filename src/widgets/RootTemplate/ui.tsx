import React from "react"
import { AppHeader } from "../AppHeader"
import { Content, Layout, Toaster } from "../../shared/ui"
import { AppFooter } from "../AppFooter"
import { Outlet } from "react-router-dom"
import AuthProvider from "../../app/providers/AuthProvider"

export const RootTemplate = () => (
  <AuthProvider>
    <Layout>
      <AppHeader />
      <Content>
        <Outlet />
      </Content>
      <AppFooter />
      <Toaster />
    </Layout>
  </AuthProvider>
)
