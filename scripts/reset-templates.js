// Simple script to reset templates in the database using the app's API.
// Usage:
//   node scripts/reset-templates.js [--base http://localhost:3000]
// Requires the Next.js server to be running and connected to your DB.

(async () => {
  try {
    const args = process.argv.slice(2)
    const baseFlagIndex = args.indexOf('--base')
    const baseUrl = baseFlagIndex !== -1 && args[baseFlagIndex + 1]
      ? args[baseFlagIndex + 1]
      : (process.env.BASE_URL || 'http://localhost:3000')

    const url = `${baseUrl.replace(/\/$/, '')}/api/templates/reset`
    console.log(`[reset-templates] POST ${url}`)

    const response = await fetch(url, { method: 'POST' })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data?.success === false) {
      console.error('[reset-templates] Failed:', data?.error || response.statusText)
      process.exit(1)
    }

    console.log(`[reset-templates] Success: ${data?.message || 'Templates reset successfully'}`)
    if (typeof data?.count === 'number') {
      console.log(`[reset-templates] Inserted templates: ${data.count}`)
    }
  } catch (err) {
    console.error('[reset-templates] Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
})()


