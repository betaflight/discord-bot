import * as dotenv from "dotenv";

dotenv.config();

const t = (s: string) => s.trim();

export default {
  env: process.env.ENV || "dev",
  token: process.env.ENV,
  name: process.env.NAME || "Grace Murray Hopper",
  roles: process.env.ROLES?.split(",").map(t) ?? [],
  labels: process.env.LABELS?.split(",").map(t) ?? [],
  github: {
    org: process.env.GITHUB_ORG,
    token: process.env.GITHUB_TOKEN ?? null,
    repos: (process.env.GITHUB_REPOS ?? "").split(",").map(t),
    tags: (process.env.GITHUB_TAGS ?? "").split(",").map(t),
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }
};
