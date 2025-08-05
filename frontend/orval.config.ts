import { defineConfig } from 'orval';

export default defineConfig({
  homepage: {
    output: {
      target: './app/api/generated',
      client: 'react-query',
      mode: 'tags-split',
      schemas: './app/api/generated/model',
      baseUrl: process.env.API_URL
        ? `${process.env.API_URL}/api`
        : 'http://localhost:8080/api',
    },
    input: {
      target: process.env.API_URL
        ? `${process.env.API_URL}/api-docs.json`
        : 'http://localhost:8080/api-docs.json',
    },
  },
})

