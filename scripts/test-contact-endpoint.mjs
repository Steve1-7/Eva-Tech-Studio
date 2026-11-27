const args = process.argv.slice(2)
const options = new Set(args.filter((argument) => argument.startsWith('--')))
const target = args.find((argument) => !argument.startsWith('--')) || 'http://localhost:3000/api/contact'
const url = new URL(target)
const localHostnames = new Set(['localhost', '127.0.0.1', '::1'])
const isLocal = localHostnames.has(url.hostname)

if (!options.has('--send')) {
  console.log(JSON.stringify({
    status: 'not_sent',
    target: url.toString(),
    next: 'Add --send to POST the sample. For a non-local target, also add --allow-live.',
  }, null, 2))
  process.exit(0)
}

if (!isLocal && !options.has('--allow-live')) {
  console.error('Refusing to send to a non-local endpoint without --allow-live.')
  process.exit(2)
}

const payload = {
  name: 'Contact endpoint smoke test',
  email: 'contact-smoke-test@example.com',
  phone: '',
  country: 'South Africa',
  service: 'Website Development',
  budget: 'R 5 000–R 15 000',
  timeline: 'Within 2–4 weeks',
  message: 'Automated contact endpoint smoke test. Please ignore this enquiry.',
  website: '',
}

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  })
  const result = await response.json().catch(() => ({ message: 'Endpoint returned a non-JSON response.' }))
  console.log(JSON.stringify({ status: response.status, body: result }, null, 2))
  if (!response.ok || !result.success) process.exitCode = 1
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Contact endpoint request failed.')
  process.exitCode = 1
}
