import { test, expect } from '@playwright/test'

const routes = [
  { path: '/',            name: 'Dashboard' },
  { path: '/inventory',   name: 'Inventory' },
  { path: '/orders',      name: 'Orders'    },
  { path: '/reports',     name: 'Reports'   },
  { path: '/restocking',  name: 'Restocking'},
  { path: '/spending',    name: 'Spending'  },
]

test.describe('Navigazione tra le viste', () => {
  for (const route of routes) {
    test(`${route.name} carica senza errori`, async ({ page }) => {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')

      // Nessun errore fatale visibile
      await expect(page.locator('.error')).not.toBeVisible()
      // Nessun loading spinner rimasto bloccato
      await expect(page.locator('.loading')).not.toBeVisible()
    })
  }

  test('click sulla nav porta alla vista corretta', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /inventory/i }).click()
    await expect(page).toHaveURL(/\/inventory/)

    await page.getByRole('link', { name: /orders/i }).click()
    await expect(page).toHaveURL(/\/orders/)

    await page.getByRole('link', { name: /reports/i }).click()
    await expect(page).toHaveURL(/\/reports/)

    await page.getByRole('link', { name: /restocking/i }).click()
    await expect(page).toHaveURL(/\/restocking/)
  })
})
