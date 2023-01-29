import TonWeb from "tonweb"

export const base64ToHex = (base64: string) =>
  TonWeb.utils.bytesToHex(TonWeb.utils.base64ToBytes(base64))
