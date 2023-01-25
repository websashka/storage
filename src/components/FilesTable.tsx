import React from "react";
import {Button, Table} from "antd";
import {useQuery} from "react-query";
import app from "../feathers";

const downloadBase64File =(contentBase64: string, fileName: string) => {
  const linkSource = `data:application/pdf;base64,${contentBase64}`;
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = '_self';
  downloadLink.download = fileName;
  downloadLink.click();
}


const useGetBag = (bagId: string) => {
  return useQuery([bagId], async () => {
    return await app.service("torrent").get(bagId);
  })
}

interface FilesTableProps {
  bagId: string;
}

const FilesTable = ({ bagId }: FilesTableProps) => {
  const { data, isLoading } = useGetBag(bagId);

  const onDownload = (filename: string) => {
    app.service("torrent").getFile(null,{
      query: {
        bagId,
        filename
      }
    }).then(async (base64) => {
        const decryptedBase64 = await window.ton.send("ton_decryptMessage", {
          message: base64
        });
        await downloadBase64File(decryptedBase64, filename);
      })
  };

  return(<Table
    loading={isLoading}
    dataSource={data?.result?.files}
    columns={[{
      title: "Name",
      dataIndex: "name"
    },
      {
        title: "Size",
        dataIndex: "size"
      },{
      title: "",
      dataIndex: "name",
      render: (filename) => {
        return <>
          <Button onClick={() => onDownload(filename)}>Download</Button>
          </>
      }
    }]}
  />)
};

export default FilesTable;
