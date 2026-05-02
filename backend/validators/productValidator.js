import { body, validationResult } from 'express-validator';

// Validates the body of POST and PUT requests for /api/products
export const validateProduct = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Code is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .exists().withMessage('Price is required')
    .notEmpty().withMessage('Price cannot be empty')
    .isFloat({ min: 0 })
    .withMessage('Price must be 0 or greater'),

  body('sale_price')
    .isFloat({ min: 0 })
    .withMessage('Sale price must be 0 or greater'),

  body('uom')
    .trim()
    .notEmpty()
    .withMessage('Unit of measure is required'),

  body('stock')
    .exists().withMessage('Stock is required')
    .notEmpty().withMessage('Stock cannot be empty')
    .isInt({ min: 0 })
    .withMessage('Stock must be 0 or greater'),

  body('category')
    .isIn(['FRUIT', 'VEGETABLE'])
    .withMessage('Category must be FRUIT or VEGETABLE'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
        code: 'VALIDATION_ERROR',
        details: errors.array(),
      });
    }
    next();
  },
];