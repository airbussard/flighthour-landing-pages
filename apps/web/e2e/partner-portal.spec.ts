import { test, expect } from '@playwright/test'

test.describe('Partner Portal', () => {
  test('partner registration flow', async ({ page }) => {
    await page.goto('/partnerportal/registrierung')
    
    // Step 1: Company Information
    await page.getByLabel('Firmenname').fill('Test GmbH')
    await page.getByLabel('Registernummer').fill('HRB 12345')
    await page.getByLabel('USt-IdNr').fill('DE123456789')
    await page.getByRole('button', { name: 'Weiter' }).click()
    
    // Step 2: Contact Person
    await page.getByLabel('Vorname').fill('Hans')
    await page.getByLabel('Nachname').fill('Partner')
    await page.getByLabel('E-Mail').fill('partner@test.de')
    await page.getByLabel('Telefon').fill('+49 123 456789')
    await page.getByRole('button', { name: 'Weiter' }).click()
    
    // Step 3: Business Details
    await page.getByLabel('Branche').selectOption('ADVENTURE')
    await page.getByLabel('Website').fill('https://test-partner.de')
    await page.getByLabel('Beschreibung').fill('Wir bieten tolle Erlebnisse')
    await page.getByRole('button', { name: 'Weiter' }).click()
    
    // Step 4: Documents
    await page.setInputFiles('input[name="businessLicense"]', './test-files/license.pdf')
    await page.setInputFiles('input[name="insurance"]', './test-files/insurance.pdf')
    await page.getByRole('button', { name: 'Registrierung abschließen' }).click()
    
    // Verify success
    await expect(page.getByText('Registrierung erfolgreich')).toBeVisible()
  })

  test('partner login and dashboard', async ({ page }) => {
    // Login
    await page.goto('/partnerportal/login')
    await page.getByLabel('E-Mail').fill('partner@example.com')
    await page.getByLabel('Passwort').fill('password123')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    
    // Verify dashboard
    await expect(page).toHaveURL('/partnerportal/dashboard')
    await expect(page.getByText('Willkommen zurück')).toBeVisible()
    
    // Check statistics
    await expect(page.getByTestId('total-bookings')).toBeVisible()
    await expect(page.getByTestId('revenue')).toBeVisible()
    await expect(page.getByTestId('active-experiences')).toBeVisible()
  })

  test('create new experience', async ({ page }) => {
    // Navigate to experiences
    await page.goto('/partnerportal/erlebnisse')
    await page.getByRole('button', { name: 'Neues Erlebnis' }).click()
    
    // Fill experience form
    await page.getByLabel('Titel').fill('Test Erlebnis')
    await page.getByLabel('Beschreibung').fill('Eine tolle Beschreibung')
    await page.getByLabel('Preis').fill('99.99')
    await page.getByLabel('Dauer (Minuten)').fill('60')
    await page.getByLabel('Max. Teilnehmer').fill('10')
    await page.getByLabel('Kategorie').selectOption('ADVENTURE')
    
    // Add images
    await page.setInputFiles('input[name="images"]', './test-files/image1.jpg')
    
    // Save
    await page.getByRole('button', { name: 'Erlebnis speichern' }).click()
    
    // Verify success
    await expect(page.getByText('Erlebnis erfolgreich erstellt')).toBeVisible()
  })

  test('voucher redemption', async ({ page }) => {
    await page.goto('/partnerportal/gutscheine')
    
    // Enter voucher code
    await page.getByPlaceholder('Gutschein-Code eingeben').fill('VOUCHER123')
    await page.getByRole('button', { name: 'Einlösen' }).click()
    
    // Fill customer details
    await page.getByLabel('Kundenname').fill('Max Mustermann')
    await page.getByLabel('Notizen').fill('Geburtstagsgeschenk')
    await page.getByRole('button', { name: 'Bestätigen' }).click()
    
    // Verify success
    await expect(page.getByText('Gutschein erfolgreich eingelöst')).toBeVisible()
  })
})