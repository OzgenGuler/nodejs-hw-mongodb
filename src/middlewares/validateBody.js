// import createHttpError from 'http-errors';

// export const validateBody = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return next(new createHttpError(400, error.details[0].message));
//   }
//   next();
// };
import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return next(createHttpError(400, errorMessage));
    }
    next();
  };
};
