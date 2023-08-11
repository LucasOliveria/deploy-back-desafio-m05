const express = require("express");

const validateSchemas = require("../middleware/validateSchemas");
const verifyJwt = require("../middleware/validateJwt");

const validateUser = require("../schemes/validateUser");
const validateLogin = require('../schemes/validateLogin');
const validateUpdateUser = require("../schemes/validateUpdateUser");
const validateClient = require('../schemes/validateClient');
const validateCharge = require('../schemes/validateCharge');
const validateChargeUpload = require('../schemes/validateChargeUpload');
const validateUpdateClient = require("../schemes/validateUpdateClient");

const { registerUser, updateUser, getUser } = require("../controllers/user");
const { login } = require('../controllers/login');
const { createClient, clientList, updateClient } = require('../controllers/client');
const { createCharge, getClientCharge, listCharges, updateCharge, deleteCharge } = require('../controllers/charge');
const listChargesBystatus = require('../controllers/charcheByStatus');

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
routes.get('/charges/bystatus', listChargesBystatus);

routes.put('/charge/:id', validateSchemas(validateChargeUpload), updateCharge);
routes.delete('/charge/:id', deleteCharge);

module.exports = routes;