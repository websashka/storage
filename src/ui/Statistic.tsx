import React from "react"

interface StatisticProps extends React.HTMLProps<HTMLDivElement> {
  items: { key: string | React.ReactNode; value: string | React.ReactNode }[]
}

const Statistic = ({ items }: StatisticProps) => (
  <dl
    className={`grid grid-cols-${
      items.length || 4
    } max-w-screen-xl gap-8 p-4 mx-auto text-gray-900 dark:text-white sm:p-8`}
  >
    {items.map(({ key, value }) => (
      <div className="flex flex-col items-center justify-items-stretch">
        <dt className="mb-2 text-3xl font-extrabold">{value}</dt>
        <dd className="font-light text-gray-500 dark:text-gray-400">{key}</dd>
      </div>
    ))}
  </dl>
)

export { Statistic }
