import React, {useEffect, useState} from "react";
import tonweb from "tonweb";
export const TonContext = React.createContext({ client: null});

interface TonProviderProps extends React.PropsWithChildren {

}
const TonProvider = ({ children, client }: TonProviderProps) => {
  const [address, setAddress] = useState();
  const provider = new tonweb(client)

  return <TonContext.Provider value={{client}}>
    {children}
  </TonContext.Provider>
}

export default TonProvider;
