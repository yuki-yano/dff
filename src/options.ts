import { FzfOptions } from "./types/fzf.ts";

const DEFINED_FZF_OPTION_TYPES_IN_PLUGIN = [
  "--ansi",
  "--bind",
  "--expect",
] as const;

const joinBind = (
  bind: ReadonlyArray<{
    key: string;
    action: string;
  }>,
): string => {
  return bind.map(({ key, action }) => `${key}:${action}`).join(",");
};

const definedOptionsToArray = (options: FzfOptions) => {
  const arrayOptions: Array<string> = [];

  if (options["--ansi"] != null) {
    arrayOptions.push("--ansi");
  }
  if (options["--bind"] != null && Array.isArray(options["--bind"])) {
    arrayOptions.push(`--bind=${joinBind(options["--bind"])}`);
  } else if (
    options["--bind"] != null && typeof options["--bind"] === "string"
  ) {
    arrayOptions.push(`--bind=${options["--bind"]}`);
  }
  if (options["--expect"] != null && Array.isArray(options["--expect"])) {
    if (options["--expect"].length > 0) {
      arrayOptions.push(`--expect="${options["--expect"].join(",")}"`);
    } else {
      arrayOptions.push(`--expect="alt-enter"`);
    }
  } else if (
    options["--expect"] != null && typeof options["--expect"] === "string"
  ) {
    arrayOptions.push(`--expect=${options["--expect"]}`);
  }

  return arrayOptions;
};

export function fzfOptionsToArray(options: FzfOptions) {
  const arrayOptions = definedOptionsToArray(options);

  Object.entries(options)
    .filter(([key]) =>
      !(DEFINED_FZF_OPTION_TYPES_IN_PLUGIN as ReadonlyArray<string>).includes(
        key,
      )
    )
    .forEach(([key, value]) => {
      if (typeof value !== "string") {
        arrayOptions.push(`${key}`);
      } else {
        arrayOptions.push(`${key}=${value}`);
      }
    });

  return arrayOptions;
}
