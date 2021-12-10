const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
// const { users } = require(".");
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
  async getAllUsers() {
    const usersCollection = await users();
    const allUsers = await usersCollection.find({}, { projection: { "Password": 0 } }).toArray();
    for (let x of allUsers) {
      x._id = x._id.toString();
    }
    return allUsers;
  },


  async createUser(username, password, firstname, lastname, email, age) {
    // console.log("abc")
    // input check: 
    if (!username) throw 'You must provide a username for your account';
    if (!password) throw 'You must provide a password for your account';
    if (!firstname || !lastname) throw 'You must provide a first name and last name for your account';
    if (!email) throw 'You must provide a email for your account';
    if (!age) throw 'You must provide a age for your account';

    if (typeof username !== 'string' || username == undefined || username.trim().length == 0) throw 'You must provide a non-blank string username.';
    // if (!/^[a-z0-9]+$/i.test(username)) throw 'You must provide a  username only alphanumeric characters.'
    if (typeof password !== 'string' || password == undefined || password.length < 6) throw 'You must provide a string password with at least 6 characters.';
    if (password.indexOf(' ') != -1) throw 'No space in password.'
    if (typeof firstname !== 'string' || firstname == undefined || firstname.trim().length == 0) throw 'You must provide a non-blank string firstname.';
    if (typeof lastname !== 'string' || lastname == undefined || lastname.trim().length == 0) throw 'You must provide a non-blank string lastname.';
    if (typeof email !== 'string' || email == undefined || email.trim().length == 0) throw 'You must provide a valid email.';
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.test(String(email).toLowerCase())) throw 'You must provide a valid email.';
    if (typeof age !== 'number' || age <= 0) throw 'You must provide a positive number in age.';

    //repetition
    let low_username = username.toLowerCase();
    let low_email = email.toLowerCase();
    const allUsers = await this.getAllUsers();
    allUsers.forEach(user => {
      if (user.username == low_username) throw 'This username is already used.';
      if (user.email == low_email) throw 'This email is already used.';
    })

    // create
    const usersCollection = await users();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Add new user to DB 
    // console.log('create in data');
    let newUser = {
      username: low_username,
      Password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      email: low_email,
      age: age,
      myFavoriteRecipe: [],
      myRecipes: [],
      myReviews: []
      //username, password, firstname, lastname, email, age
    };
    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw 'Could not add newUser';

    const newId = insertInfo.insertedId.toString();
    const user = await this.get(newId); //?
    user._id = user._id.toString();
    return user;
    // return { userInserted: true };
  },

  async checkUser(username, password) {
    // console.log("a")
    // input check: 
    if (!username) throw 'You must provide a username for your account';
    if (!password) throw 'You must provide a password for your account';
    if (typeof username !== 'string' || username == undefined || username.trim().length == 0) throw 'You must provide a string username with at least 4 characters.';
    // if (!/^[a-z0-9]+$/i.test(username)) throw 'You must provide a  username only alphanumeric characters.'
    if (typeof password !== 'string' || password == undefined || password.length < 6) throw 'You must provide a string password with at least 6 characters.';
    if (password.indexOf(' ') != -1) throw 'No space in password.'
    let low_username = username.toLowerCase();
    let match = false;
    const usersCollection = await users();
    // console.log("b")
    const user = await usersCollection.find({ username: low_username }).toArray();
    // console.log(user[0])
    if (user.length == 0) throw 'Either the username or password is invalid'    //'No user with that username';
    match = await bcrypt.compare(password, user[0].Password);
    // console.log("cc")
    if (!match) throw 'Either the username or password is invalid' //'Your password is wrong!';
    // return { authenticated: true };
    return user[0];
  },

  async get(id) {
    if (!id || typeof id !== 'string') throw "Error: Not a valid ObjectId"
    // if (!ObjectId.isValid(id)) throw "Error: Not a valid ObjectId";
    // let ID = ObjectId(id);

    const userCollection = await users();
    let user = await userCollection.findOne({ _id: ObjectId(id.trim()) });
    if (user === null) throw 'No user with that id.';
    user._id = user._id.toString();

    return user;
  },

};

// //Helper Functions
// const checkProperString = (string, parameter) => {
//   if (string == null || typeof string == undefined)
//     throw `Error: Please pass a ${parameter}`;
//   if (typeof string != "string") {
//     throw `Error: ${parameter} Not a string`;
//   }
//   string = string.trim();
//   if (string.length == 0) {
//     throw `Error: ${parameter} Empty string`;
//   }
// };

// const isValidURL = string => {
//   if (string.startsWith("http://www.") || string.startsWith("https://www.")) {
//     if (/.([./])com$/.test(string)) {
//       if (string.length < 20)
//         throw "Error:  At least 5 characters in-between the http://www. and .com required ";
//     }
//   } else {
//     throw "Error: Not valid Website";
//   }
// };

// const checkProperArray = array => {
//   if (!array) throw "Error: No parameter supplied. Please pass an array";
//   if (!Array.isArray(array))
//     throw `Error: Parameter passed, "${array}" is not an array.It is "${typeof array}". Please pass an array instead`;
//   if (array.length == 0) throw "Cannot pass an empty array";
// };

// const checkProperObject = (object, checklength) => {
//   if (!object) throw "Error: Please pass the object";
//   if (!(object.constructor === Object)) {
//     throw "Error: Parameter passed should be an object";
//   }
//   if (checklength && Object.keys(object).length === 0)
//     throw "Error: Pass atleast 1 value in the object";
// };
