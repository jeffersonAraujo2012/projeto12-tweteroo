import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  {
    username: "bobesponja",
    tweet: "eu amo o hub",
  },
];
const tweets = [
  {
    username: "bobesponja",
    avatar:
      "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info",
    tweet: "eu amo o hub",
  },
];

app.post("/sign-up", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const page = req.query.page || 1;

  if (isNaN(page) || page < 1) {
    res.status(400).send("Informe uma página válida!");
    return;
  }

  const tweetsCurrentPage = tweets.slice(page * 10 - 10, page * 10 - 1);
  res.send(tweetsCurrentPage);
});

app.post("/tweets", (req, res) => {
  const userReq = req.headers.user;
  const tweet = req.body;
  const user = users.find((user) => user.username === userReq);

  if (!user) {
    res.status(403).send("UNAUTHORIZED");
    return;
  }

  tweet.username = userReq;
  tweet.avatar = user.avatar;
  
  tweets.push(tweet);
  res.status(201).send("OK");
});

app.listen(5000, () => {
  console.log("servidor online");
});
