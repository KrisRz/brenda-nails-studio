import type { Request, Response } from 'express'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'brenda-nails-backend',
  })
}

export const lambdaHealthHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'brenda-nails-backend',
    }),
  }
}
