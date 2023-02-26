import BN from "bn.js"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import prettyBytes from "pretty-bytes"
import React, { useContext } from "react"
import TonWeb from "tonweb"
import { ProviderContext } from "entities/Provider"
import { ReactComponent as TonCoin } from "shared/assets/icons/ton-coin.svg"
import { Card, Statistic } from "shared/ui"
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const ProviderCard = ({
  className,
}: React.HTMLProps<HTMLDivElement>) => {
  const { provider } = useContext(ProviderContext)

  if (!provider) {
    return null
  }

  return (
    <Card className={className}>
      <Statistic
        items={[
          {
            key: "per MB/day",
            value: (
              <>
                {TonWeb.utils.fromNano(new BN(provider.rate))}
                <TonCoin className="inline" />
              </>
            ),
          },
          {
            key: "Max. span between proofs",
            value: dayjs.duration(provider.maxSpan, "seconds").humanize(),
          },
          {
            key: "Min file size",
            value: prettyBytes(provider.minimalFileSize),
          },
          {
            key: "Max file size",
            value: prettyBytes(provider.maximalFileSize),
          },
        ]}
      />
    </Card>
  )
}
