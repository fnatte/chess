import xs from "xstream";

export default function preventDefaultSinkDriver(prevented$) {
  prevented$.addListener({
    next: (ev) => {
      ev.preventDefault();
    },
    error: () => {},
    complete: () => {},
  });
  return xs.empty();
}
