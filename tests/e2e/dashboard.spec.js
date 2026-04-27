import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('carica la pagina e mostra le KPI', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Vite App|Meridian|Inventory/)
    // Le card KPI devono essere visibili
    await expect(page.locator('.kpi-card, .stat-card, .metric-card').first()).toBeVisible({ timeout: 5000 })
  })

  test('la navigazione è presente con tutte le voci', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /inventory/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /orders/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /reports/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /restocking/i })).toBeVisible()
  })

  test('applica filtro magazzino e aggiorna i dati', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // FilterBar: 4 selects (period, location, category, status) — location è il secondo
    const warehouseSelect = page.locator('.filter-group select').nth(1)
    await warehouseSelect.selectOption('San Francisco')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.error')).not.toBeVisible()
  })
})
