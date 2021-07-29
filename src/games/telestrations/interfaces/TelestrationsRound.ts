import { TelestrationsRoundType } from '../enums/TelestrationsRoundType';

export interface TelestrationsRound {
  roundNumber: number;
  roundType: TelestrationsRoundType;
  word?: string;
  drawing?: string;
}