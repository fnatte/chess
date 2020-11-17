import { html } from "snabbdom-jsx";
import { div } from "@cycle/dom";
import styles from "./game_log.css";
import { moveToSAN } from "../engine/san";

function viewEvent(event) {
  return <div class={{ [styles.event]: true }}>{moveToSAN(event)}</div>;
}

function view(state$) {
  return state$.map((state) => {
    return (
      <div class={{ [styles.container]: true }}>
        {state.moves.map((x) => viewEvent(x))}
        {state.result ? <div>{state.result}</div> : ""}
      </div>
    );
  });
}

export default function GameLog(sources) {
  const { game$ } = sources.props;

  const vdom$ = view(game$);

  return {
    DOM: vdom$,
  };
}
