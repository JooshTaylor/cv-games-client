import React from 'react';
import { TelestrationsRound } from '../../interfaces/TelestrationsRound';

import styles from './canvas.module.scss';

interface DrawWordProps {
  round: TelestrationsRound;
  onSubmitDrawing: (drawingImageUrl: string) => void;
}

export function DrawWord(props: DrawWordProps): JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [ isPainting, setIsPainting ] = React.useState(false);
  const [ lastX, setLastX ] = React.useState(0);
  const [ lastY, setLastY ] = React.useState(0);
  const [ lineThickness, setLineThickness ] = React.useState(1);

  const [ lockCanvas, setLockCanvas ] = React.useState(true);

  React.useEffect(() => {
    setLockCanvas(!!props.round.drawing);
  }, []);

  React.useEffect(() => {
    if (!canvasRef.current)
      return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = canvas.height = 600;
    ctx.fillRect(0, 0, 600, 600);
  }, [canvasRef.current]);

  function onMouseDown(e: any) {
    console.log(canvasRef.current, lockCanvas);
    if (!canvasRef.current || lockCanvas)
      return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D

    setIsPainting(true);
    ctx.fillStyle = '#ffffff';
    setLastX(e.pageX - canvasRef.current.offsetLeft);
    setLastY(e.pageY - canvasRef.current.offsetTop);
  }

  function onMouseUp(e: any) {
    if (lockCanvas)
      return;

    setIsPainting(false);
  }

  function onMouseMove(e: any) {
    if (!canvasRef.current || lockCanvas)
      return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D
    if (isPainting) {
      const mouseX = e.pageX - canvasRef.current.offsetLeft;
      const mouseY = e.pageY - canvasRef.current.offsetTop;

      // find all points between   
      let x1 = mouseX,
          x2 = lastX,
          y1 = mouseY,
          y2 = lastY;

      let steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
      if (steep){
          let x = x1;
          x1 = y1;
          y1 = x;

          let y = y2;
          y2 = x2;
          x2 = y;
      }
      if (x1 > x2) {
          let x = x1;
          x1 = x2;
          x2 = x;

          let y = y1;
          y1 = y2;
          y2 = y;
      }

      let dx = x2 - x1,
          dy = Math.abs(y2 - y1),
          error = 0,
          de = dy / dx,
          yStep = -1,
          y = y1;
      
      if (y1 < y2) {
          yStep = 1;
      }

      let newLineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
    
      if (newLineThickness < 1){
        newLineThickness = 1;   
      }

      for (let x = x1; x < x2; x++) {
          if (steep) {
              ctx.fillRect(y, x, lineThickness , lineThickness );
          } else {
              ctx.fillRect(x, y, lineThickness , lineThickness );
          }
          
          error += de;
          if (error >= 0.5) {
              y += yStep;
              error -= 1.0;
          }
      }

      setLastX(mouseX);
      setLastY(mouseY);
      setLineThickness(newLineThickness);
    }
  }

  function onClickDone(e: any): void {
    e.preventDefault();

    if (!canvasRef.current || lockCanvas)
      return;

    setLockCanvas(true);
    props.onSubmitDrawing(canvasRef.current.toDataURL());
  }

  return (
    <>
      <h2>
        {lockCanvas
          ? <>Drawing submitted! Waiting for other players...</>
          : <>Draw word: {props.round.word}</>
        }
      </h2>

      <canvas
        className={styles.canvas}
        id='canvas'
        height='600'
        width='600'
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
      </canvas>

      <div>
        <button className='btn btn-primary' onClick={onClickDone} disabled={lockCanvas}>Submit Drawing</button>
      </div>
    </>
  );
}