import React from "react"
import UploadForm from "@/components/UploadForm"
import TorrentsTable from "@/components/TorrentsTable"
import ProviderCard from "@/components/ProviderCard"

const TorrentsPage = () => (
  <>
    <div className="flex">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Your bags
      </h2>
      <ProviderCard className="ml-auto" />
    </div>

    <UploadForm className="mb-4" />
    <TorrentsTable />
  </>
)

export default TorrentsPage
