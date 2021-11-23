const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const restaurants = data.restaurants;
const reviews = data.reviews;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const saffronlounge = await restaurants.create(
    "The Saffron Lounge",
    "New York City, New York",
    "123-456-7890",
    "http://www.saffronlounge.com",
    "$$$$",
    ["Cuban", "Italian"],
    { dineIn: true, takeOut: true, delivery: false }
  );

  const id = saffronlounge._id;
  await reviews.create(
    id,
    "This place was great!",
    "scaredycat",
    5,
    "10/13/2021",
    "This place was great! the staff is top notch and the food was delicious!  They really know how to treat their customers"
  );
  await reviews.create(
    id,
    "Average Restaurant",
    "chillyflake",
    4,
    "10/13/2021",
    "This place was okay!"
  );

  console.log("Done seeding database");

  await db.serverConfig.close();
}

main().catch(error => {
  console.log(error);
});
