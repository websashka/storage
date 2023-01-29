import React from "react"
import Upload from "rc-upload"
import { UploadProps } from "rc-upload/es/interface"

interface UploaderProps
  extends Omit<UploadProps, "multiple" | "beforeUpload"> {}

const Uploader = ({ ...props }: UploaderProps) => (
  <Upload {...props} multiple={true} beforeUpload={() => false} />
)

export default Uploader
