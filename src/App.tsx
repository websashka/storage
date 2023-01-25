import React, {useEffect, useState} from 'react'
import {TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Button, Form, Input, InputNumber, Layout, Space, Table, Upload, Typography, Checkbox, Switch} from "antd";
import TonWeb from "tonweb";
import FilesTable from "./components/FilesTable";
import TonProofService from "./services/TonProofService";
import app from "./feathers";
import Uploader from "./ui/Uploader/Uploader";
import {OP_CODES} from "./constants";
import dayjs from "dayjs";
import {UploadFile} from "antd/es/upload/interface";


const ton = new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: process.env.VITE_TONCENTER_TESTNET_API_KEY}));


const { Link } = Typography


const base64ToHex = (base64: string) => TonWeb.utils.bytesToHex((TonWeb.utils.base64ToBytes(base64)));


function getBytes(file: File) {
  console.log(file)
  return new Promise<Uint8Array>((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      if(fr.result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(fr.result)
        resolve(bytes);
      }
    }
    fr.readAsArrayBuffer(file);
  });
}

function App() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const { data, isLoading, error, refetch } = useQuery(['torrents'], async () => await app.service("torrent").find() );
  const queryClient = useQueryClient();
  const onSubmit = async ({ files }: { files: any }) => {
    const data = new FormData();

    try {
      await Promise.all(files.fileList
          .map(async (file: UploadFile) =>
            await getBytes(file.originFileObj as File).then(async (data) =>
              await window.openmask.provider.send("ton_encryptMessage", {
                message: TonWeb.utils.bytesToBase64(data)
              })
            ).then((encrypted) => {
              const encryptedFile = new File([encrypted], file.name)
              data.append(file.name, encryptedFile)
            })
          )
      )

      await fetch(`${process.env.VITE_API_URL}/torrent`, {
        method: "POST",
        body: data,
        headers: {
          ["Authentication"]: `Bearer ${localStorage.getItem("api-access-token")}`
        }
      }).then((res) => res.json()).then(async (res) => {
        const initMessage = res.result.payload;
        const txRes = await window.openmask.provider.send("ton_sendTransaction", {
          to: "EQCEl-0FeJxX99YEYWVLlzMJcDI-AeAZlTMKG9BapyD8UjUv",
          value: "1000000000",
          data: initMessage,
          dataType: "boc"
        })
        console.log(txRes)
        await refetch();
      })
    } catch (e) {
      console.log(e)
    }
  };


  useEffect(() =>
    tonConnectUI.onStatusChange(async wallet => {
      if (!wallet) {
        TonProofService.reset();
        return;
      }

      if (wallet.connectItems?.tonProof && 'proof' in wallet.connectItems.tonProof) {
        await TonProofService.checkProof(wallet.connectItems.tonProof.proof, wallet.account);
      }

      if (!TonProofService.accessToken) {
        await tonConnectUI.disconnect();
        return;
      }

    }), []);


  const onClose = async (address: string) => {
    const addressContract = new TonWeb.Address(address).toString(true, true, true)

    const cell = new TonWeb.boc.Cell();
    cell.bits.writeUint(OP_CODES.CLOSE_CONTRACT, 32)
    cell.bits.writeUint((new Date().getTime() / 1e3).toFixed(0), 64)
    const message = await cell.toBoc();
    const txRes = await window.openmask.provider.send("ton_sendTransaction", {
      to: addressContract,
      value: "30000000",
      data: TonWeb.utils.bytesToBase64(message),
      dataType: "boc"
    })
  };

  const onTopUp = async (address: string) => {
    const addressContract = new TonWeb.Address(address).toString(true, true, true)

    const cell = new TonWeb.boc.Cell();
    cell.bits.writeUint(OP_CODES.TOPUP_BALANCE, 32)
    cell.bits.writeUint((new Date().getTime() / 1e3).toFixed(0), 64)
    const message = await cell.toBoc();
    const txRes = await window.openmask.provider.send("ton_sendTransaction", {
      to: addressContract,
      value: "30000000",
      data: TonWeb.utils.bytesToBase64(message),
      dataType: "boc"
    })
  }

  return (
    <Layout>
      <Layout.Header>
        <TonConnectButton />
      </Layout.Header>
      <Layout.Content>
        <Form onFinish={onSubmit}>
          <Form.Item name="amount">
            <InputNumber />
          </Form.Item>
          <Form.Item name="encrypt">
            <Switch />
          </Form.Item>
          <Form.Item name="files">
            <Uploader />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Upload </Button>
          </Form.Item>
        </Form>
        <Table
          loading={isLoading}
          rowKey="torrent"
          expandable={{
            expandedRowRender: (record, index, indent, expanded) =>
              <FilesTable bagId={base64ToHex(record.torrent)}/>,
          }}
          dataSource={data?.torrents}
          columns={[
            {
              title: "BagID",
              dataIndex: "torrent",
              render: (torrent) => base64ToHex(torrent).toUpperCase()
            },
            {
              title: "Created time",
              dataIndex: "created_time",
              render: (time) => dayjs.unix(time).format()
            },
            {
              title: "contract_balance",
              dataIndex: "contract_balance",
              render: (balance) => TonWeb.utils.fromNano(balance)
            },
            {
              title: "client_balance",
              dataIndex: "client_balance",
              render: (balance) => TonWeb.utils.fromNano(balance)
            },
            {
              title: "Action",
              dataIndex: "address",
              render: (address, record) => <>
                <Button onClick={() => onTopUp(address)}>TopUp</Button>
                <Button onClick={() => onClose(address)}>Close</Button>
                <Link target="_blank" href={`https://testnet.ton.cx/address/${record.address}`}>Explorer</Link>
              </>
            }
          ]}
        />
      </Layout.Content>
      <Layout.Footer>

      </Layout.Footer>
    </Layout>
  )
}

export default App
