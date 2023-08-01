require("dotenv").config();
const express = require("express");

const validateSchemas = require("../middleware/validateSchemas");
const verifyJwt = require("../middleware/validateJwt");

const validateUser = require("../schemes/validateUser");
const validateLogin = require('../schemes/validateLogin');
const validateUpdateUser = require("../schemes/validateUpdateUser");
const validateClient = require('../schemes/validateClient');
const validateCharge = require('../schemes/validateCharge');

const { registerUser, updateUser, getUser } = require("../controllers/user");
const { login } = require('../controllers/login');
const { createClient, clientList, updateClient } = require('../controllers/client');
const { createCharge, getClientCharge, listCharges, paidCharges, unpaidCharges, pendingCharges } = require('../controllers/charge');

const listChargesBystatus = require('../controllers/charcheByStatus');
const validateUpdateClient = require("../schemes/validateUpdateClient");

const routes = express();

routes.post('/user', validateSchemas(validateUser), registerUser);
routes.post('/login', validateSchemas(validateLogin), login);

routes.use(verifyJwt);

routes.put('/user', validateSchemas(validateUpdateUser), updateUser);
routes.get('/user', getUser);

routes.post('/client', validateSchemas(validateClient), createClient);
routes.get('/client', clientList);
routes.put('/client/:id', validateSchemas(validateUpdateClient), updateClient);

routes.post('/charge', validateSchemas(validateCharge), createCharge);
routes.get('/charge', listCharges);
routes.get('/client/charge/:client_id', getClientCharge);
routes.get('/charges/bystatus', listChargesBystatus)
routes.get('/charges/paid', paidCharges)
routes.get('/charges/unpaid', unpaidCharges)
routes.get('/charges/pending', pendingCharges)

module.exports = routes;