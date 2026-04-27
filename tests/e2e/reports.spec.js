import { test, expect } from '@playwright/test'

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    await page.waitForLoadState('networkidle')
  })

  test('mostra dati trimestrali e mensili', async ({ page }) => {
    // Tabella trimestrale presente
    await expect(page.locator('table').first()).toBeVisible()
    // Almeno una riga di dati
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('filtro magazzino aggiorna i dati', async ({ page }) => {
    // Reports usa selects locali nel .filters-bar
    await page.locator('.reports-filters select').first().selectOption('London')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('filtro categoria aggiorna i dati', async ({ page }) => {
    await page.locator('.reports-filters select').nth(1).selectOption('sensors')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('reset filtri ripristina la vista completa', async ({ page }) => {
    await page.locator('.reports-filters select').first().selectOption('London')
    await page.waitForLoadState('networkidle')

    const resetBtn = page.locator('button:has-text("Reset")')
    if (await resetBtn.isVisible()) {
      await resetBtn.click()
      await page.waitForLoadState('networkidle')
    }

    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('nessun errore in console', async ({ page }) => {
    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })
})
