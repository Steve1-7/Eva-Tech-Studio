import { NextResponse } from 'next/server'
import { requireAdmin } from './rbac'

type Handler = (request: Request, ctx?: any) => Promise<Response | NextResponse>

export function withAdmin(handler: Handler): Handler {
  return async (request: Request, ctx?: any) => {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(request, ctx)
  }
}

export function withOptionalAdmin(handler: Handler): Handler {
  return async (request: Request, ctx?: any) => {
    // allow handler to inspect admin status via requireAdmin if needed
    return handler(request, ctx)
  }
}

export default {
  withAdmin,
  withOptionalAdmin
}
