import { useQuery } from "react-query"
import app from "../../shared/lib/feathers"

export const useTorrents = (account?: string) =>
  useQuery([account], async () => await app.service("torrent").find())
