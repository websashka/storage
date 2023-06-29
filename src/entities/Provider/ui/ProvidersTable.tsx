import dayjs from "dayjs"
import Table, { TableProps } from "rc-table"
import React from "react"
import { Loader, RadioGroupItem } from "shared/ui"
import { useProviders } from "../api"

interface ProvidersTableProps extends TableProps {
  columns: any
}
export const ProvidersTable = ({ columns, ...props }: ProvidersTableProps) => {
  const { data, isLoading } = useProviders()

  if (isLoading) {
    return <Loader />
  }

  return (
    <Table<any>
      data={data}
      columns={[
        ...(columns || []),
        {
          title: "Address",
          dataIndex: "address",
        },
        {
          title: "Active",
        },
        {
          title: "Last Proof",
          dataIndex: "last_activity",
          render: (lastProofDate) =>
            dayjs(lastProofDate).format("DD/MM/YYYY HH:mm"),
        },
        {
          title: "Rate",
        },
      ]}
      {...props}
    />
  )
}
