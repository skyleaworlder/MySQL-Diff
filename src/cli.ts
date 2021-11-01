require("module-alias/register");
import { readFileSync } from "fs";
import { processTable } from "@/lexer/Processor";

const src_file_path = process.argv[2];
const tar_file_path = process.argv[3];
let src_lines = readFileSync(src_file_path as string, "utf-8").split("\n").filter(Boolean);
let tar_lines = readFileSync(tar_file_path as string, "utf-8").split("\n").filter(Boolean);

let [src_tbl, ] = processTable(src_lines);
let [tar_tbl, ] = processTable(tar_lines);

console.log(src_tbl.transform(src_tbl.compareTo(tar_tbl)));
