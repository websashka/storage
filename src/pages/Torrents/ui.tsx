import React from "react"
import { ProviderCard } from "widgets/ProviderCard"
import { TorrentsTable } from "widgets/TorrentsTable"
import { UploadForm } from "features/UploadForm"

export const TorrentsPage = () => (
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
