import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const segmentSchema = Joi.object({
  name:
    Joi.string()
      .required()
      .min(4)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least {#limit} characters long',
      }),
  description:
    Joi.string()
      .required()
      .min(12)
      .messages({
        'string.empty': 'description is required',
        'string.min': 'Description must be at least {#limit} characters long',
      }),
});

const UpdateSegmentSchema = Joi.object({
  name:
    Joi.string()
      .min(4)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least {#limit} characters long',
      }),
  description:
    Joi.string()
      .min(12)
      .messages({
        'string.empty': 'description is required',
        'string.min': 'Description must be at least {#limit} characters long',
      }),
});


const validateSegmentCreation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await segmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join('; ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  } catch (err) {
    console.error('Error validating segment Creation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateSegmentUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await UpdateSegmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join('; ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  } catch (err) {
    console.error('Error validating segment Creation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { validateSegmentCreation, validateSegmentUpdate };
