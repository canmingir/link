import Joi from "joi";

export const ConfigSchema = Joi.object({
  appId: Joi.string().uuid().required(),
  name: Joi.string().required(),
  beta: Joi.boolean().optional(),
  base: Joi.string().required(),
  api: Joi.string().uri().required(),
  socket: Joi.object({
    host: Joi.string().uri().required(),
    path: Joi.string().required(),
    transport: Joi.string()
      .valid("polling", "websocket")
      .optional()
      .default("websocket"),
  }).optional(),
  credentials: Joi.object({
    provider: Joi.string().valid("DEMO", "COGNITO").required(),
    region: Joi.string().optional(),
    userPoolId: Joi.string().optional(),
    clientId: Joi.string().optional(),
  }).optional(),
  project: Joi.object({
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
    linkedin: Joi.object({
      authUrl: Joi.string().uri().required(),
      clientId: Joi.string().required(),
      redirectUri: Joi.string().uri().required(),
      scope: Joi.string().required(),
      response_type: Joi.string().required(),
      userUrl: Joi.string().uri().required(),
    }).optional(),
  }).optional(),
}).required();

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
              external: Joi.boolean().optional().default(false),
              children: Joi.array()
                .items(
                  Joi.object({
                    title: Joi.string().required(),
                    path: Joi.string().required(),
                    icon: Joi.string().required(),
                    external: Joi.boolean().optional().default(false),
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
}).required();

export const TemplateConfigSchema = Joi.object({
  login: Joi.object({
    variant: Joi.string()
      .valid("classic", "modern")
      .optional()
      .default("classic"),
    image: Joi.string()
      .optional()
      .default("https://minimals.cc/assets/background/overlay_3.jpg"),
    largeIcon: Joi.string()
      .optional()
      .default("https://cdn.nucleoid.com/media/icon.png"),
    icon: Joi.string()
      .optional()
      .default("https://cdn.nucleoid.com/media/icon.png"),
  }).optional(),
  theme: Joi.object({
    variants: Joi.function().optional(),
    mode: Joi.string().valid("light", "dark").optional().default("dark"),
    colorPresets: Joi.string()
      .valid("default", "cyan", "purple", "blue", "orange", "red")
      .optional()
      .default("default"),
  })
    .optional()
    .default({ mode: "dark", colorPresets: "cyan" }),
  projectBar: Joi.object({
    label: Joi.string().optional().default("Project"),
  }).optional(),
  icon: Joi.string()
    .optional()
    .default("https://cdn.nucleoid.com/media/icon.png"),
  settings: Joi.object({
    tabs: Joi.array()
      .items(
        Joi.object({
          label: Joi.string().required(),
          panel: Joi.any().required(),
        })
      )
      .optional()
      .default([]),
  })
    .optional()
    .default({ tabs: [] }),
});
