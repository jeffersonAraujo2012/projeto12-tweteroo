import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
  const user = req.body;

  if (typeof user.username !== "string" || typeof user.avatar !== "string") {
    res.sendStatus(400);
    return;
  }
  if (!user.username || !user.avatar) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  users.push(user);
  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const page = req.query.page || 1;
  const numTweets = tweets.length; //37

  const firstTweet = (page - 1) * 10 > numTweets ? numTweets : (page - 1) * 10;
  const lastTweet = page * 10 > numTweets ? numTweets : page * 10;

  if (isNaN(page) || page < 1) {
    res.status(400).send("Informe uma página válida!");
    return;
  }

  const tweetsCurrentPage = tweets.slice(firstTweet, lastTweet);
  res.send(tweetsCurrentPage);
});

app.post("/tweets", (req, res) => {
  const userReq = req.headers.user;
  const tweet = req.body;
  const user = users.find((user) => user.username === userReq);

  if (!user) {
    res.status(400).send("UNAUTHORIZED");
    return;
  }

  if (typeof tweet.tweet !== "string") {
    res.sendStatus(400);
  }
  if (!tweet.tweet) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  tweet.username = userReq;
  tweet.avatar = user.avatar;

  tweets.splice(0, 0, tweet);
  res.status(201).send("OK");
});

app.get("/tweets/:username", (req, res) => {
  const username = req.params.username;
  const filtedTweets = tweets.filter((tweet) => tweet.username === username);
  res.send(filtedTweets);
});

app.listen(5000, () => {
  console.log("servidor online");
});
