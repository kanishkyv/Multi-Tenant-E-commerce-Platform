const Admin = require("../models/admin");
const Tenant = require("../models/tenant");
const UnauthorizedError = require("../utils/exception");

const jwt = require("jsonwebtoken");

const registerAdmin = async (email, password) => {
  let check = await Admin.findOne({ email: email });
  if (check) throw new Error("Admin Exists");

  const admin = new Admin({ email, password });
  await admin.save();
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  await Admin.findOneAndUpdate({ _id: admin._id }, { token: token });
  return token;
};

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    await Admin.findOneAndUpdate({ _id: admin._id }, { token: token });
    return token;
  } else {
    throw new UnauthorizedError("Invalid email or password");
  }
};

const addTenant = async (
  name,
  email,
  password,
  latitude,
  longitude,
  radius
) => {
  let check = await Tenant.findOne({ email: email });
  if (check) throw new Error("Tenant Exists");
  let location;
  if (longitude && latitude) {
    location = {
      type: "Point",
      coordinates: [+longitude, latitude],
    };
  }

  let tenant = new Tenant({ email, password, name, location, radius });
  await tenant.save();
  const token = jwt.sign({ id: tenant._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  tenant = await Tenant.findOneAndUpdate({ _id: tenant._id }, { token: token });
  return tenant;
};

const deleteTenant = async (id) => {
  await Tenant.findOneAndDelete({ _id: id });
};

const updateTenant = async (body, id) => {
  let check = await Tenant.findOne({ _id: id });
  if (!check) throw new Error("Tenant Not Found");
  if (body.longitude && body.latitude) {
    body.location = {
      type: "Point",
      coordinates: [+body.longitude, body.latitude],
    };
  }

  const data = await Tenant.findByIdAndUpdate(id, body, { new: true });
  return data;
};

module.exports = {
  registerAdmin,
  loginAdmin,
  addTenant,
  deleteTenant,
  updateTenant,
};
