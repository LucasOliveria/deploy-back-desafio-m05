const validateSchemas = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
}

module.exports = validateSchemas;