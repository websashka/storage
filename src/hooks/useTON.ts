import {useContext, useEffect, useState} from "react";
import {TonContext} from "../components/TonProvider";
const useTON = () => {
  const [state, setState] = useState({});
  const { client } = useContext(TonContext);

  useEffect(() => {
    const account = localStorage.getItem("account");

    if(account) {
      // client.send("getTransactions", account).then(txs => console.log(txs))
      setState((state) => ({...state, address: account}));
    }
  }, []);

  const onToggleConnect = async () => {
    if(state.address) {
      localStorage.removeItem("account");
      setState((state) => ({...state, address: null }));
    } else {
      const accounts = await client.send("ton_requestAccounts");
      const account = accounts[0];



      localStorage.setItem("account", account);
      setState((state) => ({...state, address: account }));
    }
  };

  return {
    ...state,
    onToggleConnect
  }
};

export default useTON;
