import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    // Di Prisma v7, gunakan DIRECT_URL di field 'url' untuk migration
    // directUrl sudah tidak ada lagi di v7
    url: env("DIRECT_URL"),
  },
})
