require("dotenv").config();
const express = require("express");

const validateSchemas = require("../middleware/validateSchemas");
const verifyJwt = require("../middleware/validateJwt");

const validateUser = require("../schemes/validateUser");
const validateLogin = require('../schemes/validateLogin');
const validateUpdateUser = require("../schemes/validateUpdateUser");

const { registerUser, updateUser, getUser } = require("../controllers/user");
const { login } = require('../controllers/login');

const routes = express();

routes.post('/user', validateSchemas(validateUser), registerUser);
routes.post('/login', validateSchemas(validateLogin), login);

routes.use(verifyJwt)

routes.put('/user', validateSchemas(validateUpdateUser), updateUser);
routes.get('/user', getUser);

// routes.get('/');
// routes.put('/');
// routes.delete('/');
// routes.get('/');
// routes.get('/');

module.exports = routes;