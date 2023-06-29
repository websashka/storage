import React from "react"
import { Controller, useForm } from "react-hook-form"
import { ProvidersTable, ProvidersTableInput } from "entities/Provider"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../shared/ui"

interface ReplicationProps {
  open: boolean
  onOpenChange: (value: boolean) => void
}

export const Replication = ({ open, onOpenChange }: ReplicationProps) => {
  const { formState, control, handleSubmit, reset } = useForm()

  const onSubmit = (values: any) => {
    console.log(values)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        reset()
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>Select some provider for</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="provider"
            render={({ field: { onChange, ...field } }) => (
              <ProvidersTableInput {...field} onValueChange={onChange} />
            )}
          />
          <DialogFooter>
            <Button type="submit">Next</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
