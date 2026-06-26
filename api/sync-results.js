export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) {
    return res.status(200).json({ ok: true, provider: "football-data.org", count: 0, message: "Calendario local activo. Falta FOOTBALL_DATA_API_KEY." });
  }
  try {
    return res.status(200).json({ ok: true, provider: "football-data.org", count: 0, message: "Calendario local activo. API lista para resultados cuando football-data los entregue." });
  } catch (e) {
    return res.status(200).json({ ok: true, provider: "fallback", count: 0, error: String(e?.message || e) });
  }
}
