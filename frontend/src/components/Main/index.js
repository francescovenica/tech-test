import React, { useCallback, useRef, useState, useEffect } from 'react';
import './styles.scss';
import useWindowSize from '../../hooks/useWindowSize';

const Main = ({ items, onFiguraClick }) => {
  const { width } = useWindowSize();
  const canvasRef = useRef();
  const animationRef = useRef();
  const [figure, setFigure] = useState(items);
  const [canvasCtx, setCanvasCtx] = useState(null);
  const [canvasSize, setCanvasSize] = useState({});

  const draw = useCallback(() => {
    if (!canvasCtx) return;

    const updateObject = ({ y, color, height, offset, peso, inProgress }) => {
      const canvasWidth = canvasSize.width;
      const widthFigura = canvasWidth / 5;
      const x = (offset % 5) * widthFigura;

      canvasCtx.beginPath();

      canvasCtx.fillStyle = inProgress ? 'red' : `#${color}`;
      canvasCtx.fillRect(x, y, widthFigura, height);

      canvasCtx.font = "30px Arial";
      canvasCtx.fillStyle = 'black';
      canvasCtx.textAlign = "center";
      canvasCtx.textBaseline = 'middle';
      canvasCtx.fillText(peso, x + widthFigura / 2, y + height / 2, widthFigura);
    }

    canvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    figure.forEach((element, index) => {

      let bottom = canvasSize.height;

      let i = index;
      while (i >= 0) {
        if (figure[i] && (!figure[i].archived)) {
          bottom = bottom - figure[i].height
        }
        i = i - 5;
      }

      if ((figure[index].y) < bottom) {
        figure[index].y = figure[index].y + figure[index].speed;
        figure[index].moving = true;
      }

      if (!element.archived) {
        updateObject(element);
      }
    });

    if (figure.length > 0) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [canvasCtx, figure, canvasSize.height, canvasSize.width])

  useEffect(() => {
    const mainCanvas = document.getElementById('mainCanvas');

    setCanvasCtx(canvasRef.current.getContext('2d'));
    setCanvasSize({
      width: window.devicePixelRatio * mainCanvas.offsetWidth,
      height: window.devicePixelRatio * mainCanvas.offsetHeight
    });

    if (canvasRef && canvasSize) {
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setFigure(items)

    draw();

  }, [items, items.length, canvasCtx, draw, width]);

  return (
    <div className="mainCanvasContianer">
      <canvas
        ref={canvasRef}
        id="mainCanvas"
        className="mainCanvas"
        onClick={e => {
          const currentTargetRect = e.currentTarget.getBoundingClientRect();
          const mousePos = {
            x: e.pageX - currentTargetRect.left,
            y: e.pageY - currentTargetRect.top
          };

          const widthFigura = (canvasSize.width / window.devicePixelRatio) / 5;

          figure.forEach((figura, i) => {

            const top = figura.y / window.devicePixelRatio;
            const bottom = top + (figura.height / window.devicePixelRatio);
            const left = (figura.offset % 5) * widthFigura;
            const right = left + widthFigura;

            if (top < mousePos.y && mousePos.y < bottom && left < mousePos.x && mousePos.x < right) {
              onFiguraClick(i);
            }
          });
        }}
      />
    </div>
  );
}

export default Main;
