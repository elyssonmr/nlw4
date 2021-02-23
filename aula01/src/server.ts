import express, { response } from 'express';

const app = express();

app.get('/', (req, resp) => {
  return resp.json({message: 'Hello World - NL4'});
});

app.post('/', (req, resp) => {
  return resp.json({message: 'Data Saved with Success'})
});


app.listen(3333, () => { console.log('server Started at port 3333') });
