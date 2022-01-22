import { render } from 'preact';
import { useState } from 'preact/hooks';

const chars = `abcdefghijklmnopqrstuvwxyz `;

const strs = (string: string) => {
  const chars = string.split('');
  const sorted = chars.sort();
  return sorted.join('');
};
const sort = (items: Set<string>) => {
  const arr = Array.from(items);
  arr.sort();
  return arr;
};
const format = (items: Set<string>) => sort(items).join('');

const map = {
  [strs('he')]: 'hello',
  [strs('wo')]: 'world',
  ' ': '<backspace>',
};

const App = () => {
  let [keys, setKeys] = useState(0);
  const [all, setAll] = useState(new Set() as Set<string>);
  const [ast, setAst] = useState([]);
  const [history, setHistory] = useState([]);
  const [insert, setInsert] = useState(false);

  const keyDown = (e) => {
    if (insert) return;
    if (chars.indexOf(e.key) !== -1) {
      e.preventDefault();

      if (!all.has(e.key)) {
        all.add(e.key);
        setAll(all);
        setKeys(keys + 1);
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      setHistory(history.slice(0, history.length - 1));
    }
  };

  const keyUp = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setInsert(!insert);
    } else if (all.has(e.key) && chars.indexOf(e.key) !== -1) {
      setKeys(keys);
      keys--;

      // end of the chord
      if (keys === 0) {
        setHistory([...history, format(all)]);
        setAll(new Set());

        if (map[format(all)] === '<backspace>') {
          setHistory(history.slice(0, history.length - 1));
        }
      }
    }
  };

  return (
    <main>
      <p>{(insert ? 'INSERT' : '') + format(all)}</p>
      <textarea
        onKeyDown={keyDown}
        onKeyUp={keyUp}
        readOnly={!insert}
        autoFocus
        value={
          history.map((el) => map[el] ?? el).join(' ') + (!insert ? '▮' : '')
        }
      />
    </main>
  );
};

render(<App />, document.getElementById('app'));
