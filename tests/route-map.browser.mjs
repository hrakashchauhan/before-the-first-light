import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
try {
  await page.goto(process.env.GAME_URL || 'http://127.0.0.1:5173/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  const start = await page.locator('main').getAttribute('data-player')
  await page.getByRole('button', { name: 'Route map' }).click()
  await page.getByRole('dialog').waitFor()
  assert.equal(await page.getByRole('heading', { name: 'The morning route' }).isVisible(), true)
  assert.equal(await page.locator('.route-list li').count(), 8)
  await page.getByRole('button', { name: /Courtyard work/ }).click()
  assert.notEqual(start, await page.locator('main').getAttribute('data-player'))
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.deepEqual(errors, [])
  console.log('PASS route map and direct stop travel browser flow')
} finally {
  await browser.close()
}
