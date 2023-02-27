import Upload from "rc-upload"
import { UploadProps } from "rc-upload/es/interface"
import React from "react"

interface UploaderProps
  extends Omit<UploadProps, "multiple" | "beforeUpload"> {}

export const Uploader = ({ ...props }: UploaderProps) => (
  <Upload {...props} multiple={true} beforeUpload={() => false} />
)
