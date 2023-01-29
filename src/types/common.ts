export interface QueryResponse<R> {
  ok: boolean
  code: number
  result: R
}
