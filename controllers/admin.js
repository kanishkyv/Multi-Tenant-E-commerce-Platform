const {
  registerAdmin,
  loginAdmin,
  addTenant,
  deleteTenant,
  updateTenant,
} = require("../services/admin");

exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await registerAdmin(email, password);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await loginAdmin(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
exports.addTenant = async (req, res, next) => {
  try {
    const { name, email, password, latitude, longitude, radius } = req.body;
    const token = await addTenant(
      name,
      email,
      password,
      latitude,
      longitude,
      radius
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
exports.deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteTenant(id);
    res.json({ messgae: "Delete Succesfully" });
  } catch (error) {
    next(error);
  }
};
exports.updateTenant = async (req, res, next) => {
  try {
    let { id } = req.params;
    const data = await updateTenant(req.body, id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
