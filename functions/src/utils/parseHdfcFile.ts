import xlsx from "node-xlsx";
import {StatementUpload} from "./types";

const parseHdfcFile = (
    file: string | ArrayBuffer,
    options?: Record<string, any>
): StatementUpload[] => {
  // parse xlsx file
  const [sheet]: any = xlsx.parse(file, options);
  sheet.data.splice(0, 22);
  // return sheet.data;

  const data: Array<StatementUpload> = [];
  for (const row of sheet.data) {
    if (row.length === 0 || row[0].includes("*")) {
      break;
    }
    data.push({
      date: row[0],
      description: row[1],
      referenceId: row[2],
      amount: parseFloat(row[5] || row[4]),
      deposit: !row[4],
    });
  }

  return data;
};

export default parseHdfcFile;
