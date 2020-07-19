import xs from "xstream";
import debounce from "xstream/extra/debounce";
import throttle from "xstream/extra/throttle";
import dropRepeats from "xstream/extra/dropRepeats";
import sampleCombine from "xstream/extra/sampleCombine";
import { html } from "snabbdom-jsx";
import { div, form, label, input, h1 } from "@cycle/dom";
import styles from "./command_input.css";
import { parseMove } from "../san";
import { validateMove, makeMove } from "../engine/chess";
import { moveCommand } from "../engine/command";

const NO_FEEDBACK = { text: "", status: "" };

function getInputFeedback(game, value) {
  if (value === "") {
    return { text: "" };
  }

  const move = parseMove(value);
  if (move === null) {
    return {
      text: "Invalid command.",
      status: "error",
    };
  }

  const result = validateMove(game, move);
  if (result.error) {
    return {
      text: result.error,
      status: "error",
    };
  }

  return {
    text: "",
    status: "correct",
  };
}

function intent(DOM, game$) {
  const KEYCODE_ENTER = 13;

  const input$ = DOM.select("input").events("input");
  const keydown$ = DOM.select("input").events("keydown");

  const enterPressed$ = keydown$.filter(
    ({ keyCode }) => keyCode === KEYCODE_ENTER
  );
  const inputStarted$ = input$.compose(throttle(500));
  const inputEnded$ = input$.compose(debounce(500));

  const action$ = xs.merge(
    game$.map((val) => ({ type: "GAME_CHANGED", payload: val })),

    input$
      .map((ev) => ev.target.value)
      .map((val) => ({ type: "INPUT_CHANGED", payload: val })),

    inputStarted$
      .map((ev) => ev.target.value)
      .map((value) => ({ type: "INPUT_STARTED", payload: value })),

    inputEnded$
      .map((ev) => ev.target.value)
      .map((value) => ({ type: "INPUT_ENDED", payload: value })),

    enterPressed$
      .map((ev) => ev.target.value)
      .map(parseMove)
      .filter((move) => move !== null)
      .map((move) => ({ type: "SEND_MOVE_COMMAND", payload: move }))
  );

  const prevented$ = xs.merge(input$, enterPressed$);

  return { prevented$, action$ };
}

function model(action$, initialState) {
  const inputReducer$ = action$
    .filter((a) => a.type === "INPUT_CHANGED")
    .map((action) => (state) => ({ ...state, inputValue: action.payload }));

  const inputEndedReducer$ = action$
    .filter((a) => a.type === "INPUT_ENDED")
    .map((action) => (state) => ({
      ...state,
      feedback: getInputFeedback(state.game, action.payload),
    }));

  const inputStartedReducer$ = action$
    .filter((a) => a.type === "INPUT_STARTED")
    .map((action) => (state) => ({ ...state, feedback: NO_FEEDBACK }));

  const gameReducer$ = action$
    .filter((a) => a.type === "GAME_CHANGED")
    .map((action) => (state) => ({ ...state, game: action.payload }));

  const commandSentReducer$ = action$
    .filter((a) => a.type === "SEND_MOVE_COMMAND")
    .map((action) => (state) => ({
      ...state,
      inputValue: "",
      feedback: NO_FEEDBACK,
    }));

  const reducer$ = xs.merge(
    gameReducer$,
    inputStartedReducer$,
    inputEndedReducer$,
    inputReducer$,
    commandSentReducer$
  );

  const state$ = reducer$.fold(
    (state, reducer) => reducer(state),
    initialState
  );

  const command$ = action$
    .filter((a) => a.type === "SEND_MOVE_COMMAND")
    .compose(sampleCombine(state$))
    //.map(([action, state]) => validateMove(state.game.board, action.payload))
    .map(([action, state]) => {
      const move = validateMove(state.game, action.payload);
      console.log(action.payload, move);
      return move;
    })
    .filter((res) => !res.error)
    .map((res) => moveCommand(res.fromIndex, res.toIndex));

  return { state$, command$ };
}

function view(state$) {
  return state$.map((state) => {
    const ourTurn = state.game && state.game.turn === state.playerColor;

    return (
      <div
        class={{
          [styles.container]: true,
          [styles.correct]: state.feedback.status === "correct",
          [styles.error]: state.feedback.status === "error",
        }}
      >
        <input
          type="text"
          class={{ [styles.input]: true }}
          value={state.inputValue}
          disabled={!ourTurn}
        />
        <div class={{ [styles.feedback]: true }}>{state.feedback.text}</div>
      </div>
    );
  });
}

export function CommandInput(sources) {
  const initialState = {
    game: null,
    inputValue: "",
    feedback: NO_FEEDBACK,
    playerColor: sources.props.playerColor,
  };

  const { prevented$, action$ } = intent(sources.DOM, sources.props.game$);
  const { state$, command$ } = model(action$, initialState);
  const vdom$ = view(state$);

  return {
    DOM: vdom$,
    prevented: prevented$,
    command: command$,
  };
}
