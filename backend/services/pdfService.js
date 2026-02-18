const PDFDocument = require("pdfkit");

// --- ACCENT COLORS ---
const COLORS = {
    primaryIndigo: "#4F46E5",
    slate800: "#1E293B",
    slate600: "#475569",
    slate400: "#94A3B8",
    bgSlate: "#F8FAFC",
    tableHeaderBg: "#EDF2F7", // Light gray for table headers
    border: "#E2E8F0",
    lightIndigo: "#EEF2FF"
};

// --- FONTS ---
const FONTS = {
    bold: "Helvetica-Bold",
    regular: "Helvetica",
    oblique: "Helvetica-Oblique"
};

/**
 * Common PDF Service to enforce consistent UI design.
 */
class PDFService {
    constructor(doc) {
        this.doc = doc;
        this.margins = { top: 50, left: 50, right: 50, bottom: 50 };
        this.width = 595.28; // A4 width in points
        this.contentWidth = this.width - this.margins.left - this.margins.right;
    }

    /**
     * Set up basic document properties
     */
    setupDocument() {
        // No specific setup needed for pdfkit instance passed in, assumming A4/margins set by caller or defaults.
        // But we can enforce them if we created the doc here. 
        // Since doc is passed, we just use it.
    }

    /**
     * Draw the standard header with Logo and Title
     * @param {string} title - Document title (e.g., "TAX STATEMENT", "PAYSLIP")
     * @param {string} subtitle - Subtitle (e.g., "FY 2023-2024", "March 2024")
     */
    drawHeader(title, subtitle) {
        const doc = this.doc;

        // Branding: Stylized "P" Logo Box
        doc.rect(50, 45, 40, 40).fill(COLORS.primaryIndigo);
        doc.fillColor("white").fontSize(24).font(FONTS.bold).text("P", 62, 53);

        // Company Name
        doc.fillColor(COLORS.slate800).fontSize(20).font(FONTS.bold).text("PayrollPro", 100, 50);
        doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.slate400).text("Institutional Intelligence Engine", 100, 72);

        // Document Title (Right Aligned)
        doc.fillColor(COLORS.primaryIndigo).fontSize(14).font(FONTS.bold).text(title, 400, 55, { align: "right" });
        if (subtitle) {
            doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.slate600).text(subtitle, 400, 72, { align: "right" });
        }

        // Horizontal Line
        doc.moveTo(50, 100).lineTo(550, 100).strokeColor(COLORS.border).lineWidth(1).stroke();
        doc.moveDown(2);
    }

    /**
     * Draw Employee and Document Details
     * @param {Object} leftDetails - { label: "Label", value: "Value" }
     * @param {Object} rightDetails - { label: "Label", value: "Value" }
     * @param {number} startY - Y position to start drawing
     */
    drawEntityDetails(leftDetails, rightDetails, startY = 120) {
        const doc = this.doc;

        // Left Side
        if (leftDetails) {
            doc.fillColor(COLORS.slate400).fontSize(8).font(FONTS.bold).text(leftDetails.title || "EMPLOYEE DETAILS", 50, startY);
            let currentY = startY + 15;
            leftDetails.items.forEach(item => {
                doc.fillColor(COLORS.slate800).fontSize(10).font(FONTS.bold).text(item.value, 50, currentY);
                if (item.subValue) {
                    doc.fillColor(COLORS.slate600).fontSize(9).font(FONTS.regular).text(item.subValue, 50, currentY + 12);
                    currentY += 12;
                }
                currentY += 15;
            });
        }

        // Right Side
        if (rightDetails) {
            const rightX = 350;
            doc.fillColor(COLORS.slate400).fontSize(8).font(FONTS.bold).text(rightDetails.title || "DOCUMENT DETAILS", rightX, startY);
            let currentY = startY + 15;
            rightDetails.items.forEach(item => {
                doc.fillColor(COLORS.slate800).fontSize(10).font(FONTS.bold).text(`${item.label}:`, rightX, currentY);
                doc.font(FONTS.regular).text(item.value, rightX + 80, currentY); // Simple inline for now
                currentY += 15;
            });
        }

        doc.moveDown(4); // Add spacing after details
    }

    /**
     * Draw a Definition List style section (like Computation Summary)
     * @param {string} title - Section Title
     * @param {Array} rows - Array of { label, value, isTotal, isHighlight }
     * @param {number} startY - Y position
     */
    drawSummaryTable(title, rows, startY) {
        const doc = this.doc;
        const rowHeight = 35;
        let currentY = startY;

        // Section Title
        if (title) {
            doc.rect(50, currentY, 500, 30).fill(COLORS.bgSlate);
            doc.fillColor(COLORS.slate800).fontSize(10).font(FONTS.bold).text(title.toUpperCase(), 65, currentY + 10);
            currentY += 40;
        }

        rows.forEach(row => {
            if (row.isHighlight) {
                // Highlight background (e.g., Net Pay)
                doc.rect(50, currentY, 500, rowHeight).fill("#FFD700"); // Gold highlight for Net Pay/Tax
            } else if (row.isTotal) {
                doc.rect(50, currentY, 500, rowHeight).fill(COLORS.lightIndigo);
            }

            doc.fillColor(COLORS.slate600).fontSize(10).font(FONTS.regular).text(row.label, 70, currentY + 12);

            const amountText = typeof row.value === 'number'
                ? `INR ${row.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                : row.value;

            doc.fillColor(row.isHighlight || row.isTotal ? COLORS.primaryIndigo : COLORS.slate800)
                .fontSize(row.isHighlight || row.isTotal ? 12 : 10)
                .font(FONTS.bold)
                .text(amountText, 400, currentY + 12, { align: "right", width: 130 });

            if (!row.isHighlight && !row.isTotal) {
                doc.moveTo(50, currentY + rowHeight).lineTo(550, currentY + rowHeight).strokeColor("#F1F5F9").lineWidth(1).stroke();
            }

            currentY += rowHeight;
        });

        return currentY;
    }

    /**
     * Draw Standard Footer
     * @param {string} id - Document ID
     */
    drawFooter(id) {
        const doc = this.doc;
        const footerY = 750; // Fixed footer position for A4

        doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor(COLORS.border).lineWidth(1).stroke();
        doc.fontSize(8).font(FONTS.regular).fillColor(COLORS.slate400)
            .text("This is an electronically generated document authorized by the PayrollPro Intelligence Engine. No physical signature is required.", 50, footerY + 15, { align: "center", width: 500 });

        doc.text(`Doc ID: ${id} | Generated at: ${new Date().toISOString()}`, 50, footerY + 30, { align: "center", width: 500 });
    }

    /**
    * Draw Section Header
    * @param {string} title
    * @param {number} y
    */
    drawSectionHeader(title, y) {
        const doc = this.doc;
        doc.fillColor(COLORS.slate400).fontSize(8).font(FONTS.bold).text(title.toUpperCase(), 50, y);
        return y + 20;
    }
}

module.exports = PDFService;
