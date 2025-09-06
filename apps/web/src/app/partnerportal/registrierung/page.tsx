'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container, Section, Input, Button, Logo } from '@eventhour/ui'
import { Building2, Mail, Lock, Phone, MapPin, FileText, ChevronRight } from 'lucide-react'

type Step = 'account' | 'company' | 'address' | 'complete'

export default function PartnerRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Account
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Company
    companyName: '',
    legalForm: '',
    taxId: '',
    vatId: '',
    website: '',
    phone: '',
    
    // Address
    businessStreet: '',
    businessNumber: '',
    businessCity: '',
    businessPostalCode: '',
    
    // Contact Person
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    contactPersonPosition: '',
    
    // Terms
    agreeToTerms: false,
  })

  const steps = [
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'company', label: 'Firmendaten', icon: Building2 },
    { id: 'address', label: 'Adresse', icon: MapPin },
    { id: 'complete', label: 'Abschluss', icon: FileText },
  ]

  const handleNextStep = () => {
    const stepOrder: Step[] = ['account', 'company', 'address', 'complete']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePreviousStep = () => {
    const stepOrder: Step[] = ['account', 'company', 'address', 'complete']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/partner/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/partnerportal/login?registered=true')
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen')
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.id === currentStep
        const isPast = steps.findIndex(s => s.id === currentStep) > index
        
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex flex-col items-center ${
                index > 0 ? 'ml-8' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  isActive
                    ? 'bg-eventhour-yellow text-eventhour-black'
                    : isPast
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 text-gray-400 mt-[-20px] ml-8" />
            )}
          </div>
        )
      })}
    </div>
  )

  const renderAccountStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Account erstellen</h2>
        <p className="text-gray-600">Ihre Zugangsdaten für das Partner Portal</p>
      </div>

      <Input
        label="E-Mail"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        placeholder="partner@beispiel.de"
      />

      <Input
        label="Passwort"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        placeholder="Mindestens 8 Zeichen"
      />

      <Input
        label="Passwort bestätigen"
        type="password"
        value={formData.passwordConfirm}
        onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
        required
        placeholder="Passwort wiederholen"
      />

      <Button onClick={handleNextStep} className="w-full">
        Weiter zu Firmendaten
      </Button>
    </div>
  )

  const renderCompanyStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Firmendaten</h2>
        <p className="text-gray-600">Informationen zu Ihrem Unternehmen</p>
      </div>

      <Input
        label="Firmenname"
        value={formData.companyName}
        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        required
        placeholder="Beispiel GmbH"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Rechtsform"
          value={formData.legalForm}
          onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
          placeholder="GmbH, UG, etc."
        />

        <Input
          label="Telefon"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+49 123 456789"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Steuernummer"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          placeholder="123/456/78901"
        />

        <Input
          label="USt-IdNr."
          value={formData.vatId}
          onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
          placeholder="DE123456789"
        />
      </div>

      <Input
        label="Website (optional)"
        type="url"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="https://www.beispiel.de"
      />

      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Weiter zur Adresse
        </Button>
      </div>
    </div>
  )

  const renderAddressStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Geschäftsadresse</h2>
        <p className="text-gray-600">Ihre Unternehmensadresse</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Straße"
            value={formData.businessStreet}
            onChange={(e) => setFormData({ ...formData, businessStreet: e.target.value })}
            required
            placeholder="Beispielstraße"
          />
        </div>
        <Input
          label="Hausnummer"
          value={formData.businessNumber}
          onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
          required
          placeholder="123"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="PLZ"
          value={formData.businessPostalCode}
          onChange={(e) => setFormData({ ...formData, businessPostalCode: e.target.value })}
          required
          placeholder="12345"
        />
        <Input
          label="Stadt"
          value={formData.businessCity}
          onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
          required
          placeholder="Berlin"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Ansprechpartner</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Name"
            value={formData.contactPersonName}
            onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
            placeholder="Max Mustermann"
          />
          <Input
            label="Position"
            value={formData.contactPersonPosition}
            onChange={(e) => setFormData({ ...formData, contactPersonPosition: e.target.value })}
            placeholder="Geschäftsführer"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Input
            label="E-Mail"
            type="email"
            value={formData.contactPersonEmail}
            onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
            placeholder="kontakt@beispiel.de"
          />
          <Input
            label="Telefon"
            type="tel"
            value={formData.contactPersonPhone}
            onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
            placeholder="+49 123 456789"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Weiter zum Abschluss
        </Button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Registrierung abschließen</h2>
        <p className="text-gray-600">Überprüfen Sie Ihre Angaben</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Account</h3>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Firma</h3>
          <p className="text-sm text-gray-600">{formData.companyName}</p>
          {formData.legalForm && <p className="text-sm text-gray-600">{formData.legalForm}</p>}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Adresse</h3>
          <p className="text-sm text-gray-600">
            {formData.businessStreet} {formData.businessNumber}<br />
            {formData.businessPostalCode} {formData.businessCity}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          Nach der Registrierung wird Ihr Account von unserem Team geprüft. 
          Sie erhalten eine E-Mail, sobald Ihr Account freigeschaltet wurde.
        </p>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          className="mt-1 mr-2"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Ich akzeptiere die{' '}
          <Link href="/partner-agb" className="text-eventhour-yellow hover:underline">
            Partner-AGB
          </Link>{' '}
          und die{' '}
          <Link href="/datenschutz" className="text-eventhour-yellow hover:underline">
            Datenschutzerklärung
          </Link>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button 
          onClick={handleSubmit} 
          loading={loading}
          disabled={!formData.agreeToTerms}
          className="flex-1"
        >
          Registrierung abschließen
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-eventhour-yellow/10 to-white py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Partner werden</h1>
              <p className="text-gray-600">Bieten Sie Ihre Erlebnisse auf Eventhour an</p>
            </div>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            {currentStep === 'account' && renderAccountStep()}
            {currentStep === 'company' && renderCompanyStep()}
            {currentStep === 'address' && renderAddressStep()}
            {currentStep === 'complete' && renderCompleteStep()}

            {/* Login Link */}
            {currentStep === 'account' && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Bereits Partner?{' '}
                <Link
                  href="/partnerportal/login"
                  className="text-eventhour-yellow font-semibold hover:underline"
                >
                  Hier anmelden
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}