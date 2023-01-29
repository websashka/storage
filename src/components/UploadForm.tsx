import React, { useState } from "react"
import Uploader from "../ui/Uploader"
import TonWeb from "tonweb"
import { Button } from "@/ui/Button"
import { Switch } from "@/ui/Switch"
import { UploadCloudIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/Dialog"
import { Label } from "@/ui/Label"
import { Input } from "@/ui/Input"
import prettyBytes from "pretty-bytes"
import { Controller, useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"

function getBytes(file: File) {
  return new Promise<Uint8Array>((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = () => {
      if (fr.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(fr.result)
        resolve(bytes)
      }
    }
    fr.readAsArrayBuffer(file)
  })
}

interface UploadFormState {
  isEncrypt: boolean
  initialBalance: number
}
interface UploadFormProps extends React.HTMLProps<HTMLBaseElement> {}

const UploadForm = ({ className }: UploadFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm<UploadFormState>()
  const onSubmit = async ({ initialBalance, isEncrypt }: UploadFormState) => {
    const data = new FormData()

    if (files.length === 0) {
      throw new Error("No files")
    }
    if (isEncrypt) {
      try {
        await Promise.all(
          files.map(
            async (file) =>
              await getBytes(file)
                .then(async (data) => {
                  return await window.openmask.provider.send(
                    "ton_encryptMessage",
                    {
                      message: TonWeb.utils.bytesToBase64(data),
                    }
                  )
                })
                .then((encrypted) => {
                  const encryptedFile = new File([encrypted], file.name)
                  data.append(file.name, encryptedFile)
                })
          )
        )
      } catch (e) {
        console.error(e)
      }
    }

    if (!isEncrypt) {
      files.forEach((file) => {
        data.append(file.name, file)
      })
    }
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/torrent?providerAddress=${
          import.meta.env.VITE_PROVIDER_ADDRESS
        }&queryId=0`,
        {
          method: "POST",
          body: data,
          headers: {
            ["Authentication"]: `Bearer ${localStorage.getItem(
              "api-access-token"
            )}`,
          },
        }
      )
        .then((res) => res.json())
        .then(async (res) => {
          const initMessage = res.result.payload
          const txRes = await window.openmask.provider.send(
            "ton_sendTransaction",
            {
              to: import.meta.env.VITE_PROVIDER_ADDRESS,
              value: TonWeb.utils.toNano(initialBalance).toString(),
              data: initMessage,
              dataType: "boc",
            }
          )
          console.log(txRes)
        })
    } catch (e) {
      console.log(e)
    }
    setIsOpen(false)
  }

  return (
    <>
      <Uploader
        onBatchStart={(items) => {
          setFiles(items.map((item) => item.file))
          setIsOpen(true)
          reset()
        }}
      >
        <Button className={className} type="button" icon={<UploadCloudIcon />}>
          Upload
        </Button>
      </Uploader>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value)
          setFiles([])
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create new bag</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ul>
                {files.map((file) => (
                  <li>
                    {file.name} ({prettyBytes(file.size)})
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-2">
                <Label>Encrypt files?</Label>
                <Controller
                  control={control}
                  name="isEncrypt"
                  render={({ field: { onChange } }) => (
                    <Switch onCheckedChange={onChange} />
                  )}
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Label>Initial balance</Label>
                  <Input
                    {...register("initialBalance", {
                      required: "This field is required",
                    })}
                  />
                </div>
                {errors?.initialBalance?.message}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Sign contract</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {import.meta.env.DEV && <DevTool control={control} />}
    </>
  )
}

export default UploadForm
