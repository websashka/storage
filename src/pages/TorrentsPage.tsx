import React from "react"
import UploadForm from "@/components/UploadForm"
import TorrentsTable from "@/components/TorrentsTable"

const TorrentsPage = () => (
  <>
    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
      Your bags
    </h2>
    <UploadForm className="mb-4" />
    <TorrentsTable />
  </>
)

export default TorrentsPage
