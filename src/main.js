import { html } from "snabbdom-jsx";
import xs from "xstream";
import { run } from "@cycle/xstream-run";
import delay from "xstream/extra/delay";
import { div, makeDOMDriver } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { newGame } from "./engine/game";
import { PieceColor } from "./engine/constants";
import AI from "./engine/ai";
import Board from "./components/board";
import CommandInput from "./components/command_input";
import GameLog from "./components/game_log";
import styles from "./main.css";
import preventDefaultSinkDriver from "./prevent_default_sink_driver";

// eslint-disable-next-line
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

  // Commands (https://github.com/staltz/xstream/issues/239)
  const command$ = xs.merge(cmdInput.command, ai$).compose(delay(1));
  commandProxy$.imitate(command$);

  const board = isolate(Board)({
    DOM,
    props: { board$: game$.map((game) => game.board) },
  });

  const gameLog = isolate(GameLog)({
    DOM,
    props: { game$ },
  });

  const vdom$ = xs
    .combine(board.DOM, cmdInput.DOM, gameLog.DOM)
    .map(([boardVtree, cmdInputVtree, gameLogVtree]) => (
      <div class={{ [styles.container]: true }}>
        {boardVtree}
        <div class={{ [styles.controls]: true }}>
          {gameLogVtree}
          {cmdInputVtree}
        </div>
      </div>
    ));

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
