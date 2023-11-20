import { useEffect, useState } from "react";
import "./styles.css";

function Field() {
  return (
    <table className="field">
      <tbody>
        <tr>
          <td className="tl"></td>
          <td className="tr"></td>
        </tr>
        <tr>
          <td className="ml"></td>
          <td></td>
        </tr>
        <tr>
          <td className="ml"></td>
          <td></td>
        </tr>
        <tr>
          <td className="bl"></td>
          <td className="br"></td>
        </tr>
      </tbody>
    </table>
  );
}

function Paddle({ x, y }) {
  return (
    <div
      className="paddle"
      style={{
        left: x,
        top: y
      }}
    ></div>
  );
}

function Timer({ numerGry }) {
  let [cnt, setCnt] = useState(0);
  let [ostatniNumer, setOstatniNumer] = useState(-1);

  if (ostatniNumer !== numerGry) {
    setCnt(0);
    setOstatniNumer(numerGry);
  }
  let min = Number.parseInt(cnt / 60);
  let sec = cnt % 60;

  useEffect(() => {
    let t = setTimeout(() => {
      setCnt(cnt + 1);
    }, 1000);
    return () => {
      clearTimeout(t);
    };
  }, [cnt]);

  return (
    <div className="timer">
      Time: {min} m {sec} s
    </div>
  );
}

function Controls({ left, right, onRestart }) {
  return (
    <div className="controls">
      <button>Pause</button>
      <span
        style={{ width: "70%", display: "inline-block", textAlign: "center" }}
      >
        {left} : {right}
      </span>
      <button style={{ float: "right" }} onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}

function Ball({ x, y }) {
  return <div className="ball" style={{ left: x, top: y }}></div>;
}

export default function App() {
  let [rightY, setRightY] = useState(100);
  let [leftY, setLeftY] = useState(100);
  let [numerGry, setNumberGry] = useState(0);
  let [x, setX] = useState(200);
  let [y, setY] = useState(100);
  let [dx, setDx] = useState(1);
  let [dy, setDy] = useState(1);
  let [right, setRight] = useState(0);
  let [left, setLeft] = useState(0);

  useEffect(() => {
    let klawisz = (event) => {
      // L - 76
      // P - 80
      // A - 65
      // Q - 81
      console.log(event.which);
      if (event.which === 76) setRightY(rightY + 5);
      if (event.which === 80) setRightY(rightY - 5);
      if (event.which === 65) setLeftY(leftY + 5);
      if (event.which === 81) setLeftY(leftY - 5);
    };

    document.addEventListener("keydown", klawisz);

    return () => {
      document.removeEventListener("keydown", klawisz);
    };
  }, [rightY, leftY]);

  useEffect(() => {
    let t = setTimeout(() => {
      x = x + dx;
      y = y + dy;

      if (x == 20 && dx < 0 && Math.abs(leftY - y) < 20) {
        console.log("Odbijam lewą..");
        setDx(-dx);
      }

      if (x == 360 && dx > 0 && Math.abs(rightY - y) < 20) {
        console.log("Odbijam prawą..");
        setDx(-dx);
      }

      if (x > 390) setDx(-dx);
      if (x < 0) setDx(-dx);
      if (y > 300) setDy(-dy);
      if (y < 25) setDy(-dy);

      if (x > 390 && Math.abs(y - 150) < 75) setLeft(left + 1);

      if (x < 0 && Math.abs(y - 150) < 75) setRight(right + 1);

      setX(x);
      setY(y);
    }, 5);
  }, [x, y, dx, dy, leftY, rightY]);

  let onRestart = () => {
    setNumberGry(numerGry + 1);
  };

  return (
    <div className="App">
      <div className="fieldContainer">
        <Timer numerGry={numerGry} />
        <Field />
        <Paddle x="5px" y={leftY} />
        <Paddle x="385px" y={rightY} />
        <Controls left={left} right={right} onRestart={onRestart} />
        <Ball x={x} y={y} />
      </div>
    </div>
  );
}
