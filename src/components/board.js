import xs from "xstream";
import { div, label, input, h1 } from "@cycle/dom";
import { html } from "snabbdom-jsx";
import { PieceChar } from "../engine/constants";
import styles from "./board.css";

export function Board(sources) {
  // const vdom$ = sources.props.board$
  //   .map(board => div('.board.' + styles.board,
  //     board.map(cell => div('.cell.' + styles.cell, PieceChar[cell]))
  //   ));

  const vdom$ = sources.props.board$.map((board) => (
    <div class={{ board: true, [styles.board]: true }}>
      {board.map((cell) => (
        <div class={{ [styles.cell]: true }}>{PieceChar[cell]}</div>
      ))}
    </div>
  ));

  return {
    DOM: vdom$,
  };
}
