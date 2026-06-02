import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ── Races ─────────────────────────────────────────────────────────────────

export const getSeasons = () =>
  api.get("/races/seasons").then((r) => r.data);

export const getRaces = (season) =>
  api.get("/races", { params: { season } }).then((r) => r.data);

export const getRace = (raceId) =>
  api.get(`/races/${raceId}`).then((r) => r.data);

// ── Drivers ───────────────────────────────────────────────────────────────

export const getDrivers = (season) =>
  api.get("/drivers", { params: { season } }).then((r) => r.data);

export const getStandings = (season) =>
  api.get("/drivers/standings", { params: { season } }).then((r) => r.data);

export const compareDrivers = (driver1Id, driver2Id, season) =>
  api
    .get("/drivers/compare", {
      params: { driver1_id: driver1Id, driver2_id: driver2Id, season },
    })
    .then((r) => r.data);

export default api;
