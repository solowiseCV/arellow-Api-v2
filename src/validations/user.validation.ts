import Joi from 'joi';

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  fullname: Joi.string().min(2).max(100),
  phone_number: Joi.string()
  .pattern(/^\+?[1-9]\d{9,14}$/)
  .message("Invalid phone number format")
});

export const userRatingSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  rateby: Joi.string().required()
});

export const notificationSchema = Joi.object({
  message: Joi.string().required().max(500),
  status: Joi.string().required().valid('tour', 'message'),
  prodId: Joi.string().optional()
});

// export const kycNinSchema = Joi.object({
//   nin_number: Joi.string().required().length(11).pattern(/^\d+$/),
//   nin_slip_url: Joi.string().required().uri()
// });

export const kycCacSchema = Joi.object({
  cac_number: Joi.string().required().pattern(/^RC\d{8}$/),
  cac_doc_url: Joi.string().required().uri()
});

export const kycFaceSchema = Joi.object({
  face_image_url: Joi.string().required().uri()
}); 