-- Insert Sample Data for Eventhour Platform
-- This file can be run multiple times safely (uses ON CONFLICT DO NOTHING)
-- If data already exists, it will be skipped without errors

-- First, ensure we have the admin user
INSERT INTO users (id, email, name, role)
VALUES ('admin-user-id', 'admin@eventhour.de', 'Admin User', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Create partner users first
INSERT INTO users (id, email, name, role)
VALUES 
    ('partner-user-1', 'partner1@eventhour.de', 'FlightHour Partner', 'PARTNER'),
    ('partner-user-2', 'partner2@eventhour.de', 'Adventure Partner', 'PARTNER'),
    ('partner-user-3', 'partner3@eventhour.de', 'Wellness Partner', 'PARTNER'),
    ('partner-user-4', 'partner4@eventhour.de', 'Gourmet Partner', 'PARTNER'),
    ('partner-user-5', 'partner5@eventhour.de', 'Outdoor Partner', 'PARTNER')
ON CONFLICT (email) DO NOTHING;

-- Insert sample partners
INSERT INTO partners (
    id, user_id, company_name, legal_form, 
    phone, email, 
    business_street, business_number, business_city, business_postal_code, business_country,
    use_business_address_for_billing,
    commission_rate, payment_terms, is_active, verification_status
) VALUES 
    ('partner-flighthour', 'partner-user-1', 'FlightHour GmbH', 'GmbH',
     '+49 208 12345678', 'info@flighthour.de',
     'Hauptstraße', '42', 'Oberhausen', '46047', 'DE',
     true, 0.20, '30 Tage netto', true, 'VERIFIED'),
    
    ('partner-adventure', 'partner-user-2', 'Adventure Sports Berlin', 'GmbH',
     '+49 30 98765432', 'info@adventure-berlin.de',
     'Sportweg', '15', 'Berlin', '10115', 'DE',
     true, 0.25, '30 Tage netto', true, 'VERIFIED'),
    
    ('partner-wellness', 'partner-user-3', 'Wellness Paradise Brandenburg', 'GmbH',
     '+49 331 11223344', 'info@wellness-paradise.de',
     'Wellnessallee', '7', 'Potsdam', '14467', 'DE',
     true, 0.30, '30 Tage netto', true, 'VERIFIED'),
    
    ('partner-cooking', 'partner-user-4', 'Gourmet Academy Berlin', 'UG',
     '+49 30 55667788', 'info@gourmet-academy.de',
     'Kochstraße', '23', 'Berlin', '10969', 'DE',
     true, 0.20, '30 Tage netto', true, 'VERIFIED'),
     
    ('partner-outdoor', 'partner-user-5', 'Outdoor Adventures Ruhr', 'GmbH',
     '+49 209 77889900', 'info@outdoor-ruhr.de',
     'Abenteuerweg', '8', 'Gelsenkirchen', '45879', 'DE',
     true, 0.25, '30 Tage netto', true, 'VERIFIED')
ON CONFLICT (user_id) DO NOTHING;

-- Insert categories
INSERT INTO categories (id, name, slug, description, icon, sort_order)
VALUES 
    ('cat-adventure', 'Abenteuer & Action', 'abenteuer-action', 
     'Adrenalin pur - für alle Mutigen', '🪂', 1),
    ('cat-wellness', 'Wellness & Entspannung', 'wellness-entspannung', 
     'Zeit für Körper und Seele', '🧘', 2),
    ('cat-culinary', 'Kulinarik & Genuss', 'kulinarik-genuss', 
     'Geschmackserlebnisse der besonderen Art', '🍷', 3),
    ('cat-sport', 'Sport & Fitness', 'sport-fitness', 
     'Aktiv sein und Spaß haben', '⚽', 4),
    ('cat-culture', 'Kultur & Kreatives', 'kultur-kreatives', 
     'Entdecke deine kreative Seite', '🎨', 5),
    ('cat-travel', 'Reisen & Kurztrips', 'reisen-kurztrips', 
     'Kleine Auszeiten vom Alltag', '✈️', 6),
    ('cat-simulation', 'Simulationen & Technik', 'simulationen-technik',
     'Hightech-Erlebnisse für Technikfans', '🎮', 7),
    ('cat-animals', 'Tiere & Natur', 'tiere-natur',
     'Begegnungen mit der Tierwelt', '🦙', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert experiences
INSERT INTO experiences (
    id, title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, partner_payout,
    search_keywords, popularity_score, is_active
) VALUES 
    -- 1. A320 Flugsimulator (Hauptprodukt)
    ('exp-a320-simulator', 
     'A320 Flugsimulator Oberhausen', 
     'a320-flugsimulator-oberhausen',
     'Erleben Sie das ultimative Flugerlebnis in unserem professionellen A320 Flugsimulator! Unter Anleitung erfahrener Piloten steuern Sie einen originalgetreuen Airbus A320 Simulator. Wählen Sie aus über 24.000 Flughäfen weltweit und meistern Sie verschiedene Wetterbedingungen. Perfekt für Luftfahrt-Enthusiasten, angehende Piloten oder als außergewöhnliches Geschenk. Keine Vorkenntnisse erforderlich!',
     'Professioneller A320 Flugsimulator mit echter Cockpit-Atmosphäre',
     'FlightHour Simulatorzentrum', 'Hauptstraße 42', 'Oberhausen', '46047', 'DE',
     51.4696, 6.8514,
     90, 2,
     'partner-flighthour', 'cat-simulation',
     19900, 0.19, 15920, -- 199€ Verkaufspreis, 159.20€ für Partner
     'flugsimulator pilot airbus a320 fliegen cockpit oberhausen ruhrgebiet geschenk erlebnis',
     100, true),
    
    -- 2. Tandem Fallschirmsprung
    ('exp-tandem-skydive',
     'Tandem Fallschirmsprung Berlin',
     'tandem-fallschirmsprung-berlin',
     'Der Adrenalinkick deines Lebens! Spring aus 4000 Metern Höhe und erlebe 60 Sekunden freien Fall. Anschließend gleiten Sie sanft am Fallschirm zur Erde. Professionelle Tandemmaster sorgen für maximale Sicherheit. Inklusive Einweisung, Ausrüstung und Sprung. Optional mit Video- und Fotopaket erhältlich.',
     'Aus 4000m Höhe - 60 Sekunden freier Fall mit erfahrenem Tandemmaster',
     'Fallschirmsprungzentrum Berlin', 'Flugplatzstraße 1', 'Berlin', '12529', 'DE',
     52.3667, 13.5033,
     240, 6,
     'partner-adventure', 'cat-adventure',
     24900, 0.19, 18675, -- 249€ Verkaufspreis
     'fallschirmsprung tandem skydiving adrenalin extremsport berlin geschenk',
     95, true),

    -- 3. Wellness-Wochenende Deluxe
    ('exp-wellness-weekend',
     'Wellness-Wochenende Deluxe Brandenburg',
     'wellness-wochenende-deluxe-brandenburg',
     'Zwei Übernachtungen im 4-Sterne Wellness-Hotel mit Vollpension. Genießen Sie unbegrenzten Zugang zum Spa-Bereich mit Sauna, Dampfbad und Pools. Inklusive sind eine 60-minütige Ganzkörpermassage, eine Gesichtsbehandlung und tägliches Wellness-Frühstück. Perfekt für Paare oder als Auszeit vom Alltag.',
     '2 Nächte im 4-Sterne Hotel mit Spa, Massage und Vollpension',
     'Wellness Paradise Resort', 'Seestraße 100', 'Potsdam', '14467', 'DE',
     52.3906, 13.0645,
     2880, 2, -- 48 Stunden
     'partner-wellness', 'cat-wellness',
     59900, 0.07, 41930, -- 599€ Verkaufspreis (reduzierter MwSt-Satz für Übernachtung)
     'wellness spa hotel wochenende massage sauna entspannung brandenburg potsdam',
     90, true),

    -- 4. Sushi-Kochkurs
    ('exp-sushi-course',
     'Sushi-Kochkurs für Anfänger',
     'sushi-kochkurs-anfaenger-berlin',
     'Lernen Sie die Kunst der Sushi-Zubereitung von einem erfahrenen Sushi-Meister. In unserem 3-stündigen Kurs bereiten Sie verschiedene Sushi-Arten zu: Maki, Nigiri und California Rolls. Alle Zutaten und Werkzeuge werden gestellt. Am Ende genießen Sie Ihre Kreationen bei einem gemeinsamen Essen. Rezeptheft zum Mitnehmen inklusive.',
     'Authentischer Sushi-Kurs mit japanischem Meisterkoch',
     'Gourmet Academy', 'Kochstraße 23', 'Berlin', '10969', 'DE',
     52.5067, 13.3908,
     180, 12,
     'partner-cooking', 'cat-culinary',
     8900, 0.19, 7120, -- 89€ Verkaufspreis
     'sushi kochkurs kochen japanisch maki nigiri berlin kurs workshop',
     88, true),

    -- 5. Stand-Up Paddling Kurs
    ('exp-sup-course',
     'Stand-Up Paddling Einsteigerkurs',
     'stand-up-paddling-kurs-wannsee',
     'Entdecken Sie den Trendsport SUP! In unserem 2-stündigen Einsteigerkurs lernen Sie die Grundtechniken des Stand-Up Paddlings. Nach einer Einführung an Land geht es aufs Wasser. Board, Paddel und Neoprenanzug sind inklusive. Der Kurs findet auf dem ruhigen Wannsee statt - perfekt für Anfänger.',
     'SUP-Grundkurs am Wannsee - Equipment inklusive',
     'SUP Station Wannsee', 'Wannseebadweg 25', 'Berlin', '14109', 'DE',
     52.4213, 13.1782,
     120, 8,
     'partner-outdoor', 'cat-sport',
     4900, 0.19, 3675, -- 49€ Verkaufspreis
     'sup stand up paddling wassersport wannsee berlin kurs anfänger',
     85, true),

    -- 6. Heißluftballonfahrt
    ('exp-balloon-ride',
     'Heißluftballonfahrt über das Ruhrgebiet',
     'heissluftballonfahrt-ruhrgebiet',
     'Schweben Sie lautlos über das Ruhrgebiet und genießen Sie spektakuläre Ausblicke. Die Fahrt dauert etwa 60-90 Minuten, abhängig von Wind und Wetter. Inklusive Sektempfang vor dem Start, Fahrt, Taufurkunde und Rücktransport zum Startpunkt. Ein unvergessliches Erlebnis für besondere Anlässe.',
     'Romantische Ballonfahrt mit Panoramablick und Sektempfang',
     'Ballonport Ruhr', 'Luftfahrtweg 10', 'Essen', '45127', 'DE',
     51.4556, 7.0116,
     180, 16,
     'partner-adventure', 'cat-adventure',
     18900, 0.19, 14175, -- 189€ Verkaufspreis
     'heißluftballon ballonfahrt ruhrgebiet romantisch geschenk himmel fliegen',
     82, true),

    -- 7. Weinverkostung
    ('exp-wine-tasting',
     'Premium Weinverkostung mit Sommelier',
     'weinverkostung-sommelier-berlin',
     'Tauchen Sie ein in die Welt edler Weine. Unser Sommelier führt Sie durch eine Verkostung von 8 ausgewählten Weinen aus verschiedenen Anbaugebieten. Lernen Sie die Grundlagen der Weinsensorik und erfahren Sie Wissenswertes über Rebsorten, Anbaugebiete und perfekte Food-Pairings. Kleine Snacks inklusive.',
     'Exklusive Weinprobe mit 8 Premium-Weinen und Sommelier',
     'Weinbar Charlottenburg', 'Weinstraße 15', 'Berlin', '10623', 'DE',
     52.5053, 13.3220,
     150, 20,
     'partner-culinary', 'cat-culinary',
     7900, 0.19, 6320, -- 79€ Verkaufspreis
     'wein weinprobe verkostung sommelier tasting berlin geschenk genuss',
     78, true),

    -- 8. Escape Room Abenteuer
    ('exp-escape-room',
     'Escape Room "Der verlorene Schatz"',
     'escape-room-verlorener-schatz-oberhausen',
     'Lösen Sie knifflige Rätsel und entkommen Sie aus unserem Themen-Escape-Room! Sie haben 60 Minuten Zeit, um den verlorenen Schatz zu finden und aus dem Raum zu entkommen. Teamwork, Logik und Kreativität sind gefragt. Perfekt für Gruppen, Teambuilding oder als spannendes Erlebnis mit Freunden.',
     'Spannendes Rätselabenteuer für 2-6 Personen',
     'Escape Adventures Oberhausen', 'Rätselgasse 5', 'Oberhausen', '46045', 'DE',
     51.4711, 6.8525,
     60, 6,
     'partner-outdoor', 'cat-culture',
     3900, 0.19, 2925, -- 39€ Verkaufspreis pro Person
     'escape room rätsel team abenteuer oberhausen ruhrgebiet spiel',
     75, true),

    -- 9. Quad-Tour
    ('exp-quad-tour',
     'Quad-Tour durchs Gelände',
     'quad-tour-gelaende-ruhrgebiet',
     'Action und Fahrspaß pur! Nach einer Einweisung starten Sie zu einer 2-stündigen geführten Quad-Tour durch abwechslungsreiches Gelände. Helm und Schutzausrüstung werden gestellt. Führerschein Klasse B erforderlich. Die Tour führt durch Wald, über Hügel und durch matschige Passagen - Nervenkitzel garantiert!',
     'Geführte Offroad Quad-Tour - 2 Stunden Fahrspaß',
     'Quad-Arena Ruhr', 'Offroadpark 1', 'Gelsenkirchen', '45891', 'DE',
     51.5176, 7.0858,
     120, 10,
     'partner-adventure', 'cat-adventure',
     12900, 0.19, 9675, -- 129€ Verkaufspreis
     'quad atv offroad tour gelände ruhrgebiet abenteuer motorsport',
     72, true),

    -- 10. Alpaka-Wanderung
    ('exp-alpaca-walk',
     'Alpaka-Wanderung am Niederrhein',
     'alpaka-wanderung-niederrhein',
     'Erleben Sie eine entspannte Wanderung mit flauschigen Alpakas durch die schöne Niederrhein-Landschaft. Nach einer Einführung in den Umgang mit den sanftmütigen Tieren, führen Sie Ihr eigenes Alpaka auf einer 90-minütigen Tour. Perfekt für Familien, Tierliebhaber oder als besonderes Gruppenerlebnis. Inklusive Alpaka-Fütterung.',
     'Gemütliche Wanderung mit kuscheligen Alpakas - ein Erlebnis für die ganze Familie',
     'Alpaka-Farm Niederrhein', 'Tiergartenstraße 20', 'Duisburg', '47058', 'DE',
     51.4344, 6.7626,
     90, 12,
     'partner-outdoor', 'cat-animals',
     3900, 0.19, 2925, -- 39€ Verkaufspreis
     'alpaka wanderung tiere natur niederrhein familie kinder ausflug',
     70, true)
ON CONFLICT (slug) DO NOTHING;

-- Add some images for experiences (URLs would be replaced with actual image uploads)
INSERT INTO experience_images (id, experience_id, filename, alt_text, sort_order)
VALUES 
    ('img-1', 'exp-a320-simulator', '/images/experiences/a320-simulator.jpg', 'A320 Flugsimulator Cockpit', 1),
    ('img-2', 'exp-tandem-skydive', '/images/experiences/skydiving.jpg', 'Tandem Fallschirmsprung', 1),
    ('img-3', 'exp-wellness-weekend', '/images/experiences/spa.jpg', 'Wellness Spa Bereich', 1),
    ('img-4', 'exp-sushi-course', '/images/experiences/sushi.jpg', 'Sushi Zubereitung', 1),
    ('img-5', 'exp-sup-course', '/images/experiences/sup.jpg', 'Stand-Up Paddling', 1),
    ('img-6', 'exp-balloon-ride', '/images/experiences/balloon.jpg', 'Heißluftballon', 1),
    ('img-7', 'exp-wine-tasting', '/images/experiences/wine.jpg', 'Weinverkostung', 1),
    ('img-8', 'exp-escape-room', '/images/experiences/escape.jpg', 'Escape Room', 1),
    ('img-9', 'exp-quad-tour', '/images/experiences/quad.jpg', 'Quad Tour', 1),
    ('img-10', 'exp-alpaca-walk', '/images/experiences/alpaca.jpg', 'Alpaka Wanderung', 1)
ON CONFLICT (id) DO NOTHING;

-- Update category counts (optional - for display purposes)
UPDATE categories c
SET sort_order = (
    SELECT COUNT(*) 
    FROM experiences e 
    WHERE e.category_id = c.id AND e.is_active = true
);

COMMIT;