export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  const provider = "football-data.org";

  const LOCAL_MATCHES = [
    ["53452545","South Africa","Canada","2026-06-28T19:00:00Z"],
    ["53452557","Brazil","Japan","2026-06-29T17:00:00Z"],
    ["53452541","Germany","Paraguay","2026-06-29T20:30:00Z"],
    ["53452547","Netherlands","Morocco","2026-06-30T01:00:00Z"],
    ["53452561","Ivory Coast","Norway","2026-06-30T17:00:00Z"],
    ["53452543","France","Sweden","2026-06-30T21:00:00Z"],
    ["53452563","Mexico","Ecuador","2026-07-01T01:00:00Z"],
    ["53452565","England","DR Congo","2026-07-01T16:00:00Z"],
    ["53452555","Belgium","Senegal","2026-07-01T20:00:00Z"],
    ["53452553","United States","Bosnia and Herzegovina","2026-07-02T00:00:00Z"],
    ["53452551","Spain","Austria","2026-07-02T19:00:00Z"],
    ["53452549","Colombia","Croatia","2026-07-02T23:00:00Z"],
    ["53452505","Switzerland","Algeria","2026-07-03T03:00:00Z"],
    ["53452503","Australia","Egypt","2026-07-03T18:00:00Z"],
    ["53452569","Argentina","Cape Verde","2026-07-03T22:00:00Z"],
    ["53452507","Colombia","Ghana","2026-07-04T01:30:00Z"]
  ].map(([id, home, away, startUtc]) => ({ id, home, away, startUtc }));

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  function sameTeam(a, b) {
    const aa = normalize(a), bb = normalize(b);
    if (!aa || !bb) return false;
    if (aa === bb) return true;
    const aliases = {
      "usa": "unitedstates",
      "us": "unitedstates",
      "england": "england",
      "cotedivoire": "ivorycoast",
      "ivorycoast": "ivorycoast",
      "southafrica": "southafrica",
      "bosniaherzegovina": "bosniaandherzegovina",
      "bosniaandherzegovina": "bosniaandherzegovina",
      "capeverde": "capeverde",
      "caboverde": "capeverde"
    };
    return (aliases[aa] || aa) === (aliases[bb] || bb);
  }

  function closeTime(a, b) {
    const da = new Date(a).getTime();
    const db = new Date(b).getTime();
    if (!Number.isFinite(da) || !Number.isFinite(db)) return true;
    return Math.abs(da - db) <= 1000 * 60 * 60 * 24;
  }

  function mapMatch(apiMatch) {
    const home = apiMatch.homeTeam?.name || apiMatch.homeTeam?.shortName || apiMatch.homeTeam?.tla;
    const away = apiMatch.awayTeam?.name || apiMatch.awayTeam?.shortName || apiMatch.awayTeam?.tla;
    const utc = apiMatch.utcDate;
    return LOCAL_MATCHES.find(m =>
      closeTime(m.startUtc, utc) &&
      ((sameTeam(m.home, home) && sameTeam(m.away, away)) || (sameTeam(m.home, away) && sameTeam(m.away, home)))
    );
  }

  function scoreFrom(match, local) {
    const ft = match.score?.fullTime || {};
    const rt = match.score?.regularTime || {};
    const home = ft.home ?? rt.home;
    const away = ft.away ?? rt.away;
    if (home == null || away == null) return null;

    const apiHome = match.homeTeam?.name || match.homeTeam?.shortName || match.homeTeam?.tla;
    const reversed = local && !sameTeam(local.home, apiHome);

    return {
      matchId: local.id,
      home: reversed ? Number(away) : Number(home),
      away: reversed ? Number(home) : Number(away),
      status: match.status || "FINISHED",
      footballDataId: match.id
    };
  }

  if (!token) {
    return res.status(200).json({
      ok: false,
      provider,
      count: 0,
      results: [],
      message: "Falta FOOTBALL_DATA_API_KEY en Vercel."
    });
  }

  try {
    const dateFrom = "2026-06-28";
    const dateTo = "2026-07-04";
    const url = `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const apiRes = await fetch(url, { headers: { "X-Auth-Token": token } });
    const text = await apiRes.text();

    if (!apiRes.ok) {
      return res.status(200).json({
        ok: false,
        provider,
        count: 0,
        results: [],
        status: apiRes.status,
        message: text.slice(0, 500)
      });
    }

    const data = JSON.parse(text);
    const results = [];
    for (const m of data.matches || []) {
      const local = mapMatch(m);
      if (!local) continue;
      const scored = scoreFrom(m, local);
      if (!scored) continue;

      // Guardar finalizados y también partidos con marcador si API lo entrega.
      if (["FINISHED", "IN_PLAY", "PAUSED"].includes(m.status) || scored.home != null) {
        results.push(scored);
      }
    }

    return res.status(200).json({
      ok: true,
      provider,
      count: results.length,
      results,
      message: `Resultados encontrados: ${results.length}`
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      provider,
      count: 0,
      results: [],
      message: String(e?.message || e)
    });
  }
}
