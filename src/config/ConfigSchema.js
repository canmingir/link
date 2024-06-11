import Joi from "joi";

export const ConfigSchema = Joi.object({
  name: Joi.string().required(),
  base: Joi.string().required(),
  api: Joi.string().uri().required(),
  oauth: Joi.object({
    nucleoid: Joi.object().optional(),
    github: Joi.object({
      authUrl: Joi.string().uri().required(),
      clientId: Joi.string().required(),
      redirectUri: Joi.string().uri().required(),
      scope: Joi.string().required(),
      response_type: Joi.string().required(),
      userUrl: Joi.string().uri().required(),
    }).optional(),
    google: Joi.object({
      authUrl: Joi.string().uri().required(),
      clientId: Joi.string().required(),
      redirectUri: Joi.string().uri().required(),
      scope: Joi.string().required(),
      response_type: Joi.string().required(),
      userUrl: Joi.string().uri().required(),
    }).optional(),
  }).required(),
}).required();
