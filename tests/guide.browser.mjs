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
  await page.getByRole('button', { name: 'How to play' }).click()
  await page.getByRole('dialog').waitFor()
  assert.equal(await page.getByRole('heading', { name: 'How to play' }).isVisible(), true)
  assert.equal(await page.locator('.guide-hint strong').filter({ hasText: 'Speak with Ma' }).isVisible(), true)
  const before = await page.locator('.guide-content').evaluate(element => getComputedStyle(element).transform)
  const bar = await page.locator('.guide-dragbar').boundingBox()
  assert.ok(bar)
  await page.mouse.move(bar.x + 100, bar.y + 10)
  await page.mouse.down()
  await page.mouse.move(bar.x + 180, bar.y + 50)
  await page.mouse.up()
  const after = await page.locator('.guide-content').evaluate(element => getComputedStyle(element).transform)
  assert.notEqual(before, after)
  await page.getByRole('button', { name: 'Resume' }).click()
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.deepEqual(errors, [])
  console.log('PASS how-to-play guide browser flow')
} finally {
  await browser.close()
}
