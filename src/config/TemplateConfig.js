import Joi from "joi";

export const TemplateConfig = Joi.object({
  login: Joi.object({
    variant: Joi.string()
      .valid("classic", "modern")
      .optional()
      .default("classic"),
    image: Joi.string()
      .optional()
      .default("https://minimals.cc/assets/background/overlay_3.jpg"),
    icon: Joi.string()
      .optional()
      .default("https://cdn.nucleoid.com/media/icon.png"),
    largeIcon: Joi.string()
      .optional()
      .default("https://cdn.nucleoid.com/media/icon.png"),
  }).required(),
  theme: Joi.object({
    mode: Joi.string().valid("light", "dark").optional().default("dark"),
    colorPresets: Joi.string()
      .valid("default", "cyan", "purple", "blue", "orange", "red")
      .optional()
      .default("default"),
  })
    .optional()
    .default({ mode: "dark", colorPresets: "cyan" }),
  itemsPath: Joi.string().required(),
});
