import restClient from "@feathersjs/rest-client"
import authentication, {
  AuthenticationClient,
} from "@feathersjs/authentication-client"
import {
  feathers,
  FeathersService,
  HookContext,
  NextFunction,
  Params,
  ServiceInterface,
} from "@feathersjs/feathers"

const client = restClient(import.meta.env.VITE_API_URL).fetch(
  window.fetch.bind(window)
)
interface TorrentService extends ServiceInterface {
  getFile: (data?: any, params?: Params) => Promise<string>
}

interface ProviderService extends ServiceInterface {}

const app = feathers<{
  torrent: TorrentService
  provider: ProviderService
}>()

app.configure(client)

const setHeader = () => {
  return (context: HookContext, next: NextFunction) => {
    context.params.headers = Object.assign(
      {},
      {
        ["Authentication"]: `Bearer ${localStorage.getItem(
          "api-access-token"
        )}`,
      },
      context.params.headers
    )

    return next()
  }
}
app.configure((app) => {
  app.hooks([setHeader()])
})

app.use("torrent", client.service("torrent") as TorrentService, {
  methods: ["get", "find", "create", "getFile"],
})

app.use("provider", client.service("provider") as ProviderService, {
  methods: ["get"],
})

export default app
