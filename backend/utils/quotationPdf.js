const fs = require("fs");
const path = require("path");
const htmlToPdf = require("html-pdf-node");
const numberToWords = require("number-to-words");

/**
 * Generates PDF Buffer for quotation
 * @param {Object} quotation
 * @returns {Buffer}
 */
exports.generateQuotationPDFBuffer = async (quotation) => {
    // 1️⃣ Load HTML template
    const templatePath = path.join(
        __dirname,
        "../utils/quotationPI.html"
    );

    let html = fs.readFileSync(templatePath, "utf8");

    // 2️⃣ Calculations
    const freightAmount = Number(quotation.freight) || 0;
    const baseAmount = Number(quotation.expected_price);
    const gstAmount = baseAmount * 0.18;
    const tcsAmount = baseAmount * 0.01;
    const totalAmount = baseAmount + freightAmount + gstAmount + tcsAmount;

    // 3️⃣ Replace placeholders
    html = html
        .replace(/{{customer_name}}/g, quotation.customer.customer_name)
        .replace(
            /{{customer_email}}/g,
            quotation.customer.customer_email || "N/A"
        )
        .replace(
            /{{customer_mobile}}/g,
            quotation.mobile_no || "N/A"
        )
        .replace("{{bank}}", quotation.bank || "N/A")
        .replace(
            /{{ref_no}}/g,
            `REF-${String(quotation.id).padStart(6, "0")}`
        )
        .replace(
            /{{date}}/g,
            new Date(quotation.createdAt).toLocaleDateString(
                "en-IN"
            )
        )
        .replace(
            /{{company_logo}}/g,
            "https://www.ace-cranes.com/public/front/images/logo.png"
        )
        .replace(/{{model_name}}/g, quotation.productModel.name)
        .replace("{{product_details}}", quotation.product_details || "N/A")
        .replaceAll(/{{basic_price}}/g, baseAmount.toFixed(2))
        .replace("{{freight_amount}}", freightAmount.toFixed(2))
        .replace(/{{sub_total}}/g, baseAmount.toFixed(2))
        .replace(/{{gst_amount}}/g, gstAmount.toFixed(2))
        .replace(/{{tcs_amount}}/g, tcsAmount.toFixed(2))
        .replace(/{{grand_total}}/g, totalAmount.toFixed(2))
        .replace(
            /{{amount_in_words}}/g,
            `${numberToWords
                .toWords(totalAmount)
                .toUpperCase()} ONLY`
        );

        const file = { content: html };

        const options = {
          format: "A4",
          printBackground: true,
        };
      
        const pdfBuffer = await htmlToPdf.generatePdf(file, options);
        console.log("********PDF GENERATED*********")
        return pdfBuffer;
};
