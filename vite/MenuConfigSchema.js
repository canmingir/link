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
    .required(),
  topMenu: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        icon: Joi.string().required(),
        path: Joi.string().required(),
      })
    )
    .required(),
  options: Joi.array()
    .items(
      Joi.object({
        label: Joi.string().required(),
        linkTo: Joi.string().required(),
      })
    )
    .required(),
  itemBar: Joi.array()
    .items(
      Joi.object({
        itemName: Joi.string().required(),
        addNewItem: Joi.function().required(),
        itemsData: Joi.array()
          .items(
            Joi.object({
              id: Joi.number().required(),
              title: Joi.string().required(),
              icon: Joi.string().required(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  actionButtons: Joi.array().items(Joi.any()).optional().default([]),
  fullScreenLayout: Joi.string().valid("left", "right").optional(),
})
  .required()
  .unknown(true);
