import React, {useEffect, useState} from 'react'
import {TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {
  base64ToBytes,
  deserializeBoc,
  bytesToHex,
  Slice,
  bytesToBase64,
  stringToBase64,
  base64toString, ALL, hexToBytes
} from '@openproduct/web-sdk';
import {decodeBase64, decodeUTF8} from "tweetnacl-util";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Button, Form, Input, InputNumber, Layout, Space, Table, Upload, Typography, Checkbox, Switch} from "antd";
import TonWeb from "tonweb";
import FilesTable from "./components/FilesTable";
import {Buffer} from "buffer";
import TonProofService from "./services/TonProofService";
import app from "./feathers";
import Uploader from "./ui/Uploader/Uploader";
import {OP_CODES} from "./constants";
import dayjs from "dayjs";


const ton = new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: import.meta.env.VITE_TONCENTER_TESTNET_API_KEY}));


const { Link } = Typography

export const findContract = async (
  publicKey,
)=> {
  for (let [version, WalletClass] of Object.entries(ALL)) {
    const wallet = new WalletClass(ton, {
      publicKey,
      wc: 0,
    });

    const walletAddress = await wallet.getAddress();
    console.log(walletAddress.toString(true, true, true))
    const balance = await ton.getBalance(walletAddress.toString());
    if (balance !== "0") {
      return [version, walletAddress];
    }
  }

  const WalletClass = ALL["v4R2"];
  const walletContract = new WalletClass(ton, {
    publicKey,
    wc: 0,
  });
  const address = await walletContract.getAddress();
  return address.toString(true, true, true);
};


const base64ToHex = (base64: string) => bytesToHex(decodeBase64(base64));

const getTorrents = async () => {
  try {
    return await app.service("torrent").find()
  } catch (e) {
    console.log(e)
  }
}

const getBag = async ({queryKey}) => {
  return fetch(`${import.meta.env.VITE_API_URL}/api/get/${queryKey[1]}`).then(res => res.json()).then(res => res.result)
}

function getBytes(file: File) {
  console.log(file)
  return new Promise<Uint8Array>((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const bytes = new Uint8Array(fr.result)
      resolve(bytes);
    }
    fr.readAsArrayBuffer(file);
  });
}

function App() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const { data, isLoading, error, refetch } = useQuery(['torrents'], getTorrents);
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<void, Error, string>(async (bagId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/remove/${bagId}`, {
      method: "DELETE",
    })
  }, {
    onSuccess: async (data, bagId, context) => queryClient.setQueryData("torrents",   (response: any) => {
      const hash = Buffer.from(bagId, "hex").toString("base64")
      return {
        ...response,
        torrents: response.torrents.filter((torrent) => torrent.hash !== hash)
      }
    })
  });
  const onSubmit = async ({ files }) => {
    const data = new FormData();

    try {
      await Promise.all(files.fileList
          .map(async (file) =>
            await getBytes(file.originFileObj as File).then(async (data) =>
              await window.openmask.provider.send("ton_encryptMessage", {
                message: bytesToBase64(data)
              })
            ).then((encrypted) => {
              const encryptedFile = new File([encrypted], file.name)
              data.append(file.name, encryptedFile)
            })
          )
      )

      await fetch(`${import.meta.env.VITE_API_URL}/torrent`, {
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
