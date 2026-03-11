"use client";

import { useAppState } from "@/lib/store";
import { motion } from "framer-motion";
import * as XLSX from "xlsx-js-style";

export default function ExcelExport() {
  const { jobInfo, schedule } = useAppState();

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // Group schedule by day
    const dayGroups: Record<string, typeof schedule> = {};
    schedule.forEach((entry) => {
      if (!dayGroups[entry.dayLabel]) dayGroups[entry.dayLabel] = [];
      dayGroups[entry.dayLabel].push(entry);
    });

    // Get all unique units
    const allUnits = [...new Set(schedule.map((e) => e.unitName))].sort();

    // Build worksheets per day (or one combined)
    const rows: any[][] = [];

    // Helper for styling
    const boldCenter = { font: { bold: true }, alignment: { horizontal: "center", vertical: "center" } };
    const boldLeft = { font: { bold: true }, alignment: { horizontal: "left", vertical: "center" } };
    const normalCenter = { alignment: { horizontal: "center", vertical: "center" } };
    const normalLeft = { alignment: { horizontal: "left", vertical: "center" } };
    
    // Borders for tables
    const tableBorder = { 
      top: { style: "medium" }, 
      bottom: { style: "medium" }, 
      left: { style: "medium" }, 
      right: { style: "medium" } 
    };

    const titleStyle = { font: { bold: true, sz: 20 }, alignment: { horizontal: "center", vertical: "center" } };
    const dayHeaderStyle = { font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "333333" } }, alignment: { horizontal: "center", vertical: "center" } };
    const tableHeaderStyle = { font: { bold: true }, border: tableBorder, alignment: { horizontal: "center", vertical: "center" } };
    const tableCellStyleCenter = { border: tableBorder, alignment: { horizontal: "center", vertical: "center" } };
    const tableCellStyleLeft = { border: tableBorder, alignment: { horizontal: "left", vertical: "center" } };
    const tableCellStyleBoldCenter = { font: { bold: true }, border: tableBorder, alignment: { horizontal: "center", vertical: "center" } };
    
    const subLabelStyle = { font: { bold: true }, alignment: { horizontal: "right", vertical: "center" } };

    // === Header rows matching the example ===
    // Row 1: Logo placeholder + "Test Schedule" + Date
    rows.push([
      { v: "INDO TECH", s: boldLeft },
      "",
      "",
      { v: "TEST SCHEDULE", s: titleStyle },
      "",
      "",
      { v: "DATE:", s: subLabelStyle },
      { v: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }), s: normalLeft },
    ]);
    
    // Merge title cells (cols 3, 4, 5)
    const merges = [
      { s: { r: 0, c: 3 }, e: { r: 0, c: 5 } } 
    ];

    rows.push([]);

    // Date row removed - moved to Row 1


    rows.push([]);

    // Job Info (Bold Labels, Normal Values)
    rows.push([]);

    // Job Info (Vertical orientation A & B)
    rows.push([
      { v: "WORK ORDER:", s: boldLeft },
      { v: jobInfo.workOrderNumber || "-", s: normalLeft },
    ]);
    rows.push([
      { v: "CUSTOMER:", s: boldLeft },
      { v: jobInfo.customerName || "-", s: normalLeft },
    ]);
    rows.push([
      { v: "VOLTAGE LEVEL:", s: boldLeft },
      { v: jobInfo.voltageLevel || "-", s: normalLeft },
    ]);
    rows.push([
      { v: "RATING:", s: boldLeft },
      { v: jobInfo.transformerRating || "-", s: normalLeft },
    ]);
    rows.push([
      { v: "COOLING TYPE:", s: boldLeft },
      { v: jobInfo.coolingType || "-", s: normalLeft },
    ]);
    rows.push([
      { v: "NO. OF WINDING:", s: boldLeft },
      { v: jobInfo.numberOfWindings || "-", s: normalLeft },
    ]);

    rows.push([]);
    rows.push([]);

    let currentRow = rows.length;

    // For each day, create a section
    const sortedDays = Object.keys(dayGroups).sort((a, b) => {
      const numA = parseInt(a.replace("Day ", ""));
      const numB = parseInt(b.replace("Day ", ""));
      return numA - numB;
    });

    sortedDays.forEach((dayLabel) => {
      const entries = dayGroups[dayLabel];
      
      const totalCols = 3 + allUnits.length; // List Of Test (1) + Units (N) + Shift (1) + Type (1)

      // Day header (e.g., "DAY 1")
      const dayHeaderRow = Array(totalCols).fill("");
      dayHeaderRow[0] = { v: dayLabel.toUpperCase(), s: dayHeaderStyle };
      rows.push(dayHeaderRow);
      
      merges.push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: totalCols - 1 } });
      currentRow++;

      // Column headers matching the example image (NO STATUS COLUMN)
      const headerRow: any[] = [{ v: "LIST OF TEST", s: { ...tableHeaderStyle, alignment: { horizontal: "left", vertical: "center" } } }];
      
      const unitTotalWidthCols = allUnits.length > 0 ? allUnits.length : 1; // At least one for alignment purposes
      
      allUnits.forEach((u) => headerRow.push({ v: u.toUpperCase(), s: tableHeaderStyle }));
      headerRow.push({ v: "DAY/NIGHT", s: tableHeaderStyle }, { v: "TYPE OF TEST", s: tableHeaderStyle });
      rows.push(headerRow);
      currentRow++;

      // Get unique test names for this day
      const testNames = [...new Set(entries.map((e) => e.testName))];

      testNames.forEach((testName) => {
        const row: any[] = [{ v: testName, s: tableCellStyleLeft }];
        const testEntries = entries.filter((e) => e.testName === testName);

        // Fill unit columns - show ✓ in the unit column if scheduled
        allUnits.forEach((unit) => {
          const unitEntry = testEntries.find((e) => e.unitName === unit);
          row.push({ v: unitEntry ? "✓" : "-", s: tableCellStyleBoldCenter });
        });

        // Use the first entry's data for shift, type
        const firstEntry = testEntries[0];
        row.push(
          { v: firstEntry.shift === "Day Test" ? "DAY" : "NIGHT", s: tableCellStyleCenter },
          { v: firstEntry.testType.replace(" Test", "").toUpperCase(), s: tableCellStyleCenter }
        );

        rows.push(row);
        currentRow++;
      });

      // Add spacing between days
      rows.push([]);
      rows.push([]);
      currentRow += 2;
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!merges"] = merges;

    // Set auto-fit column widths (approximate based on characters to fit A4)
    // A4 width typically holds ~100-110 standard characters across depending on margins
    ws["!cols"] = [
      { wch: 60 }, // List of test (Column A - massive)
      ...allUnits.map(() => ({ wch: 10 })), // Units (Columns B, C, etc. - narrow)
      { wch: 15 }, // DAY/NIGHT (Column D/E - normal)
      { wch: 15 }, // TYPE OF TEST (Column E/F - normal)
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Test Schedule");

    // Download
    const fileName = `Test_Schedule_${jobInfo.workOrderNumber || "Draft"}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={schedule.length === 0}
      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 backdrop-blur-md cursor-pointer ${
        schedule.length > 0
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/25 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]"
          : "bg-slate-900/40 text-slate-600 border border-white/5 cursor-not-allowed"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export to Excel
      {schedule.length > 0 && (
        <span className="text-xs opacity-60">({schedule.length} tests)</span>
      )}
    </motion.button>
  );
}
