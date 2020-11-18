import validateMove from "./validate-move";

export default function simplifySanMove(game, sanMove) {
  const validationResult = validateMove(game, { ...sanMove, dis: undefined });

  return {
    piece: sanMove.piece !== "P" ? sanMove.piece : "",
    capture: sanMove.capture,
    dest: sanMove.dest,
    dis:
      validationResult.error && validationResult.matchingCount > 0
        ? sanMove.dis
        : undefined,
  };
}
