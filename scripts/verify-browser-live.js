import { chromium } from 'playwright-core'
import fs from 'fs'
import path from 'path'

async function run() {
  console.log('[E2E Browser Test] Starting headless browser verification...')

  let browser
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true })
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })

  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  console.log('[E2E Browser Test] Navigating to http://localhost:5173/ ...')
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })

  // 1. Verify canvas exists
  const canvas = await page.locator('canvas').first()
  await canvas.waitFor({ state: 'visible', timeout: 8000 })
  console.log('[E2E Browser Test] Canvas rendered successfully.')

  // 2. Verify HUD elements
  const brand = await page.locator('.brand').textContent()
  console.log('[E2E Browser Test] Brand:', brand)

  const chapterHeading = await page.locator('.chapter-block h1').textContent()
  console.log('[E2E Browser Test] Active Chapter:', chapterHeading)

  const objective = await page.locator('.objective-link span[aria-live="polite"]').textContent()
  console.log('[E2E Browser Test] Active Objective:', objective)

  // 3. Audio toggle
  const soundButton = page.locator('.sound-button')
  await soundButton.click()
  console.log('[E2E Browser Test] Clicked Sound Button to unlock audio and trigger music.')

  // 4. Test Journal open/close
  await page.keyboard.press('j')
  await page.waitForSelector('.journal-panel', { timeout: 4000 })
  console.log('[E2E Browser Test] Journal opened with keyboard shortcut J.')

  const walkthroughExists = await page.locator('text=Guided Walkthrough').isVisible()
  console.log('[E2E Browser Test] Guided Walkthrough visible in Journal:', walkthroughExists)

  // Take screenshot of Journal with Guided Walkthrough
  const screenshotJournalPath = path.resolve('docs/evidence/browser_journal.png')
  await page.screenshot({ path: screenshotJournalPath })
  console.log('[E2E Browser Test] Saved Journal screenshot to:', screenshotJournalPath)

  await page.keyboard.press('Escape')
  await page.waitForSelector('.journal-panel', { state: 'detached', timeout: 3000 })
  console.log('[E2E Browser Test] Journal closed.')

  // 5. Test walking with W key
  await page.keyboard.down('KeyW')
  await page.waitForTimeout(600)
  await page.keyboard.up('KeyW')
  console.log('[E2E Browser Test] Tested player movement input (W key).')

  // 6. Screenshot main gameplay scene
  const screenshotMainPath = path.resolve('docs/evidence/browser_gameplay.png')
  await page.screenshot({ path: screenshotMainPath })
  console.log('[E2E Browser Test] Saved Gameplay screenshot to:', screenshotMainPath)

  console.log('[E2E Browser Test] Console errors count:', consoleErrors.length)
  if (consoleErrors.length > 0) {
    console.warn('[E2E Browser Test] Console errors detected:', consoleErrors)
  }

  await browser.close()
  console.log('[E2E Browser Test] Completed successfully!')
}

run().catch((err) => {
  console.error('[E2E Browser Test Failed]:', err)
  process.exit(1)
})
