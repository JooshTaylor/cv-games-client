import { Account } from "../../../shared/interfaces/Account";

export const AccountHelper = {
  getPlayerForLobby(lobbyId: string | string[] | undefined): Account {
    // const account = window.sessionStorage.getItem(`account:${lobbyId}`);
    const account = '123';

    if (typeof(account) === 'string')
      return JSON.parse(account);

    return null as any;
  },

  setPlayerForLobby(lobbyId: string, account: Account): void {
    AccountHelper.clearPlayer(lobbyId);
    // window.sessionStorage.setItem(`account:${lobbyId}`, JSON.stringify(account));
  },

  clearPlayer(lobbyId: string): void {
    // window.sessionStorage.removeItem(`account:${lobbyId}`);
  }
};