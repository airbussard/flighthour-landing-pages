export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-eventhour-yellow to-yellow-400 py-20">
        <div className="container-section">
          <div className="text-center">
            <h1 className="text-eventhour-black mb-6">
              Willkommen bei Eventhour
            </h1>
            <p className="text-xl md:text-2xl text-eventhour-black/80 mb-8 max-w-3xl mx-auto">
              Entdecke unvergessliche Erlebnisse und finde das perfekte Geschenk für jeden Anlass
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                Erlebnisse entdecken
              </button>
              <button className="btn-outline bg-white">
                Wertgutschein kaufen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-section">
          <h2 className="text-center mb-12">Warum Eventhour?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl mb-2">Große Auswahl</h3>
              <p className="text-gray-600">Über 1000 Erlebnisse in ganz Deutschland</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl mb-2">Einfach & Sicher</h3>
              <p className="text-gray-600">Sichere Zahlung und sofortige Gutschein-Lieferung</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl mb-2">Flexibel</h3>
              <p className="text-gray-600">3 Jahre Gültigkeit und kostenlose Umbuchung</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-eventhour-black text-white">
        <div className="container-section text-center">
          <h2 className="mb-6">Bereit für dein nächstes Abenteuer?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Starte jetzt und entdecke Erlebnisse, die in Erinnerung bleiben
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Jetzt starten
          </button>
        </div>
      </section>
    </main>
  )
}