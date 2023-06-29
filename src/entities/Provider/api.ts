import { useQuery } from "react-query"
import { app } from "shared/lib"

export const useProviders = () =>
  useQuery(["providers"], async () => {
    return await app.service("providers").find()
  })
