import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import BrowserProfile from '@/models/BrowserProfile'

const API_BASE_URL = 'https://api.browser-use.com/api/v1'
const ALLOWED_PROXY_COUNTRIES_PROFILE = new Set<string>(['US','UK','FR','IT','JP','AU','DE','FI','CA','IN'])

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/browser-profiles/${params.profileId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    try {
      await dbConnect()
      await BrowserProfile.findOneAndUpdate(
        { profile_id: data.profile_id },
        { $set: data },
        { upsert: true }
      )
    } catch (e) {
      console.warn('Failed to persist profile to DB:', e)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Browser profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const body = await request.json()

    if (body.proxy) {
      const rawCc = body.proxy_country_code
      const cc = rawCc ? String(rawCc).toUpperCase() : 'US'
      if (!ALLOWED_PROXY_COUNTRIES_PROFILE.has(cc)) {
        return NextResponse.json({ error: 'proxy_country_code is invalid' }, { status: 400 })
      }
      body.proxy_country_code = cc.toLowerCase()
    } else {
      if ('proxy_country_code' in body) delete (body as any).proxy_country_code
    }
    if (body.browser_viewport_width != null) {
      const w = Number(body.browser_viewport_width)
      if (!Number.isFinite(w) || w < 320 || w > 3840) return NextResponse.json({ error: 'browser_viewport_width must be between 320 and 3840' }, { status: 400 })
    }
    if (body.browser_viewport_height != null) {
      const h = Number(body.browser_viewport_height)
      if (!Number.isFinite(h) || h < 240 || h > 2160) return NextResponse.json({ error: 'browser_viewport_height must be between 240 and 2160' }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/browser-profiles/${params.profileId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    try {
      await dbConnect()
      await BrowserProfile.findOneAndUpdate(
        { profile_id: data.profile_id },
        { $set: data },
        { upsert: true }
      )
    } catch (e) {
      console.warn('Failed to persist updated profile to DB:', e)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Browser profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    const apiKey = process.env.BROWSER_USE_API_KEY

    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/browser-profiles/${params.profileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      )
    }

    // Delete locally
    try {
      await dbConnect()
      await BrowserProfile.deleteOne({ profile_id: params.profileId })
    } catch (e) {
      console.warn('Failed to delete profile from DB:', e)
    }
    return NextResponse.json({})
  } catch (error) {
    console.error('Browser profile deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

