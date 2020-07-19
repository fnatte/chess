import { div } from "@cycle/dom";
import { html } from "snabbdom-jsx";
import { PieceChar } from "../engine/constants";
import styles from "./board.css";

export default function Board(sources) {
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
