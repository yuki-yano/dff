import { fzfOptionsToArray } from "./options.ts";
import { FzfOptions, JsonResource, ResourceLine } from "./types/fzf.ts";

export async function dff<T>(
  resource: JsonResource<T>,
): Promise<ReadonlyArray<T>> {
  return await exec<T>(resource, {
    "--ansi": true,
    "--multi": true,
    "--with-nth": "2..",
  });
}

const PREFIX_SPACE = "   ";

export const resourceLineToFzfLine = <T>(
  resourceLine: ResourceLine<T>,
): string => {
  return `${PREFIX_SPACE}${
    encodeURIComponent(JSON.stringify(resourceLine.data))
  } ${resourceLine.displayText}`;
};

async function exec<T>(
  resource: JsonResource<T>,
  options: FzfOptions,
): Promise<ReadonlyArray<T>> {
  const cmd = Deno.run({
    cmd: ["fzf", ...fzfOptionsToArray(options)],
    stdin: "piped",
    stdout: "piped",
  });

  resource.lines.map((line) => resourceLineToFzfLine(line)).join("\n");

  cmd.stdin.write(
    new TextEncoder().encode(
      resource.lines.map((line) => resourceLineToFzfLine(line)).join("\n"),
    ),
  )
    .then(() => cmd.stdin.close());

  if ((await cmd.status()).code !== 0) {
    throw Error("cancelled");
  }

  const resultLines = new TextDecoder().decode(await cmd.output()).split("\n")
    .filter((v) => v !== "");

  const lines = resultLines.map((line) => {
    return JSON.parse(
      decodeURIComponent(line.trim().split(" ")[0]),
    ) as T;
  });

  return lines;
}
