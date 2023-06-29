import authentication, {
  AuthenticationClient,
} from "@feathersjs/authentication-client"
import { FeathersError } from "@feathersjs/errors"
import { feathers, Params, ServiceInterface } from "@feathersjs/feathers"
import restClient from "@feathersjs/rest-client"

const client = restClient(import.meta.env.VITE_API_URL).fetch(
  window.fetch.bind(window)
)

const authClient = restClient(
  import.meta.env.VITE_AUTH_URL || `${import.meta.env.VITE_API_URL}/auth`
).fetch(window.fetch.bind(window))

interface TorrentService extends ServiceInterface {
  getFile: (data?: any, params?: Params) => Promise<string>
}

interface ProviderService extends ServiceInterface {}

const app = feathers<{
  torrent: TorrentService
  provider: ProviderService
  tonProof: any
  providers: ServiceInterface
  auth: any
}>()

app.configure(client)

app.use("auth", authClient.service("authentication"))

class MyAuthenticationClient extends AuthenticationClient {
  handleError(error: FeathersError, type: "authenticate" | "logout") {
    if (error.code === 401) {
      app.emit("AuthError")
    }
    return super.handleError(error, type)
  }
}

app.configure(
  authentication({
    path: "auth",
    Authentication: MyAuthenticationClient,
    storage: window.localStorage,
  })
)

app.use("torrent", client.service("torrent") as TorrentService, {
  methods: ["get", "find", "create", "getFile"],
})

app.configure((app) => {
  app.use("tonProof", authClient.service("tonProof"), {
    methods: ["generatePayload"],
  })
})

app.use("provider", client.service("provider") as ProviderService, {
  methods: ["get"],
})

export { app }
