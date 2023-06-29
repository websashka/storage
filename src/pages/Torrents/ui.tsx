import React from "react"
import { ProviderCard } from "widgets/ProviderCard"
import { TorrentsTable } from "widgets/TorrentsTable"
import { Replication } from "features/Replication"
import { UploadForm } from "features/UploadForm"

export const TorrentsPage = () => (
  <>
    <div className="flex max-xl:flex-col">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Your bags
      </h2>
      <ProviderCard className="xl:ml-auto" />
    </div>

    <UploadForm className="my-4" />
    <TorrentsTable />
    <Replication
      open={false}
      onOpenChange={() => {
        console.log(1)
      }}
    />
  </>
)
