'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Section, Button, Input, useCart } from '@eventhour/ui'
import { ChevronRight, ShoppingBag, CreditCard, Check } from 'lucide-react'

type Step = 'cart' | 'details' | 'payment' | 'confirm'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<Step>('cart')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    agreeToTerms: false,
    paymentMethod: 'card',
  })

  const steps = [
    { id: 'cart', label: 'Warenkorb', icon: ShoppingBag },
    { id: 'details', label: 'Deine Daten', icon: ChevronRight },
    { id: 'payment', label: 'Zahlung', icon: CreditCard },
    { id: 'confirm', label: 'Bestätigung', icon: Check },
  ]

  const handleNextStep = () => {
    const stepOrder: Step[] = ['cart', 'details', 'payment', 'confirm']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const handlePreviousStep = () => {
    const stepOrder: Step[] = ['cart', 'details', 'payment', 'confirm']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // Create order via API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData,
          paymentMethod: formData.paymentMethod,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        clearCart()
        router.push(`/checkout/erfolg?order=${data.orderId}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
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
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isActive
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : isPast
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-1 mx-2 ${
                  isPast ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )

  const renderCartStep = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Warenkorb-Übersicht</h2>
      
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">Anzahl: {item.quantity}</p>
          </div>
          <p className="font-bold text-eventhour-yellow">
            {(item.price * item.quantity).toFixed(2)}€
          </p>
        </div>
      ))}
      
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Gesamt:</span>
          <span className="text-eventhour-yellow">{getTotal().toFixed(2)}€</span>
        </div>
      </div>
      
      <Button onClick={handleNextStep} className="w-full">
        Weiter zur Eingabe deiner Daten
      </Button>
    </div>
  )

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Deine Daten</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Vorname"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Nachname"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      
      <Input
        label="E-Mail"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <Input
        label="Telefon"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeToTerms}
          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="terms" className="text-sm">
          Ich akzeptiere die <a href="/agb" className="text-eventhour-yellow">AGB</a> und{' '}
          <a href="/datenschutz" className="text-eventhour-yellow">Datenschutzerklärung</a>
        </label>
      </div>
      
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.agreeToTerms}
          className="flex-1"
        >
          Weiter zur Zahlung
        </Button>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Zahlungsmethode</h2>
      
      <div className="space-y-4">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={formData.paymentMethod === 'card'}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="mr-3"
          />
          <div className="flex-1">
            <p className="font-semibold">Kreditkarte</p>
            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
          </div>
        </label>
        
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={formData.paymentMethod === 'paypal'}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="mr-3"
          />
          <div className="flex-1">
            <p className="font-semibold">PayPal</p>
            <p className="text-sm text-gray-600">Zahle mit deinem PayPal-Konto</p>
          </div>
        </label>
        
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="sepa"
            checked={formData.paymentMethod === 'sepa'}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="mr-3"
          />
          <div className="flex-1">
            <p className="font-semibold">SEPA-Lastschrift</p>
            <p className="text-sm text-gray-600">Bequem per Bankeinzug</p>
          </div>
        </label>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          🔒 Deine Zahlungsdaten werden sicher verschlüsselt übertragen.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Weiter zur Bestätigung
        </Button>
      </div>
    </div>
  )

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Bestellung überprüfen</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="font-semibold">Bestellübersicht</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.title} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)}€</span>
          </div>
        ))}
        <div className="border-t pt-2 font-bold flex justify-between">
          <span>Gesamt:</span>
          <span className="text-eventhour-yellow">{getTotal().toFixed(2)}€</span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Rechnungsadresse</h3>
        <p>{formData.firstName} {formData.lastName}</p>
        <p>{formData.email}</p>
        {formData.phone && <p>{formData.phone}</p>}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">Zahlungsmethode</h3>
        <p>{formData.paymentMethod === 'card' ? 'Kreditkarte' : 
           formData.paymentMethod === 'paypal' ? 'PayPal' : 'SEPA-Lastschrift'}</p>
      </div>
      
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handlePreviousStep} className="flex-1">
          Zurück
        </Button>
        <Button onClick={handleSubmit} isLoading={loading} className="flex-1">
          Jetzt kostenpflichtig bestellen
        </Button>
      </div>
    </div>
  )

  return (
    <Section className="py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {renderStepIndicator()}
          
          {currentStep === 'cart' && renderCartStep()}
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirm' && renderConfirmStep()}
        </div>
      </Container>
    </Section>
  )
}