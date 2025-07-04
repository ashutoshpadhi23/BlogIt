import { createRequire } from "module";
import path from "path";

import { absolutePath } from "./constants.js";
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const alias = {
  "@bigbinary/neetoui/dist": path.resolve(
    __dirname,
    "../../node_modules/@bigbinary/neetoui/dist/index.css"
  ),
  images: path.resolve(process.cwd(), "app/assets/images"),
  crypto: require.resolve("crypto-browserify"),
  path: require.resolve("path-browserify"),
  buffer: require.resolve("buffer"),
  stream: require.resolve("stream-browserify"),
  apis: absolutePath("src/apis"),
  channels: absolutePath("src/channels"),
  common: absolutePath("src/common"),
  commons: absolutePath("src/components/commons"),
  components: absolutePath("src/components"),
  constants: absolutePath("src/constants"),
  neetoui: "@bigbinary/neetoui",
  neetoicons: "@bigbinary/neeto-icons",
  utils: absolutePath("src/utils"),
  assets: absolutePath("../assets"),
};

export { alias };
