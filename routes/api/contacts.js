const express = require("express");

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../DB/contacts");

router.get("/", async (req, res, next) => {
  res.status(200).json({
    status: "success",
    code: 200,
    data: "Server response ok",
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { ...contact },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Contact not found",
    });
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const data = await addContact({ name, email, phone });
    res.status(201).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required name field",
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    await removeContact(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required field",
    });
  }
  try {
    const data = await updateContact(contactId, { name, email, phone });
    res.status(200).json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
});

module.exports = router;
