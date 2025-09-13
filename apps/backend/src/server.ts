import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { healthHandler } from './handlers/health.js'
import { appointmentHandler } from './handlers/appointments.js'

const app: Express = express()
const port = process.env['PORT'] || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.get('/health', healthHandler)
app.get('/api/appointments', appointmentHandler)
app.post('/api/appointments', appointmentHandler)

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`)
})

export default app
