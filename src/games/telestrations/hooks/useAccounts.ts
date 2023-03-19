import useStorage from "@/shared/hooks/useStorage";
import { Account } from "@/shared/interfaces/Account";

export const useAccounts = () => {
  const storage = useStorage('session')

  function getPlayerForLobby(lobbyId: string | string[] | undefined): Account {
    const account = storage.getItem(`account:${lobbyId}`);

    console.log(account);

    // if (typeof(account) === 'string')
    //   return JSON.parse(account);

    return null as any;
  }

  function setPlayerForLobby(lobbyId: string, account: Account): void {
    clearPlayer(lobbyId);
    storage.setItem(`account:${lobbyId}`, JSON.stringify(account));
  }

  function clearPlayer(lobbyId: string): void {
    storage.removeItem(`account:${lobbyId}`);
  }

  return {
    getPlayerForLobby,
    setPlayerForLobby,
    clearPlayer
  }  
};