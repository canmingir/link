class Context {
  constructor(data = {}) {
    this.login = data.login !== undefined ? data.login : false;
    this.itemId = data.itemId || null;

    this.specification = {
      api: [],
      functions: [],
      types: [],
      declarations: [],
      ...(data.specification || {}),
    };

    this.pages = {
      api: {
        selected: { path: "/", method: "get" },
        dialog: {
          type: null,
          action: null,
          open: false,
          view: null,
          map: {},
          params: {},
        },
        resourceMenu: {
          open: false,
          anchor: null,
          path: null,
        },
        ...(data.pages?.api || {}),
      },
      functions: {
        selected: null,
        dialog: {
          type: null,
          open: false,
        },
        AIDialog: {
          open: false,
        },
        ...(data.pages?.functions || {}),
      },
      logic: {
        selected: null,
        AIDialog: {
          open: false,
        },
        ...(data.pages?.logic || {}),
      },
      query: {
        results: null,
        ...(data.pages?.query || {}),
      },
      ...(data.pages || {}),
    };
  }

  static copy(context) {
    const copied = new Context();

    copied.login = context.login;
    copied.itemId = context.itemId;

    copied.specification = {
      api: context.specification?.api ? [...context.specification.api] : [],
      functions: context.specification?.functions
        ? [...context.specification.functions]
        : [],
      types: context.specification?.types
        ? [...context.specification.types]
        : [],
      declarations: context.specification?.declarations
        ? [...context.specification.declarations]
        : [],
    };

    copied.pages = JSON.parse(JSON.stringify(context.pages || {}));

    return copied;
  }

  get(path) {
    const keys = path.split(".");
    let result = this;

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }

    return result;
  }
}

export default Context;
