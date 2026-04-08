import cors from 'cors';
import express from 'express';
import { getMarkers, initializeDb, saveMarker } from './db';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

const reverseGeocode = async (lat: number, long: number): Promise<string> => {
  const fallback = `Pinned at ${lat}, ${long}`;

  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(long)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'vue-skeleton-app/1.0',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as { display_name?: string };
    return payload.display_name?.trim() || fallback;
  } catch {
    return fallback;
  }
};

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.get('/api/markers', async (_, res) => {
  try {
    const markers = await getMarkers();
    res.json(markers);
  } catch (error) {
    res.status(500).json({ message: 'Could not load markers', error });
  }
});

app.post('/api/markers', async (req, res) => {
  const lat = Number(req.body?.lat);
  const long = Number(req.body?.long);

  if (Number.isNaN(lat) || Number.isNaN(long)) {
    res.status(400).json({ message: 'lat and long are required' });
    return;
  }

  try {
    const address = await reverseGeocode(lat, long);
    const id = await saveMarker(lat, long, address);
    res.status(201).json({ id, lat, long, address });
  } catch (error) {
    res.status(500).json({ message: 'Could not save marker', error });
  }
});

initializeDb()
  .then(() => {
    app.listen(port, () => {
      // Keep startup logging simple for local development.
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
