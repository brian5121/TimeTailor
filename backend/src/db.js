import {createClient} from 'edgedb';

const client = createClient();

client.querySingle(`select random()`).then((result) => {
  console.log(result);
});