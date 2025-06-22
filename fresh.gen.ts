import config from "./fresh.config.ts";
import * as $0 from "./routes/api/export.ts";
import * as $1 from "./routes/api/preview.ts";
import { createFreshManifest } from "$fresh/server.ts";

export default await createFreshManifest(config, [
  ["./routes/api/export.ts", $0],
  ["./routes/api/preview.ts", $1],
]);
