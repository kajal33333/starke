const fs = require("fs");
const path = require("path");

/** Runtime API error log (gitignored). Lives next to other helpers. */
const LOG_FILE = path.join(__dirname, "error.log");

/**
 * Append an error entry for manual review. Safe to call from catch blocks;
 * failures to write never throw.
 * @param {import('express').Request} req
 * @param {Error} error
 * @param {string} [context] - handler name, e.g. "createDailyReport"
 */
function logApiError(req, error, context = "") {
  try {
    const ts = new Date().toISOString();
    const method = req?.method ?? "?";
    const url = req?.originalUrl ?? req?.url ?? "?";
    const ctx = context ? ` | ${context}` : "";
    const status =
      error && typeof error.statusCode === "number" ? error.statusCode : "";
    const name = error?.name ?? "";
    const message = error?.message ?? String(error);
    const stack = error?.stack ?? "";
    const block = [
      `---------- ${ts}${ctx} ----------`,
      `${method} ${url}${status !== "" ? ` | statusCode=${status}` : ""}${
        name ? ` | ${name}` : ""
      }`,
      `message: ${message}`,
      stack ? `stack:\n${stack}` : "",
      "----------------------------------------",
      "",
    ].join("\n");
    fs.appendFileSync(LOG_FILE, `${block}\n`, "utf8");
  } catch (e) {
    console.error("logApiError failed:", e.message);
  }
}

module.exports = { logApiError, LOG_FILE };
