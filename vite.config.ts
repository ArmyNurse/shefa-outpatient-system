import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import type { Plugin } from "vite";

const notesPath = path.resolve(__dirname, "src/data/notes.json");
const schedulePath = path.resolve(__dirname, "src/data/schedule.json");
const excelPath = path.resolve(__dirname, "doctor-schedual.xlsx");
const usedPasswordsPath = path.resolve(__dirname, "used-passwords.json");

const LIFETIME_PASSWORD = "Mario1234%%%";
const ONE_TIME_PASSWORDS = [
  "31gmj6", "ygk46o", "fz65u9", "x2p03s",
  "ygja5z", "3xloox", "x1uatt", "4glvf0",
  "awdeyx", "i1vppm", "mari12", "hs291n",
];

function readUsedPasswords(): string[] {
  try {
    if (fs.existsSync(usedPasswordsPath)) {
      return JSON.parse(fs.readFileSync(usedPasswordsPath, "utf-8"));
    }
  } catch {}
  return [];
}

function writeUsedPasswords(list: string[]) {
  const dir = path.dirname(usedPasswordsPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(usedPasswordsPath, JSON.stringify(list, null, 2), "utf-8");
}

function apiPlugin(): Plugin {
  return {
    name: "api",
    configureServer(server) {
      const jsonHandler = (filePath: string, req: any, res: any) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method === "GET") {
          try {
            if (fs.existsSync(filePath)) {
              res.end(fs.readFileSync(filePath, "utf-8"));
            } else {
              res.end(JSON.stringify([]));
            }
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to read" }));
          }
          return;
        }
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: string) => { body += chunk; });
          req.on("end", () => {
            try {
              const dir = path.dirname(filePath);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(filePath, body, "utf-8");
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Failed to save" }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not found" }));
      };

      server.middlewares.use("/api/auth/login", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method !== "POST") {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }
        let body = "";
        req.on("data", (chunk: string) => { body += chunk; });
        req.on("end", () => {
          try {
            const { password } = JSON.parse(body);
            if (password === LIFETIME_PASSWORD) {
              res.end(JSON.stringify({ ok: true, type: "lifetime" }));
              return;
            }
            if (ONE_TIME_PASSWORDS.includes(password)) {
              const used = readUsedPasswords();
              if (used.includes(password)) {
                res.end(JSON.stringify({ ok: false, error: "هذا الباسوورد مستخدم من قبل" }));
                return;
              }
              used.push(password);
              writeUsedPasswords(used);
              res.end(JSON.stringify({ ok: true, type: "timed", expiresIn: 10 * 60 * 1000 }));
              return;
            }
            res.end(JSON.stringify({ ok: false, error: "باسوورد غير صحيح" }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: "Invalid request" }));
          }
        });
      });

      server.middlewares.use("/api/notes", (req, res) => jsonHandler(notesPath, req, res));
      server.middlewares.use("/api/admin/doctors", (req, res) => jsonHandler(schedulePath, req, res));

      server.middlewares.use("/api/admin/excel-phones", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method !== "GET") {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }
        try {
          if (fs.existsSync(excelPath)) {
            const buf = fs.readFileSync(excelPath);
            const b64 = buf.toString("base64");
            res.end(JSON.stringify({ base64: b64, name: "doctor-schedual.xlsx" }));
          } else {
            res.end(JSON.stringify({ base64: null }));
          }
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Failed to read excel" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: { port: 3000 },
});
