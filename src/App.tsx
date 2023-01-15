import React, {useEffect, useState} from 'react'
import {TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {base64ToBytes, deserializeBoc, bytesToHex, Slice, bytesToBase64} from '@openproduct/web-sdk';
import nacl, {box, randomBytes} from "tweetnacl";
import {decodeBase64, decodeUTF8} from "tweetnacl-util";
import {Simulate} from "react-dom/test-utils";
import encrypted = Simulate.encrypted;


function getBytes(file: File) {
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

function downloadBase64File(contentBase64, fileName) {
  const linkSource = `data:application/pdf;base64,${contentBase64}`;
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = '_self';
  downloadLink.download = fileName;
  downloadLink.click();
}

function App() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const data = new FormData();


    try {
      await Promise.all(
        Array.from(e.target.fileInput.files)
          .map(async (file) =>
            await getBytes(file as File).then(async (data) =>
              await window.openmask.provider.send("ton_encryptMessage", {
                data: bytesToBase64(data)
              })
            ).then((encrypted) => {
              const encryptedFile = new File([encrypted], file.name)
              data.append(file.name, encryptedFile)
            })
          )
      )


      await fetch(`${import.meta.env.VITE_API_URL}/api/create`, {
            method: "POST",
            body: data
          })

      // await Promise.all(res.map(async (encrypted) => await window.openmask.provider.send("ton_decryptMessage", {
      //   data: encrypted
      // }).then((decrypted) => downloadBase64File(decrypted, "pdf.pdf"))))
    } catch (e) {
      console.log(e)
    }



    //
    // try {
    //   await fetch(`${import.meta.env.VITE_API_URL}/api/create`, {
    //     method: "POST",
    //     body: data
    //   })
    // } catch (e) {
    //   console.log(e)
    // }

  };


  const onDownload = async () => {

  };


  return (
    <>
      <header>
        <TonConnectButton />
      </header>
      <main>
        All your files:
        <form action="" onSubmit={onSubmit}>
          <input name="fileInput" multiple type="file" />
          <button type="submit">Upload </button>
        </form>
        <button onClick={onDownload}>Download</button>
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App
