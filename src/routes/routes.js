require("dotenv").config();
const express = require("express");

const validateSchemas = require("../middleware/validateSchemas");
const verifyJwt = require("../middleware/validateJwt");

const validateUser = require("../schemes/validateUser");
const validateLogin = require('../schemes/validateLogin');
const validateUpdateUser = require("../schemes/validateUpdateUser");
const validateClient = require('../schemes/validateClient')

const { registerUser, updateUser, getUser } = require("../controllers/user");
const { login } = require('../controllers/login');
const { createClient, clientList } = require('../controllers/client')

const routes = express();

routes.post('/user', validateSchemas(validateUser), registerUser);
routes.post('/login', validateSchemas(validateLogin), login);

routes.use(verifyJwt)

routes.put('/user', validateSchemas(validateUpdateUser), updateUser);
routes.get('/user', getUser);

routes.post('/client', validateSchemas(validateClient), createClient);
routes.get('/client', clientList);

module.exports = routes;