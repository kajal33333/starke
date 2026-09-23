// 🔹 Generic sanitize (empty → null)
const sanitize = (val) => {
  if (
    val === undefined ||
    val === null ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return null;
  }

  return typeof val === "string" ? val.trim() : val;
};

// 🔹 Integer parser
const toInt = (val) => {
  if (val === "" || val === undefined) return null;
  const num = Number(val);
  return Number.isInteger(num) ? num : null;
};

// 🔹 Float parser
const toFloat = (val) => {
  if (val === "" || val === undefined) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

// 🔹 Date parser
const toDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const sanitizeInt = (val) => {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return null;
  }

  const num = Number(val);

  return Number.isNaN(num) ? null : num;
};

module.exports = {
  sanitize,
  toInt,
  toFloat,
  toDate,
  sanitizeInt
};
