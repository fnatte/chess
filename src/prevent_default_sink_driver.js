import xs from 'xstream';

export function preventDefaultSinkDriver(prevented$) {
  prevented$.addListener({
    next: ev => {
      ev.preventDefault();
    },
    error: () => {},
    complete: () => {},
  });
  return xs.empty();
}
