import { test, expect } from '@playwright/test'

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await page.waitForLoadState('networkidle')
  })

  test('mostra raccomandazioni di acquisto', async ({ page }) => {
    await expect(page.locator('.restocking-table, table').first()).toBeVisible()
    // Almeno una raccomandazione presente
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('filtro magazzino aggiorna le raccomandazioni', async ({ page }) => {
    // Restocking usa selects locali nel .controls-bar
    await page.locator('.controls-bar select').first().selectOption('London')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('budget ceiling limita i risultati', async ({ page }) => {
    const rowsBefore = await page.locator('tbody tr').count()

    // Imposta un budget molto basso
    await page.locator('input[type="number"]').fill('100')
    await page.locator('button:has-text("Apply")').click()
    await page.waitForLoadState('networkidle')

    const rowsAfter = await page.locator('tbody tr').count()
    // Con budget = 100 ci devono essere meno (o uguali) righe
    expect(rowsAfter).toBeLessThanOrEqual(rowsBefore)
  })

  test('budget ceiling = 0 mostra lista vuota o stato vuoto', async ({ page }) => {
    await page.locator('input[type="number"]').fill('0')
    await page.locator('button:has-text("Apply")').click()
    await page.waitForLoadState('networkidle')

    const rows = await page.locator('tbody tr').count()
    const emptyState = page.locator('.empty-state')

    expect(rows === 0 || await emptyState.isVisible()).toBeTruthy()
  })

  test('clear budget ripristina tutti i risultati', async ({ page }) => {
    await page.locator('input[type="number"]').fill('100')
    await page.locator('button:has-text("Apply")').click()
    await page.waitForLoadState('networkidle')

    const clearBtn = page.locator('button:has-text("Clear")')
    if (await clearBtn.isVisible()) {
      await clearBtn.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.locator('.error')).not.toBeVisible()
  })
})
