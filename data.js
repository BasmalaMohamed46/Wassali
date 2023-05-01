import parse from 'csv-parse';
import { file } from 'k6';

const data = [];

const fileContents = file('data.csv');

parse(fileContents, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  cast: true,
}, (err, output) => {
  if (err) throw err;

  output.forEach((row) => {
    data.push(row);
  });
});

export default data;
