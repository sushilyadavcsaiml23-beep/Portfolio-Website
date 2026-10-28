import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import contactHandler from './api/contact.js'

const localContactApi: Plugin = {
  name: 'local-contact-api',
  configureServer(server) {
    server.middlewares.use('/api/contact', (req, res) => {
      let rawBody = ''
      req.setEncoding('utf8')
      req.on('data', (chunk: string) => {
        rawBody += chunk
      })
      req.on('end', () => {
        let body: unknown = {}
        if (req.method === 'POST') {
          try {
            body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid JSON request body.' }))
            return
          }
        }

        const apiResponse = {
          status(code: number) {
            res.statusCode = code
            return this
          },
          setHeader(name: string, value: string) {
            res.setHeader(name, value)
            return this
          },
          json(payload: unknown) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
            return this
          },
        }

        void contactHandler({ method: req.method, body }, apiResponse).catch((error: unknown) => {
          server.config.logger.error(
            'Local contact API failed.',
            { error: error instanceof Error ? error : new Error(String(error)) },
          )
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Unable to process your message. Please try again later.' }))
          }
        })
      })
    })
  },
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL']) {
    if (!process.env[key] && env[key]) {
      process.env[key] = env[key]
    }
  }

  return {
    plugins: [react(), localContactApi],
    server: {
      port: 3000,
    },
  }
})
