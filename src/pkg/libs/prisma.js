import "dotenv/config";
import { env } from "node:process";
import { PrismaClient } from "../../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${env.DATABASE_URL}`;

const adapter = new PrismaPg({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

export const getPrisma = () => prisma;