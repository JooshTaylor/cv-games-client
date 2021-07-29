import { Account } from "../../../shared/interfaces/Account";

export const AccountHelper = {
  getPlayerForLobby(lobbyId: string): Account {
    const account = window.localStorage.getItem(`account:${lobbyId}`);

    if (typeof(account) === 'string')
      return JSON.parse(account);

    return null as any;
  },

  setPlayerForLobby(lobbyId: string, account: Account): void {
    AccountHelper.clearPlayer(lobbyId);
    window.localStorage.setItem(`account:${lobbyId}`, JSON.stringify(account));
  },

  clearPlayer(lobbyId: string): void {
    window.localStorage.removeItem(`account:${lobbyId}`);
  }
};