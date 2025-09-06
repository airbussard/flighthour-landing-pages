import { test, expect } from '@playwright/test'

test.describe('Checkout Process', () => {
  test('complete checkout flow', async ({ page }) => {
    // Navigate to experience
    await page.goto('/erlebnisse/flugsimulator-a320')
    
    // Select date and participants
    await page.getByLabel('Datum').fill('2024-03-15')
    await page.getByLabel('Teilnehmer').selectOption('2')
    
    // Add to cart
    await page.getByRole('button', { name: 'In den Warenkorb' }).click()
    
    // Go to cart
    await page.getByRole('link', { name: 'Warenkorb' }).click()
    await expect(page).toHaveURL('/warenkorb')
    
    // Proceed to checkout
    await page.getByRole('button', { name: 'Zur Kasse' }).click()
    await expect(page).toHaveURL('/checkout')
    
    // Fill customer information
    await page.getByLabel('Vorname').fill('Max')
    await page.getByLabel('Nachname').fill('Mustermann')
    await page.getByLabel('E-Mail').fill('max@example.com')
    await page.getByLabel('Telefon').fill('+49 123 456789')
    
    // Fill billing address
    await page.getByLabel('Straße').fill('Musterstraße 123')
    await page.getByLabel('PLZ').fill('12345')
    await page.getByLabel('Stadt').fill('Musterstadt')
    await page.getByLabel('Land').selectOption('DE')
    
    // Select payment method
    await page.getByLabel('Kreditkarte').check()
    
    // Accept terms
    await page.getByLabel('AGB akzeptieren').check()
    await page.getByLabel('Datenschutz akzeptieren').check()
    
    // Complete order
    await page.getByRole('button', { name: 'Bestellung abschließen' }).click()
    
    // Verify success page
    await expect(page).toHaveURL(/\/checkout\/success/)
    await expect(page.getByText('Vielen Dank für Ihre Bestellung')).toBeVisible()
  })

  test('validates required fields', async ({ page }) => {
    await page.goto('/checkout')
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: 'Bestellung abschließen' }).click()
    
    // Check for validation errors
    await expect(page.getByText('Vorname ist erforderlich')).toBeVisible()
    await expect(page.getByText('E-Mail ist erforderlich')).toBeVisible()
  })

  test('applies voucher code', async ({ page }) => {
    await page.goto('/checkout')
    
    // Enter voucher code
    await page.getByPlaceholder('Gutschein-Code').fill('SAVE10')
    await page.getByRole('button', { name: 'Einlösen' }).click()
    
    // Verify discount applied
    await expect(page.getByText('Gutschein angewendet')).toBeVisible()
    await expect(page.getByText('-10%')).toBeVisible()
  })
})