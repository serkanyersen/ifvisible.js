/**
 * @link hello
 */
/* eslint */
// eslint-disable-next-line
import { safeGet, safeSet, getError } from "./utils";

type WebpackCliEnvPrims = boolean | string;
type WebpackCliEnvNested = {
  [key: string]: WebpackCliEnvPrims | WebpackCliEnvNested;
};

interface WebpackCliEnvDefaults {
  WEBPACK_SERVE: boolean | null; // if serve|s is being used.
  WEBPACK_BUILD: boolean | null; // if build|bundle|b is being used.
  WEBPACK_WATCH: boolean | null; // if --watch|watch|w is being used.
  WEBPACK_BUNDLE: boolean | null; // if build|bundle|b is being used.
}

export type WebpackCliEnv = {
  [key: string]: WebpackCliEnvNested | boolean;
} & WebpackCliEnvDefaults;

type TypePrims = "boolean" | "string" | "number";
type TypeNested = { [key: string]: TypePrims | TypeNested };

interface EnvConfigType {
  [key: string]: {
    description: string;
    required?: boolean | string[];
    type: TypePrims | TypeNested;
  };
}

function isNumber(type: TypePrims | TypeNested, value: unknown): boolean {
  return (
    type === "number" &&
    typeof value !== "boolean" &&
    !Number.isNaN(Number(value))
  );
}

let envConfig: EnvConfigType;

export function defineEnv(config: EnvConfigType) {
  // validate config creation
  envConfig = config;
}

export function validateEnv<T extends object>(
  env: WebpackCliEnv
): T & WebpackCliEnvDefaults {
  // get webpack's default values
  const parsed = {
    WEBPACK_SERVE: env.WEBPACK_SERVE || null,
    WEBPACK_BUILD: env.WEBPACK_BUILD || null,
    WEBPACK_WATCH: env.WEBPACK_WATCH || null,
    WEBPACK_BUNDLE: env.WEBPACK_BUNDLE || null,
  } as T & WebpackCliEnvDefaults;

  function deepCheckType(
    typeObj: TypePrims | TypeNested,
    keys: string[] = []
  ): void {
    for (const key of Object.keys(typeObj)) {
      keys.push(key);
      const value = safeGet(env, keys);
      if (value !== undefined) {
        if (typeof typeObj[key] === "string") {
          if (typeObj[key] === typeof safeGet(env, keys)) {
            safeSet(parsed, keys, safeGet(env, keys));
            keys.pop();
          } else if (isNumber(typeObj[key], safeGet(env, keys))) {
            safeSet(parsed, keys, Number(safeGet(env, keys)));
            keys.pop();
          } else {
            // value is not the expected type, error out.
            throw getError(
              `${keys.join(".")} is expected to be ${
                typeObj[key]
              } but got ${typeof safeGet(env, keys)}`
            );
          }
        } else {
          deepCheckType(typeObj[key], keys);
        }
      } else {
        keys.pop();
      }
    }
  }

  for (const key of Object.keys(envConfig)) {
    if (key in env) {
      if (typeof envConfig[key].type === "string") {
        if (envConfig[key].type === typeof env[key]) {
          // value passed type check
          parsed[key] = env[key];
        } else if (isNumber(envConfig[key].type, env[key])) {
          // if type is number, see if we can convert value to number
          parsed[key] = Number(env[key]);
        } else {
          // value is not the expected type, error out.
          throw getError(
            `${key} is expected to be ${
              envConfig[key].type
            } but got ${typeof env[key]}`
          );
        }
      } else {
        // checks and sets value
        deepCheckType(envConfig[key].type, [key]);
      }
    } else {
      // value was not provided
      parsed[key] = null;
    }
  }

  // enforce required
  for (const key of Object.keys(envConfig)) {
    const req = envConfig[key].required;

    if (req === true && (parsed[key] === null || parsed[key] === undefined)) {
      throw getError(`${key} is required`);
    }

    if (Array.isArray(req)) {
      req.forEach((k) => {
        const kk = `${key}.${k}`;
        const val = safeGet(parsed, kk);
        if (val === null || val === undefined) {
          throw getError(`${kk} is required`);
        }
      });
    }
  }

  // reverse check to make sure no unrecognized flag is passed
  for (const key of Object.keys(env)) {
    if (!(key in parsed)) {
      throw getError(`${key} is not recognized`);
    }
  }

  return parsed;
}
