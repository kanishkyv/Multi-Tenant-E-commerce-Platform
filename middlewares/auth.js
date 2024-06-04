const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

/******************************************* IMPORTS ************************************************/

const Model = require("../models");
const utils = require("../utils");
const UnauthorizedError = require("../utils/exception");

module.exports = {
  tenantAuth: async (req, res, next) => {
    try {
      if (req.user) return next();
      if (req.headers.authorization) {
        /****************************** For Getting only JWT ****************************/
        const token =
          req.headers.authorization.split(" ").length > 1
            ? req.headers.authorization.split(" ")[1].trim()
            : req.headers.authorization;

        /*************************** Decode Token and Find User *************************/
        const decoded = await utils.jwtVerify(token);

        const user = await Model.tenant.findOne({
          _id: new ObjectId(decoded.id),
          token: token,
        });

        if (!user) {
          throw new UnauthorizedError("Tenant Unauthorized");
        } else {
          req.user = user;
          return next();
        }
      } else {
        throw new UnauthorizedError("Tenant Unauthorized");
      }
    } catch (error) {
      next(error);
    }
  },
  customerAuth: async (req, res, next) => {
    try {
      if (req.user) return next();
      if (req.headers.authorization) {
        /****************************** For Getting only JWT ****************************/
        const token =
          req.headers.authorization.split(" ").length > 1
            ? req.headers.authorization.split(" ")[1].trim()
            : req.headers.authorization;

        /*************************** Decode Token and Find User *************************/
        const decoded = await utils.jwtVerify(token);

        const user = await Model.customers.findOne({
          _id: new ObjectId(decoded.id),
          token: token,
        });

        if (!user) {
          throw new UnauthorizedError("Customer Unauthorized");
        } else {
          req.user = user;
          return next();
        }
      } else {
        throw new UnauthorizedError("Customer Unauthorized");
      }
    } catch (error) {
      next(error);
    }
  },
  adminAuth: async (req, res, next) => {
    try {
      if (req.user) return next();
      if (req.headers.authorization) {
        /****************************** For Getting only JWT ****************************/
        const token =
          req.headers.authorization.split(" ").length > 1
            ? req.headers.authorization.split(" ")[1].trim()
            : req.headers.authorization;

        /*************************** Decode Token and Find User *************************/
        const decoded = await utils.jwtVerify(token);
        const user = await Model.admin.findOne({
          _id: new mongoose.Types.ObjectId(decoded.id),
          token: token,
        });

        if (!user) {
          console.log("2");
          throw new UnauthorizedError("Admin Unauthorized");
        } else {
          req.user = user;
          return next();
        }
      } else {
        console.log("1");
        throw new UnauthorizedError("Admin Unauthorized");
      }
    } catch (error) {
      next(error);
    }
  },
};
