import { Account } from '../../../shared/interfaces/Account';
import { TelestrationsRound } from './TelestrationsRound';

interface ResultRound {
  player: Account;
  word?: string;
  drawing?: string;
}

export interface TelestrationsResult {
  player: Account;
  word: string;
  finalRound: TelestrationsRound;

  rounds: ResultRound[];
}