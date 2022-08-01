const mongoose = require("mongoose");

const express = require("express");
const Land = require("./models/land");
const User = require("./models/user");
const { db } = require("./models/land");

const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;
const boardSize = 100;

const authRoutes = require("./routes/auth");
const landRoutes = require("./routes/land");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());

//fixes CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use("/lands", landRoutes);

app.use("/users", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://webtechs:tEQHnkJYZl6uNoaj@firseat.gsg55.mongodb.net/webtechs?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port, initDBWithAllLands()); //, initDB()
  })
  .catch((err) => console.log(err));

const initialUser = new User({
  username: "Admin",
  password: "somehashedpassword", //fix?
  name: "Z&D.Ltd",
  role: "BUSINESS",
  money: 0,
});

const initialLands = [
  {
    type: "ROAD",
    x_coordinate: 0,
    y_coordinate: 0,
  },
  {
    type: "PROPERTY",
    isOnSale: true,
    price: 10,
    x_coordinate: 0,
    y_coordinate: 1,
  },
];

async function initDB(req, res, next) {
  await db.collection("lands").deleteMany({});
  await db.collection("users").deleteMany({});
  const user = await initialUser.save();
  initialLands.forEach((data) => {
    let land = new Land({
      ownerId: user._id,
      ownerName: user.name,
      type: data.type,
      isOnSale: data.isOnSale || false,
      price: data.price || 0,
      x_coordinate: data.x_coordinate,
      y_coordinate: data.y_coordinate,
    });
    land.save();
  });
}

async function initDBWithAllLands(req, res, next) {
  await db.collection("lands").deleteMany({});
  await db.collection("users").deleteMany({});
  const user = await initialUser.save();
  for (let x = 1; x <= boardSize; x++) {
    for (let y = 1; y <= boardSize; y++) {
      let type;
      let isOnSale;
      let price;
      if (isRoad(x, y)) {
        type = "ROAD";
      } else if (isGarden(x, y)) {
        type = "GARDEN";
      } else {
        type = "PROPERTY";
        isOnSale = Math.random() < 0.5; // random boolean
        price = getRandomPrice(15, 200, 2);
      }

      let land = new Land({
        ownerId: user._id,
        ownerName: user.name,
        type: type,
        isOnSale: isOnSale || false,
        price: price || 0,
        x_coordinate: x,
        y_coordinate: y,
      });
      land.save();
    }
  }
}

function isRoad(x, y) {
  if (x % 10 == 0 || (y % 10 == 0 && x != 100 && y != 100)) return true;
  else return false;
}

const DGarden = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));
DGarden[2][2] = 1;
DGarden[2][3] = 1;
DGarden[2][4] = 1;
DGarden[3][2] = 1;
DGarden[3][4] = 1;
DGarden[3][5] = 1;
DGarden[4][2] = 1;
DGarden[4][5] = 1;
DGarden[5][2] = 1;
DGarden[5][6] = 1;
DGarden[6][2] = 1;
DGarden[6][5] = 1;
DGarden[7][2] = 1;
DGarden[7][4] = 1;
DGarden[7][5] = 1;
DGarden[8][2] = 1;
DGarden[8][3] = 1;
DGarden[8][4] = 1;

const ZGarden = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));
ZGarden[2][2] = 1;
ZGarden[2][3] = 1;
ZGarden[2][4] = 1;
ZGarden[2][5] = 1;
ZGarden[2][6] = 1;
ZGarden[2][7] = 1;
ZGarden[2][8] = 1;
ZGarden[3][8] = 1;
ZGarden[4][7] = 1;
ZGarden[5][6] = 1;
ZGarden[6][5] = 1;
ZGarden[7][4] = 1;
ZGarden[8][3] = 1;
ZGarden[9][2] = 1;
ZGarden[9][3] = 1;
ZGarden[9][4] = 1;
ZGarden[9][5] = 1;
ZGarden[9][6] = 1;
ZGarden[9][7] = 1;
ZGarden[9][8] = 1;

const MGarden = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));
MGarden[2][2] = 1;
MGarden[2][3] = 1;
MGarden[2][8] = 1;
MGarden[2][9] = 1;
MGarden[3][2] = 1;
MGarden[3][4] = 1;
MGarden[3][7] = 1;
MGarden[3][9] = 1;
MGarden[4][2] = 1;
MGarden[4][5] = 1;
MGarden[4][6] = 1;
MGarden[4][9] = 1;
MGarden[5][2] = 1;
MGarden[5][9] = 1;
MGarden[6][2] = 1;
MGarden[6][9] = 1;
MGarden[7][2] = 1;
MGarden[7][9] = 1;
MGarden[8][2] = 1;
MGarden[8][9] = 1;

function isGarden(x, y) {
  if (x > 10 && x < 20 && y > 20 && y < 30) return DGarden[x % 10][y % 10];
  else if (x > 70 && x < 80 && y > 30 && y < 40) return ZGarden[x % 10][y % 10];
  else if (x > 40 && x < 50 && y > 40 && y < 50) return MGarden[x % 10][y % 10];
  else if (x > 60 && x < 70 && y > 20 && y < 30) return 1;
  else if (x > 20 && x < 30 && y > 80 && y < 90) return 1;
  else return 0;
}

function getRandomPrice(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}
