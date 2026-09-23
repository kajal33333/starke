const fs = require("fs");
const path = require("path");

const inputPath = path.join(
  __dirname,
  "data",
  "cities.json"
);

const outputPath = path.join(
  __dirname,
  "data",
  "cities.csv"
);

try {
  const jsonData = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
  );

  const rows = [
    ["name", "state"],
    ...jsonData.map((city) => [
      city.name?.trim() || "",
      city.state?.trim() || "",
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value).replace(/"/g, '""');
          return `"${text}"`;
        })
        .join(",")
    )
    .join("\n");

  fs.writeFileSync(
    outputPath,
    csv,
    "utf8"
  );

  console.log(
    `✅ CSV created successfully: ${outputPath}`
  );

  console.log(
    `📦 Total records: ${jsonData.length}`
  );
} catch (error) {
  console.error(
    "❌ Conversion failed:",
    error.message
  );
}