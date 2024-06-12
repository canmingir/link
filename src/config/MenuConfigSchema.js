import Joi from "joi";

export const MenuConfigSchema = Joi.object({
  sideMenu: Joi.array()
    .items(
      Joi.object({
        subheader: Joi.string().required(),
        items: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().required(),
              icon: Joi.string().required(),
              path: Joi.string().required(),
              children: Joi.array()
                .items(
                  Joi.object({
                    title: Joi.string().required(),
                    path: Joi.string().required(),
                    icon: Joi.string().required(),
                  })
                )
                .optional(),
            })
          )
          .required(),
      })
    )
    .optional()
    .default([]),
  topMenu: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        icon: Joi.string().required(),
        path: Joi.string().required(),
      })
    )
    .optional()
    .default([]),
  options: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().required(),
        linkTo: Joi.string().required(),
      })
    )
    .optional()
    .default([]),
  actionButtons: Joi.array().items(Joi.any()).optional().default([]),
  fullScreenLayout: Joi.string()
    .valid("left", "right")
    .optional()
    .default("left"),
  endItem: Joi.object({
    title: Joi.string().required(),
    icon: Joi.string().required(),
    path: Joi.string().required(),
  })
    .optional()
    .default({}),
}).required();
