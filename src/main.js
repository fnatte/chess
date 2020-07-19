import xs from "xstream";
import { run } from "@cycle/xstream-run";
import { div, makeDOMDriver } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { newGame } from "./engine/game";
import { makeMove } from "./engine/chess";
import { PieceColor } from "./engine/constants";
import { AI } from "./engine/ai";
import { Board } from "./components/board";
import { CommandInput } from "./components/command_input";
import styles from "./main.css";
import { preventDefaultSinkDriver } from "./prevent_default_sink_driver";

require("file-loader?name=[name].[ext]!./index.html");

function main({ DOM }) {
  const commandProxy$ = xs.create();

  const game$ = commandProxy$.fold((game, command) => command(game), newGame());

  // Human player
  const cmdInput = isolate(CommandInput)({
    DOM,
    props: {
      playerColor: PieceColor.white,
      game$,
    },
  });

  // AI player
  const aiColor = PieceColor.black;
  const ai$ = game$
    .filter((game) => game.turn === aiColor)
    .map((game) => AI(game, aiColor));

  // Commands
  const command$ = xs.merge(cmdInput.command, ai$);
  commandProxy$.imitate(command$);

  const board = isolate(Board)({
    DOM,
    props: { board$: game$.map((game) => game.board) },
  });

  const vdom$ = xs
    .combine(board.DOM, cmdInput.DOM)
    .map(([boardVDom$, cmdInput$]) =>
      div(`.${styles.container}`, [boardVDom$, cmdInput$])
    );

  const prevented$ = cmdInput.prevented;

  return {
    DOM: vdom$,
    preventDefault: prevented$,
  };
}

run(main, {
  DOM: makeDOMDriver("#app"),
  preventDefault: preventDefaultSinkDriver,
});
