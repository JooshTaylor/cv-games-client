import { DrawWord } from "@/games/telestrations/components/draw-word/DrawWord";
import { TelestrationsRoundType } from "@/games/telestrations/enums/TelestrationsRoundType";
import { TelestrationsRound } from "@/games/telestrations/interfaces/TelestrationsRound";

export default function Drawing(): JSX.Element {
  const round: TelestrationsRound = {
    roundNumber: 1,
    roundType: TelestrationsRoundType.DrawWord,
    word: 'Apple'
  };
  
  function onSubmit(drawingBase64: string): void {
    console.log(drawingBase64);
  }

  return (
    <DrawWord round={round} onSubmitDrawing={onSubmit} />
  );
}