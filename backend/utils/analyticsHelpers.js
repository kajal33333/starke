const { Op, fn, col } = require("sequelize");
const db = require('../models/index');
const Enquiry = db.Enquiry;
const Enquiry_Models = db.Enquiry_Models;

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

/**
 * Extract calendar year from input like "2024-2025"
 */
const getSelectedYear = (yearRange) => {
  return Number(yearRange.split("-")[0]);
};

/**
 * Get month date range (Jan–Dec calendar year)
 */
const getMonthRange = (year, monthIndex) => {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

// calculate achievement (on revenue) for given month
const getMonthlyAchievement = async ({
  userId,
  closedStatusId,
  productIds,
  monthStart,
  monthEnd,
}) => {
  if (!productIds.length) return 0;

  const row = await Enquiry.findOne({
    where: {
      assigned_to: userId,
      enquiry_status: closedStatusId,
      product_model: { [Op.in]: productIds }, 
      createdAt: { [Op.between]: [monthStart, monthEnd] },
    },
    attributes: [[fn("SUM", col("selectedModel.price")), "achieved"]],
    include: [{ model: Enquiry_Models, as: "selectedModel", attributes: [] }],
    raw: true,
  });

  return Number(row?.achieved || 0);
};

// calculate achievement (on quantity) for given month
const monthlyQuantityAchieved = async ({
  userId,
  closedStatusId,
  productIds,
  monthStart,
  monthEnd,
}) => {
  if (!productIds.length) return 0;

  const count = await Enquiry.count({
    where: {
      assigned_to: userId,
      enquiry_status: closedStatusId,
      product_model: { [Op.in]: productIds },
      createdAt: { [Op.between]: [monthStart, monthEnd] },
    },
  });

  return Number(count || 0);
};

//calculate total achievements
const totalQuantityAchieved = async ({
  closedStatusId,
  productIds = [],
}) => {
  if (!closedStatusId || !productIds.length) return 0;

  const count = await Enquiry.count({
    where: {
      enquiry_status: closedStatusId,
      product_model: {
        [Op.in]: productIds,
      },
    },
  });

  return Number(count || 0);
};

module.exports = {
  MONTHS,
  getSelectedYear,
  getMonthRange,
  getMonthlyAchievement,
  monthlyQuantityAchieved,
  totalQuantityAchieved
};
