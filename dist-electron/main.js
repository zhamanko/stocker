import { ipcMain, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import sqlite3 from "sqlite3";
import path from "path";
let db;
function initDB(__dirname) {
  const dbPath = path.join(__dirname, "..", "data", "stocker.sqlite");
  db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        quantity INTEGER DEFAULT 0,
        price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
  console.log("Database initialized at", dbPath);
  return db;
}
const ProductRepo = {
  getAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM products ORDER BY id DESC`, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  create(product) {
    console.log("Repo creating product", product);
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO products (code, name, category, quantity, price) VALUES (?, ?, ?, ?, ?)`,
        [product.code, product.name, product.category, product.quantity, product.price],
        (err) => err ? reject(err) : resolve()
      );
    });
  },
  update(product) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE products SET code=?, name=?, category=?, quantity=?, price=? WHERE id=?`,
        [product.code, product.name, product.category, product.quantity, product.price, product.id],
        (err) => err ? reject(err) : resolve()
      );
    });
  },
  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM products WHERE id=?`,
        [id],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
};
function registerProductIPC() {
  ipcMain.handle("products:get", () => ProductRepo.getAll());
  ipcMain.handle("products:create", (_, p) => ProductRepo.create(p));
  ipcMain.handle("products:update", (_, p) => ProductRepo.update(p));
  ipcMain.handle("products:delete", (_, id) => ProductRepo.delete(id));
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  try {
    initDB(__dirname$1);
    registerProductIPC();
  } catch (err) {
    console.error("Error during app initialization:", err);
  }
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
