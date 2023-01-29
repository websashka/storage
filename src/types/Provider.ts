import { QueryResponse } from "@/types/common"

export type ProviderParamsResponse = QueryResponse<{
  ["@type"]: "storage.daemon.provider.params"
  accept_new_contracts: boolean
  max_span: number
  maximal_file_size: string
  minimal_file_size: string
  rate_per_mb_day: string
}>

export interface ProviderParams {
  maxSpan: number
  rate: number
  acceptNewContracts: boolean
  maximalFileSize: number
  minimalFileSize: number
}
