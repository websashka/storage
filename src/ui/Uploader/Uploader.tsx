import React from "react";
import {Upload} from "antd";


const Uploader = ({ ...props }) => <Upload.Dragger
  { ...props }
  multiple={true}
  beforeUpload={() => false}
/>;

export default Uploader;
