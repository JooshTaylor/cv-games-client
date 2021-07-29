import { Account } from "../../../shared/interfaces/Account";
import { LobbyStatus } from "../enums/LobbyStatus";

export interface Lobby {
  id: string;
  status: LobbyStatus;
  players: Account[];
  totalRounds: number;
  currentRound: number;
}