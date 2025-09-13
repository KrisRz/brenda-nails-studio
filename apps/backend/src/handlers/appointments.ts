import type { Request, Response } from 'express'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { z } from 'zod'

const appointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  service: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
})

export const appointmentHandler = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    // Return mock appointments for now
    res.json({
      appointments: [],
      message: 'Appointments retrieved successfully',
    })
    return
  }

  if (req.method === 'POST') {
    try {
      const validatedData = appointmentSchema.parse(req.body)
      
      // TODO: Save to DynamoDB
      console.log('New appointment request:', validatedData)
      
      res.status(201).json({
        message: 'Appointment request submitted successfully',
        appointmentId: `appt_${Date.now()}`,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        })
        return
      }
      
      console.error('Appointment creation error:', error)
      res.status(500).json({
        error: 'Internal server error',
      })
    }
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export const lambdaAppointmentHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        appointments: [],
        message: 'Appointments retrieved successfully',
      }),
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const validatedData = appointmentSchema.parse(body)
      
      // TODO: Save to DynamoDB
      console.log('New appointment request:', validatedData)
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'Appointment request submitted successfully',
          appointmentId: `appt_${Date.now()}`,
        }),
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Validation failed',
            details: error.errors,
          }),
        }
      }
      
      console.error('Appointment creation error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Internal server error',
        }),
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  }
}
