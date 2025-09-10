-- Insert Sample Data for Eventhour Platform
-- This file can be run multiple times safely (uses ON CONFLICT DO NOTHING)
-- Works with both empty database and existing data

-- ============================================
-- USERS
-- ============================================
-- Admin user
INSERT INTO users (email, name, role)
VALUES ('admin@eventhour.de', 'Admin User', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Partner users
INSERT INTO users (email, name, role)
VALUES 
    ('partner1@eventhour.de', 'FlightHour Partner', 'PARTNER'),
    ('partner2@eventhour.de', 'Adventure Partner', 'PARTNER'),
    ('partner3@eventhour.de', 'Wellness Partner', 'PARTNER'),
    ('partner4@eventhour.de', 'Gourmet Partner', 'PARTNER'),
    ('partner5@eventhour.de', 'Outdoor Partner', 'PARTNER')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CATEGORIES (Insert if not exists)
-- ============================================
INSERT INTO categories (name, slug, description, icon, sort_order)
VALUES 
    ('Abenteuer & Action', 'abenteuer-action', 
     'Adrenalin pur - für alle Mutigen', '🪂', 1),
    ('Wellness & Entspannung', 'wellness-entspannung', 
     'Zeit für Körper und Seele', '🧘', 2),
    ('Kulinarik & Genuss', 'kulinarik-genuss', 
     'Geschmackserlebnisse der besonderen Art', '🍷', 3),
    ('Sport & Fitness', 'sport-fitness', 
     'Aktiv sein und Spaß haben', '⚽', 4),
    ('Kultur & Kreatives', 'kultur-kreatives', 
     'Entdecke deine kreative Seite', '🎨', 5),
    ('Reisen & Kurztrips', 'reisen-kurztrips', 
     'Kleine Auszeiten vom Alltag', '✈️', 6),
    ('Simulationen & Technik', 'simulationen-technik',
     'Hightech-Erlebnisse für Technikfans', '🎮', 7),
    ('Tiere & Natur', 'tiere-natur',
     'Begegnungen mit der Tierwelt', '🦙', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PARTNERS
-- ============================================
INSERT INTO partners (
    user_id, company_name, legal_form, 
    phone, email, 
    business_street, business_number, business_city, business_postal_code, business_country,
    use_business_address_for_billing,
    commission_rate, payment_terms, is_active, verification_status
)
SELECT 
    u.id as user_id,
    p.company_name,
    p.legal_form,
    p.phone,
    p.email,
    p.business_street,
    p.business_number,
    p.business_city,
    p.business_postal_code,
    p.business_country,
    p.use_business_address_for_billing,
    p.commission_rate,
    p.payment_terms,
    p.is_active,
    p.verification_status::verification_status
FROM users u
CROSS JOIN (
    VALUES 
        ('partner1@eventhour.de', 'FlightHour GmbH', 'GmbH',
         '+49 208 12345678', 'info@flighthour.de',
         'Hauptstraße', '42', 'Oberhausen', '46047', 'DE',
         true, 0.20, '30 Tage netto', true, 'VERIFIED'),
        
        ('partner2@eventhour.de', 'Adventure Sports Berlin', 'GmbH',
         '+49 30 98765432', 'info@adventure-berlin.de',
         'Sportweg', '15', 'Berlin', '10115', 'DE',
         true, 0.25, '30 Tage netto', true, 'VERIFIED'),
        
        ('partner3@eventhour.de', 'Wellness Paradise Brandenburg', 'GmbH',
         '+49 331 11223344', 'info@wellness-paradise.de',
         'Wellnessallee', '7', 'Potsdam', '14467', 'DE',
         true, 0.30, '30 Tage netto', true, 'VERIFIED'),
        
        ('partner4@eventhour.de', 'Gourmet Academy Berlin', 'UG',
         '+49 30 55667788', 'info@gourmet-academy.de',
         'Kochstraße', '23', 'Berlin', '10969', 'DE',
         true, 0.20, '30 Tage netto', true, 'VERIFIED'),
         
        ('partner5@eventhour.de', 'Outdoor Adventures Ruhr', 'GmbH',
         '+49 209 77889900', 'info@outdoor-ruhr.de',
         'Abenteuerweg', '8', 'Gelsenkirchen', '45879', 'DE',
         true, 0.25, '30 Tage netto', true, 'VERIFIED')
) AS p(user_email, company_name, legal_form, phone, email, 
       business_street, business_number, business_city, business_postal_code, business_country,
       use_business_address_for_billing, commission_rate, payment_terms, is_active, verification_status)
WHERE u.email = p.user_email
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- EXPERIENCES
-- ============================================

-- 1. A320 Flugsimulator (Hauptprodukt)
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'A320 Flugsimulator Oberhausen',
    'a320-flugsimulator-oberhausen',
    'Erleben Sie das ultimative Flugerlebnis in unserem professionellen A320 Flugsimulator! Unter Anleitung erfahrener Piloten steuern Sie einen originalgetreuen Airbus A320 Simulator. Wählen Sie aus über 24.000 Flughäfen weltweit und meistern Sie verschiedene Wetterbedingungen. Perfekt für Luftfahrt-Enthusiasten, angehende Piloten oder als außergewöhnliches Geschenk. Keine Vorkenntnisse erforderlich!',
    'Professioneller A320 Flugsimulator mit echter Cockpit-Atmosphäre',
    'FlightHour Simulatorzentrum', 'Hauptstraße 42', 'Oberhausen', '46047', 'DE',
    51.4696, 6.8514,
    90, 2,
    p.id,
    c.id,
    19900, 0.19, 15920,
    'flugsimulator pilot airbus a320 fliegen cockpit oberhausen ruhrgebiet geschenk erlebnis',
    100, true
FROM partners p, categories c
WHERE p.company_name = 'FlightHour GmbH'
AND c.slug = 'simulationen-technik'
ON CONFLICT (slug) DO NOTHING;

-- 2. Tandem Fallschirmsprung
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Tandem Fallschirmsprung Berlin',
    'tandem-fallschirmsprung-berlin',
    'Der Adrenalinkick deines Lebens! Spring aus 4000 Metern Höhe und erlebe 60 Sekunden freien Fall. Anschließend gleiten Sie sanft am Fallschirm zur Erde. Professionelle Tandemmaster sorgen für maximale Sicherheit. Inklusive Einweisung, Ausrüstung und Sprung. Optional mit Video- und Fotopaket erhältlich.',
    'Aus 4000m Höhe - 60 Sekunden freier Fall mit erfahrenem Tandemmaster',
    'Fallschirmsprungzentrum Berlin', 'Flugplatzstraße 1', 'Berlin', '12529', 'DE',
    52.3667, 13.5033,
    240, 6,
    p.id,
    c.id,
    24900, 0.19, 18675,
    'fallschirmsprung tandem skydiving adrenalin extremsport berlin geschenk',
    95, true
FROM partners p, categories c
WHERE p.company_name = 'Adventure Sports Berlin'
AND c.slug = 'abenteuer-action'
ON CONFLICT (slug) DO NOTHING;

-- 3. Wellness-Wochenende Deluxe
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Wellness-Wochenende Deluxe Brandenburg',
    'wellness-wochenende-deluxe-brandenburg',
    'Zwei Übernachtungen im 4-Sterne Wellness-Hotel mit Vollpension. Genießen Sie unbegrenzten Zugang zum Spa-Bereich mit Sauna, Dampfbad und Pools. Inklusive sind eine 60-minütige Ganzkörpermassage, eine Gesichtsbehandlung und tägliches Wellness-Frühstück. Perfekt für Paare oder als Auszeit vom Alltag.',
    '2 Nächte im 4-Sterne Hotel mit Spa, Massage und Vollpension',
    'Wellness Paradise Resort', 'Seestraße 100', 'Potsdam', '14467', 'DE',
    52.3906, 13.0645,
    2880, 2,
    p.id,
    c.id,
    59900, 0.07, 41930,
    'wellness spa hotel wochenende massage sauna entspannung brandenburg potsdam',
    90, true
FROM partners p, categories c
WHERE p.company_name = 'Wellness Paradise Brandenburg'
AND c.slug = 'wellness-entspannung'
ON CONFLICT (slug) DO NOTHING;

-- 4. Sushi-Kochkurs
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Sushi-Kochkurs für Anfänger',
    'sushi-kochkurs-anfaenger-berlin',
    'Lernen Sie die Kunst der Sushi-Zubereitung von einem erfahrenen Sushi-Meister. In unserem 3-stündigen Kurs bereiten Sie verschiedene Sushi-Arten zu: Maki, Nigiri und California Rolls. Alle Zutaten und Werkzeuge werden gestellt. Am Ende genießen Sie Ihre Kreationen bei einem gemeinsamen Essen. Rezeptheft zum Mitnehmen inklusive.',
    'Authentischer Sushi-Kurs mit japanischem Meisterkoch',
    'Gourmet Academy', 'Kochstraße 23', 'Berlin', '10969', 'DE',
    52.5067, 13.3908,
    180, 12,
    p.id,
    c.id,
    8900, 0.19, 7120,
    'sushi kochkurs kochen japanisch maki nigiri berlin kurs workshop',
    88, true
FROM partners p, categories c
WHERE p.company_name = 'Gourmet Academy Berlin'
AND c.slug = 'kulinarik-genuss'
ON CONFLICT (slug) DO NOTHING;

-- 5. Stand-Up Paddling Kurs
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Stand-Up Paddling Einsteigerkurs',
    'stand-up-paddling-kurs-wannsee',
    'Entdecken Sie den Trendsport SUP! In unserem 2-stündigen Einsteigerkurs lernen Sie die Grundtechniken des Stand-Up Paddlings. Nach einer Einführung an Land geht es aufs Wasser. Board, Paddel und Neoprenanzug sind inklusive. Der Kurs findet auf dem ruhigen Wannsee statt - perfekt für Anfänger.',
    'SUP-Grundkurs am Wannsee - Equipment inklusive',
    'SUP Station Wannsee', 'Wannseebadweg 25', 'Berlin', '14109', 'DE',
    52.4213, 13.1782,
    120, 8,
    p.id,
    c.id,
    4900, 0.19, 3675,
    'sup stand up paddling wassersport wannsee berlin kurs anfänger',
    85, true
FROM partners p, categories c
WHERE p.company_name = 'Outdoor Adventures Ruhr'
AND c.slug = 'sport-fitness'
ON CONFLICT (slug) DO NOTHING;

-- 6. Heißluftballonfahrt
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Heißluftballonfahrt über das Ruhrgebiet',
    'heissluftballonfahrt-ruhrgebiet',
    'Schweben Sie lautlos über das Ruhrgebiet und genießen Sie spektakuläre Ausblicke. Die Fahrt dauert etwa 60-90 Minuten, abhängig von Wind und Wetter. Inklusive Sektempfang vor dem Start, Fahrt, Taufurkunde und Rücktransport zum Startpunkt. Ein unvergessliches Erlebnis für besondere Anlässe.',
    'Romantische Ballonfahrt mit Panoramablick und Sektempfang',
    'Ballonport Ruhr', 'Luftfahrtweg 10', 'Essen', '45127', 'DE',
    51.4556, 7.0116,
    180, 16,
    p.id,
    c.id,
    18900, 0.19, 14175,
    'heißluftballon ballonfahrt ruhrgebiet romantisch geschenk himmel fliegen',
    82, true
FROM partners p, categories c
WHERE p.company_name = 'Adventure Sports Berlin'
AND c.slug = 'abenteuer-action'
ON CONFLICT (slug) DO NOTHING;

-- 7. Weinverkostung
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Premium Weinverkostung mit Sommelier',
    'weinverkostung-sommelier-berlin',
    'Tauchen Sie ein in die Welt edler Weine. Unser Sommelier führt Sie durch eine Verkostung von 8 ausgewählten Weinen aus verschiedenen Anbaugebieten. Lernen Sie die Grundlagen der Weinsensorik und erfahren Sie Wissenswertes über Rebsorten, Anbaugebiete und perfekte Food-Pairings. Kleine Snacks inklusive.',
    'Exklusive Weinprobe mit 8 Premium-Weinen und Sommelier',
    'Weinbar Charlottenburg', 'Weinstraße 15', 'Berlin', '10623', 'DE',
    52.5053, 13.3220,
    150, 20,
    p.id,
    c.id,
    7900, 0.19, 6320,
    'wein weinprobe verkostung sommelier tasting berlin geschenk genuss',
    78, true
FROM partners p, categories c
WHERE p.company_name = 'Gourmet Academy Berlin'
AND c.slug = 'kulinarik-genuss'
ON CONFLICT (slug) DO NOTHING;

-- 8. Escape Room Abenteuer
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Escape Room "Der verlorene Schatz"',
    'escape-room-verlorener-schatz-oberhausen',
    'Lösen Sie knifflige Rätsel und entkommen Sie aus unserem Themen-Escape-Room! Sie haben 60 Minuten Zeit, um den verlorenen Schatz zu finden und aus dem Raum zu entkommen. Teamwork, Logik und Kreativität sind gefragt. Perfekt für Gruppen, Teambuilding oder als spannendes Erlebnis mit Freunden.',
    'Spannendes Rätselabenteuer für 2-6 Personen',
    'Escape Adventures Oberhausen', 'Rätselgasse 5', 'Oberhausen', '46045', 'DE',
    51.4711, 6.8525,
    60, 6,
    p.id,
    c.id,
    3900, 0.19, 2925,
    'escape room rätsel team abenteuer oberhausen ruhrgebiet spiel',
    75, true
FROM partners p, categories c
WHERE p.company_name = 'Outdoor Adventures Ruhr'
AND c.slug = 'kultur-kreatives'
ON CONFLICT (slug) DO NOTHING;

-- 9. Quad-Tour
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Quad-Tour durchs Gelände',
    'quad-tour-gelaende-ruhrgebiet',
    'Action und Fahrspaß pur! Nach einer Einweisung starten Sie zu einer 2-stündigen geführten Quad-Tour durch abwechslungsreiches Gelände. Helm und Schutzausrüstung werden gestellt. Führerschein Klasse B erforderlich. Die Tour führt durch Wald, über Hügel und durch matschige Passagen - Nervenkitzel garantiert!',
    'Geführte Offroad Quad-Tour - 2 Stunden Fahrspaß',
    'Quad-Arena Ruhr', 'Offroadpark 1', 'Gelsenkirchen', '45891', 'DE',
    51.5176, 7.0858,
    120, 10,
    p.id,
    c.id,
    12900, 0.19, 9675,
    'quad atv offroad tour gelände ruhrgebiet abenteuer motorsport',
    72, true
FROM partners p, categories c
WHERE p.company_name = 'Adventure Sports Berlin'
AND c.slug = 'abenteuer-action'
ON CONFLICT (slug) DO NOTHING;

-- 10. Alpaka-Wanderung
INSERT INTO experiences (
    title, slug, description, short_description,
    location_name, street, city, postal_code, country,
    latitude, longitude,
    duration, max_participants, 
    partner_id, category_id,
    retail_price, tax_rate, purchase_price,
    search_keywords, popularity_score, is_active
)
SELECT 
    'Alpaka-Wanderung am Niederrhein',
    'alpaka-wanderung-niederrhein',
    'Erleben Sie eine entspannte Wanderung mit flauschigen Alpakas durch die schöne Niederrhein-Landschaft. Nach einer Einführung in den Umgang mit den sanftmütigen Tieren, führen Sie Ihr eigenes Alpaka auf einer 90-minütigen Tour. Perfekt für Familien, Tierliebhaber oder als besonderes Gruppenerlebnis. Inklusive Alpaka-Fütterung.',
    'Gemütliche Wanderung mit kuscheligen Alpakas - ein Erlebnis für die ganze Familie',
    'Alpaka-Farm Niederrhein', 'Tiergartenstraße 20', 'Duisburg', '47058', 'DE',
    51.4344, 6.7626,
    90, 12,
    p.id,
    c.id,
    3900, 0.19, 2925,
    'alpaka wanderung tiere natur niederrhein familie kinder ausflug',
    70, true
FROM partners p, categories c
WHERE p.company_name = 'Outdoor Adventures Ruhr'
AND c.slug = 'tiere-natur'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Finish
-- ============================================
-- Update category counts (optional)
UPDATE categories c
SET sort_order = (
    SELECT COUNT(*) 
    FROM experiences e 
    WHERE e.category_id = c.id AND e.is_active = true
)
WHERE EXISTS (
    SELECT 1 FROM experiences e WHERE e.category_id = c.id
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
END $$;