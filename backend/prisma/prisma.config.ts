import { defineConfig } from '@prisma/client'

export default defineConfig({
  datasources: {
    db: {
      adapter: 'postgresql',              // database type
      url: process.env.DATABASE_URL,      // connection string from .env
    },
  },
})
