import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Eventhour/)
  })

  test('displays hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Unvergessliche Erlebnisse')
    await expect(page.getByText(/Entdecken Sie einzigartige/)).toBeVisible()
  })

  test('shows experience categories', async ({ page }) => {
    await expect(page.getByText('Abenteuer')).toBeVisible()
    await expect(page.getByText('Wellness')).toBeVisible()
    await expect(page.getByText('Kulinarik')).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Was möchten Sie erleben/)
    await searchInput.fill('Flugsimulator')
    await searchInput.press('Enter')
    
    await expect(page).toHaveURL(/\/erlebnisse\?query=Flugsimulator/)
  })

  test('navigation links work', async ({ page }) => {
    await page.getByRole('link', { name: 'Erlebnisse' }).click()
    await expect(page).toHaveURL('/erlebnisse')
    
    await page.getByRole('link', { name: 'Geschenkgutscheine' }).click()
    await expect(page).toHaveURL('/geschenkgutscheine')
  })

  test('cookie banner appears for new visitors', async ({ page, context }) => {
    await context.clearCookies()
    await page.reload()
    
    await expect(page.getByText(/Wir verwenden Cookies/)).toBeVisible()
    await page.getByRole('button', { name: 'Alle akzeptieren' }).click()
    await expect(page.getByText(/Wir verwenden Cookies/)).not.toBeVisible()
  })

  test('responsive design works', async ({ page }) => {
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible()
    
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.getByTestId('mobile-menu-button')).not.toBeVisible()
  })
})