'use client'

import { useState } from 'react'

const initialForm = { goal: '', users: '', tasks: '', integrations: '', constraints: '' }

export default function ScopeBriefTool() {
  const [form, setForm] = useState(initialForm)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  const brief = [
    'PROJECT BRIEF',
    `Goal: ${form.goal || '[Add the outcome you want]'}`,
    `Users: ${form.users || '[Who will use this?]'}`,
    `Key tasks: ${form.tasks || '[What should they be able to do?]'}`,
    `Systems or integrations: ${form.integrations || '[List tools or APIs, if known]'}`,
    `Constraints: ${form.constraints || '[Budget, timing, security, or other limits]'}`,
  ].join('\n')

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief)
      setCopied(true)
      setCopyError('')
      window.setTimeout(() => setCopied(false), 2500)
    } catch (error) {
      console.error('[TOOLS] Could not copy the project brief.', error)
      setCopied(false)
      setCopyError('Copy was blocked by the browser. You can select and copy the brief preview instead.')
    }
  }

  return (
    <div className="ets-tool-panel">
      <div>
        <p className="ets-eyebrow">Free tool · no account needed</p>
        <h2>Build a clearer project brief.</h2>
        <p>Answer a few prompts, then copy your notes into an email or send them to our team.</p>
        <div className="ets-tool-fields">
          {([
            ['goal', 'What would a successful project make possible?'],
            ['users', 'Who will use it?'],
            ['tasks', 'What are the main things they need to do?'],
            ['integrations', 'What systems should it connect to?'],
            ['constraints', 'What limits or requirements should we know about?'],
          ] as const).map(([field, label]) => (
            <label key={field}>
              <span>{label}</span>
              <textarea
                rows={field === 'goal' ? 3 : 2}
                value={form[field]}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                maxLength={1000}
              />
            </label>
          ))}
        </div>
        <button className="ets-button primary" type="button" onClick={copyBrief}>
          {copied ? 'Copied' : 'Copy project brief'} <span aria-hidden="true">↗</span>
        </button>
        {copyError && <p className="ets-form-error" role="alert">{copyError}</p>}
        <p className="ets-tool-disclaimer">Your notes stay in this browser until you leave the page. Copying is optional.</p>
      </div>
      <pre className="ets-tool-preview" aria-live="polite">{brief}</pre>
    </div>
  )
}
