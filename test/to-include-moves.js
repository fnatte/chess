import { san } from "../src/engine/san";

const asArray = (x) => (Array.isArray(x) ? x : [x]);

expect.extend({
  toIncludeMoves(received, expected) {
    const expectedArray = asArray(san(expected));

    if (this.isNot) {
      expect(received).not.toIncludeSameMembers(expectedArray);
    } else {
      expect(received).toIncludeSameMembers(expectedArray);
    }

    return { pass: true, message: "" };
  },
});
