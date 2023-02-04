export type FzfOptions = {
  readonly "--ansi"?: true;
  "--bind"?:
    | ReadonlyArray<{
      key: string;
      action: string;
    }>
    | string;
  readonly "--expect"?: ReadonlyArray<string> | string;
  readonly "--history"?: string;
  readonly "--no-separator"?: true;
  "--header"?: string;
  "--header-lines"?: string;

  // deno-lint-ignore no-explicit-any
  [otherProperty: string]: any;
};

export type ResourceLine<T> = {
  data: T;
  displayText: string;
};

export type JsonResource<T> = {
  type: "json";
  lines: Array<ResourceLine<T>>;
  options?: FzfOptions;
};
