import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/sdk"

class TonProofApiService {
  private localStorageKey = "api-access-token"

  private host = import.meta.env.VITE_API_URL

  public accessToken: string | null = null

  public connectWalletRequest: Promise<ConnectAdditionalRequest> =
    Promise.resolve({})

  constructor() {
    this.accessToken = localStorage.getItem(this.localStorageKey)

    if (!this.accessToken) {
      this.generatePayload()
    }
  }

  generatePayload() {
    this.connectWalletRequest = new Promise(async (resolve) => {
      const response = await (
        await fetch(`${this.host}/tonProof`, {
          method: "POST",
          headers: {
            "X-Service-Method": "generatePayload",
          },
        })
      ).json()

      resolve({ tonProof: response.payload as string })
    })
  }

  async checkProof(proof: TonProofItemReplySuccess["proof"], account: Account) {
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        proof,
      }

      const response = await (
        await fetch(`${this.host}/tonProof`, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
            "X-Service-Method": "checkProof",
          },
        })
      ).json()
      if (response?.token) {
        localStorage.setItem(this.localStorageKey, response.token)
        this.accessToken = response.token
      }
    } catch (e) {
      console.log("checkProof error:", e)
    }
  }

  reset() {
    console.log("reset")
    this.accessToken = null
    localStorage.removeItem(this.localStorageKey)
    this.generatePayload()
  }
}

const TonProofService = new TonProofApiService()
export default TonProofService
