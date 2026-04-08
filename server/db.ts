import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

export interface Marker {
  id: number;
  lat: number;
  long: number;
  address: string;
}

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'app.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

export const initializeDb = (): Promise<void> =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
          CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            long REAL NOT NULL,
            address TEXT NOT NULL
          )
        `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  });

export const getMarkers = (): Promise<Marker[]> =>
  new Promise((resolve, reject) => {
    db.all<Marker[]>(
      'SELECT id, lat, long, address FROM locations ORDER BY id DESC',
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      },
    );
  });

export const saveMarker = (lat: number, long: number, address: string): Promise<number> =>
  new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO locations (lat, long, address) VALUES (?, ?, ?)',
      [lat, long, address],
      function onInsert(err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      },
    );
  });
