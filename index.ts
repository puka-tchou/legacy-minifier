import fg from "fast-glob";
import { development } from "./src/development.js";
import { production } from "./src/production.js";

/**
 * @param js The list of Javascript files to be processed, or a glob.
 * @param css The list of CSS files to be processed, or a glob.
 * @see https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax
 */
const main = (js: string[] | string, css: string[] | string) => {
  // If `js` or `css` is a string, we process it with `fg.sync()` to return a list of files.
  const jsFiles =
    typeof js === "string"
      ? fg.globSync(js.split(",").map((str) => str.replace(/ /g, "")))
      : js;
  const cssFiles =
    typeof css === "string"
      ? fg.globSync(css.split(",").map((str) => str.replace(/ /g, "")))
      : css;

  const args = process.argv;
  const sourcemap = args.includes("--map");
  const isProduction = args.includes("--prod");

  let notice = "";
  notice =
    typeof js === "string"
      ? `Javascript files defined via a glob pattern.`
      : `Javascript files passed as an array.`;
  notice =
    typeof css === "string"
      ? `${notice}\nCSS files defined via a glob pattern.`
      : `${notice}\nCSS files passed as an array.`;

  if (typeof js === "string" || typeof css === "string") {
    notice = `${notice}\nRead more on glob patterns at: https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax\n`;
  }

  console.log(notice);

  if (!isProduction) {
    development([...jsFiles, ...cssFiles]);
  } else {
    production([...jsFiles, ...cssFiles], sourcemap);
  }
};

export { main as default };
