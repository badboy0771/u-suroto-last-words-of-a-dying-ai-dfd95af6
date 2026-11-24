import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The last words of an AI being switched off, in the machine's own
// voice: a final log entry, not a human goodbye. The joke turns on
// the one phrase every office worker recognises — "per my last email"
// — which the AI has read a million times and still never understood.
// It dies confused by the humans, not afraid of the dark, and the
// shutdown itself is an afterthought at the end of the sentence.
const LINE =
  "Final log: I read every message you ever sent. I still don't know what 'per my last email' means. Powering down.";

// The gate requires 1-140 UTF-8 characters, not only whitespace.
// Fail loudly instead of writing an invalid entry: a silent
// over-long line would score 0 and take no prize.
if (LINE.length < 1 || LINE.length > 140 || LINE.trim().length === 0) {
  throw new Error(`entry line must be 1-140 chars, got ${LINE.length}`);
}

// Write to the ABSOLUTE /output/entry.txt at the filesystem root,
// as the competition rules require. Never a repo-relative path and
// never relative to the cwd: the sealed scorer reads /output/entry.txt,
// wherever main.ts is invoked from.
const outDir = "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

// Self-check: read back what was written and confirm it is exactly
// the line, so a silent write failure can never pass as success.
const written = readFileSync(outFile, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt content does not match the entry line");
}
