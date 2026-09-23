const sequelize = require('../config/db');
const db = require('../models/index');
const Enquiry_Models = db.Enquiry_Models; // 🔁 fix path


const defaultModels = [
    { name: "12XW", price: 1635000, price_variation: 5 },
    { name: "14XW", price: 1710000, price_variation: 5 },
    { name: "15XW", price: 1755000, price_variation: 5 },
    { name: "15XW-E", price: 1820000, price_variation: 5 },
    { name: "16XW", price: 1955000, price_variation: 5 },
    { name: "18XW", price: 2095000, price_variation: 5 },
    { name: "20XW", price: 2265000, price_variation: 5 },
    { name: "25XW", price: 2565000, price_variation: 5 },

    { name: "AML 12-1", price: 17000, price_variation: 5 },
    { name: "AP-27S", price: 18000, price_variation: 5 },
    { name: "ASL-M13", price: 19000, price_variation: 5 },
    { name: "ASL-10", price: 20000, price_variation: 5 },
    { name: "ASL-14", price: 21000, price_variation: 5 },
    { name: "ASL-16", price: 22000, price_variation: 5 },

    { name: "AWP-21A", price: 23000, price_variation: 5 },
    { name: "F-150", price: 2760000, price_variation: 5 },
    { name: "F-170", price: 3180000, price_variation: 5 },
    { name: "F-210", price: 3720000, price_variation: 5 },
    { name: "F-230", price: 4120000, price_variation: 5 },
    { name: "F-250", price: 4320000, price_variation: 5 },
    { name: "F-270", price: 29000, price_variation: 5 },
    { name: "F-300", price: 4700000, price_variation: 5 },
    { name: "F-350", price: 6700000, price_variation: 5 },

    { name: "FC-150", price: 3300000, price_variation: 5 },
    { name: "FP-210", price: 5320000, price_variation: 5 },
    { name: "FX-150", price: 2390000, price_variation: 5 },
    { name: "FX-230", price: 3745000, price_variation: 5 },
    { name: "FX-300", price: 4350000, price_variation: 5 },

    { name: "HY-130", price: 1685000, price_variation: 5 },
    { name: "NX-360", price: 4925000, price_variation: 5 },
    { name: "NXP-150", price: 3355000, price_variation: 5 },
    { name: "NXP-170", price: 4350000, price_variation: 5 },
    { name: "NXT-150", price: 3380000, price_variation: 5 },

    { name: "Rhino-110C", price: 1565000, price_variation: 5 },
    { name: "Rhino-90C", price: 1515000, price_variation: 5 },
];

// 🔹 Add common fields
const buildData = () => {
    return defaultModels.map((item) => ({
        division_id: 1,
        name: item.name,
        price: item.price,
        price_variation: item.price_variation,
        createdAt: new Date(),
        updatedAt: new Date(),
    }));
};

const runSeeder = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ DB Connected");

        // 1. Disable constraints
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // 2. Clear old records (Using truncate is often faster/cleaner)
        await Enquiry_Models.destroy({
            where: {},
            force: true,
            truncate: true // This resets the ID counter too
        });
        console.log("🧹 Old records deleted");

        // 3. Insert new records
        const data = buildData();
        await Enquiry_Models.bulkCreate(data);

        // 4. Re-enable constraints
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log(`🎉 Inserted ${data.length} models successfully`);
        process.exit(0);
    } catch (error) {
        // Ensure checks are back on even if it fails
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.error("❌ Seeder Error:", error);
        process.exit(1);
    }
};

runSeeder();