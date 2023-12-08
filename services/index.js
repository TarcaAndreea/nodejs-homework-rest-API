const Contact = require("./schemas/contactsSchema");
const User = require("./schemas/usersSchema");
const sgMail = require("@sendgrid/mail");
const nanoid = require("nanoid");
const getAllContacts = async () => {
  return Contact.find();
};
const getAllUsers = async () => {
  return User.find();
};
const createUser = async ({ email, password }) => {
  try {
    const userExistent = await User.findOne({ email });

    if (userExistent) {
      throw new Error("Acest email exista deja.");
    }

    const newUser = new User({ email, password });
    newUser.setPassword(password);
    return await newUser.save();
  } catch (error) {
    throw error;
  }
};
const codUnicDeVerificare = nanoid();
const msg = {
  to: email,
  from: "adrianatarca1@gmail.com",
  subject: "Email de verificare cont!",
  text: `Codul de verificare este ${codUnicDeVerificare} / http://localhost:5000/api/account/verify/${codUnicDeVerificare}`,
};

sgMail
  .send(msg)
  .then(() => console.log("Email trimis"))
  .catch(() => {
    throw new Error("Eroare la trimitere");
  });

const newUser = new User({
  email,
  password,
  name,
  verificationToken: codUnicDeVerificare,
});
newUser.setPassword(password);
return await newUser.save();

const checkUserDB = async ({ email, password }) => {
  try {
    console.log(`Parola:${password}`);
    const user = await User.findOne({ email });
    console.log(user);
    // if (!user) {
    //   throw new Error("User-ul nu exista in baza de date!");
    // }
    // if (user.password !== password) {
    //   throw new Error("Parola este gresita");
    // }

    if (!user || user.password !== password) {
      throw new Error("Email sau parola gresita!");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, majorUpdate) => {
  console.log(id, majorUpdate);
  console.log(majorUpdate);

  //  { $set: { name: 'jason bourne' }
  return User.findByIdAndUpdate(
    { _id: id },
    { $set: majorUpdate },
    { new: true }
  );
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};
const getUserbyId = async (id) => {
  const user = await User.findById(id);
  return user;
};

const removeContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const createContact = async ({ name, email, phone, favorite, age }) => {
  return Contact.create({ name, email, phone, favorite, age });
};

const updateContact = async (id, updateData) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });
  return result;
};
const findUser = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

const updateFavoriteContact = async (id, favoriteUpdate) => {
  console.log(id, favoriteUpdate);
  console.log(favoriteUpdate);
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: favoriteUpdate },
    { new: true }
  );
};
const verifyEmail = async (verificationToken) => {
  const update = { verify: true, verificationToken: null };

  const result = await User.findOneAndUpdate(
    {
      verificationToken,
    },
    { $set: update },
    { new: true }
  );
  console.log(result);
  if (!result) throw new Error("userul nu exista");
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
  updateFavoriteContact,
  getAllUsers,
  createUser,
  updateUser,
  checkUserDB,
  findUser,

  verifyEmail,
};
