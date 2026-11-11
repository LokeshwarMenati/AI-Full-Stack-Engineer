export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;
      next();
    } catch (error) {
      const details = error.errors ? error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ') : error.message;
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${details}`,
        errors: error.errors
      });
    }
  };
};
