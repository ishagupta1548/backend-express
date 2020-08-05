const http = require("http");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const app = require("./app");
// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.Promise = global.Promise;
const server = http.createServer(app);
server.listen(port, () =>
  console.log(`Server up and running on port ${port} !`)
); //listens to the port number
