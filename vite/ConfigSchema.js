import Joi from "joi";

export const ConfigSchema = Joi.object({
  name: Joi.string().optional().default(""),
  base: Joi.string().optional().default(""),
  api: Joi.string().uri().optional().default(""),
  login: Joi.object({
    icon: Joi.string().required(),
    largeIcon: Joi.string().required(),
    name: Joi.string().required(),
    nucleoid: Joi.object().optional(),
    github: Joi.object({
      authUrl: Joi.string().uri().required(),
      clientId: Joi.string().required(),
      redirectUri: Joi.string().uri().required(),
      scope: Joi.string().required(),
      response_type: Joi.string().required(),
    }).optional(),
  }).required(),
  settings: Joi.object({
    mode: Joi.string().valid("light", "dark").optional().default("dark"),
    colorPresets: Joi.string()
      .valid("default", "cyan", "purple", "blue", "orange", "red")
      .optional()
      .default("default"),
  }).optional(),
  itemsData: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        title: Joi.string().required(),
        icon: Joi.string().required(),
      })
    )
    .optional()
})
  .required()
  .unknown(true);
