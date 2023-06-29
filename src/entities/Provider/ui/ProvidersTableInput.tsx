import React from "react"
import { RadioGroup, RadioGroupItem } from "shared/ui"
import { ProvidersTable } from "./ProvidersTable"

export const ProvidersTableInput = ({ ...props }) => {
  return (
    <RadioGroup {...props}>
      <ProvidersTable
        columns={[
          {
            dataIndex: "address",
            render: (address: string) => <RadioGroupItem value={address} />,
          },
        ]}
      />
    </RadioGroup>
  )
}
