
const app =require ('./app');
const connectDatabse = require('./config/db');
const { serverPort } = require('./private');

app.listen(serverPort, async () => {
  console.log(`server is running at http://localhost:${serverPort}`);
  await connectDatabse();
});