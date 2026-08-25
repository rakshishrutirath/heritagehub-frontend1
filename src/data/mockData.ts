import { 
  Artifact, 
  ThreeDModelData, 
  TimelineEpoch, 
  OnlineExhibition, 
  CommunityStory, 
  ForumDiscussion, 
  MarketplaceProduct 
} from '../types';

export const ARTIFACTS: Artifact[] = [
  {
    id: 'art-001',
    title: 'Terracotta Lion Relief Amphora',
    subtitle: 'High-relief ceremonial storage vessel with feline frieze',
    catalogNumber: 'HH-ARC-1094',
    period: 'Hellenistic Antiquity',
    epoch: 'Classic & Hellenistic (500 BCE – 31 BCE)',
    dateRange: 'circa 320 – 280 BCE',
    culture: 'Magna Graecia / Apulian',
    region: 'Southern Italian Peninsula',
    coordinates: { lat: 40.7928, lng: 17.1012 },
    medium: 'Terracotta with red slip and slip-painted relief bands',
    dimensions: 'Height: 48.5 cm | Diameter: 32.2 cm | Weight: 4.8 kg',
    description: 'A masterwork of late Hellenistic ceramic craftsmanship, this high-shouldered amphora is encircled with an intricate continuous bas-relief frieze of pacing lions and heraldic palmettes. Fired in a controlled reducing atmosphere, the slip exhibits subtle mineral crystallization.',
    provenance: 'Excavated 1894 in Canosa di Puglia; Acquired by the Archival Heritage Trust 1952; Provenance verified under 1970 UNESCO standards.',
    historicalContext: 'Ceremonial vessels of this caliber were dedicated in elite tombs to honor deceased dignitaries or civic benefactors, symbolizing courage and divine guardianship.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5sBeA-KNBqV45gfL58R80lQFkly9zqOHhYHYmnYq7R2ESShq6q0C4McFlhJ9c5ek5NW_KazTu3Loe837dLqUn5erSnQn6eHgf6YWTzdGltfVvYtnP6_3UmalZqjyRslOL9peBD-tV-1_6dAG_DvpWYJ5UPiTXa7VEED5_xqDmfa96_HWumTilr2_IhJJbWaprDd6vTy3DFD3zhw5TNebouldoMmjYb5vFQsCly_bd4pewVCw5zz_KkQ',
    additionalImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599707307044-84d411f592cb?auto=format&fit=crop&w=1200&q=80'
    ],
    threeDModelAvailable: true,
    modelId: '3d-001',
    category: 'pottery',
    verificationStatus: 'verified',
    institution: 'Archival Heritage Trust & Museum Consortium',
    curatorNotes: 'Spectroscopic analysis (2021) identified local clay mineral signatures from the Ofanto River basin.',
    audioGuideUrl: 'https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3',
    audioDuration: '2:45 min',
    tags: ['Terracotta', 'Ceramics', 'Hellenistic', 'Faunal Iconography', 'Magna Graecia'],
    featured: true,
    significanceRating: 9.8
  },
  {
    id: 'art-002',
    title: 'Tang Dynasty Sancai Glazed Courser',
    subtitle: 'Ceremonial tomb steed with amber, green and cream lead glaze',
    catalogNumber: 'HH-ARC-2481',
    period: 'Tang Dynasty',
    epoch: 'Silk Road & Tang Golden Age (618 – 907 CE)',
    dateRange: 'circa 700 – 750 CE',
    culture: 'Tang Imperial China',
    region: 'Chang\'an (Modern Xi\'an, Shaanxi)',
    coordinates: { lat: 34.3416, lng: 108.9398 },
    medium: 'Molded earthenware with tricolor (sancai) lead glaze',
    dimensions: 'Height: 68.0 cm | Length: 74.5 cm',
    description: 'This spirited ceramic stallion stands with arched neck, docked tail, and flared nostrils. The vibrant amber, copper-green, and creamy white glazes pooled during firing to create an organic, dripped glass surface prized along the Silk Road.',
    provenance: 'Discovered in Luoyang sector 1928; cataloged in the National Antiquities Registry; on perpetual loan.',
    historicalContext: 'Horses of the Western Regions (Ferghana \'Heavenly Horses\') were vital symbols of imperial military might, prestige, and trade prosperity in Tang society.',
    imageUrl: 'https://images.unsplash.com/photo-1599707307044-84d411f592cb?auto=format&fit=crop&w=1000&q=80',
    threeDModelAvailable: true,
    modelId: '3d-002',
    category: 'sculpture',
    verificationStatus: 'verified',
    institution: 'East Asian Archival Repository',
    curatorNotes: 'Thermoluminescence dating confirms firing range between 690 and 740 CE.',
    audioGuideUrl: 'https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3',
    audioDuration: '3:10 min',
    tags: ['Tang Dynasty', 'Sancai Glaze', 'Ceramics', 'Equine', 'Silk Road'],
    featured: true,
    significanceRating: 9.9
  },
  {
    id: 'art-003',
    title: 'Corinthian Archaic Crested Bronze Helmet',
    subtitle: 'Hammered single-sheet bronze battle helmet with almond eye slits',
    catalogNumber: 'HH-ARC-0872',
    period: 'Archaic Greece',
    epoch: 'Iron Age & Archaic Foundations (1200 BCE – 500 BCE)',
    dateRange: 'circa 540 – 500 BCE',
    culture: 'Corinthian / Peloponnesian',
    region: 'Isthmus of Corinth, Greece',
    coordinates: { lat: 37.9056, lng: 22.8797 },
    medium: 'Hammered cast bronze with natural malachite patina',
    dimensions: 'Height: 31.0 cm | Width: 22.4 cm | Depth: 26.5 cm',
    description: 'Seamlessly hammered from a single ingot of high-tin bronze, this Corinthian helmet features a prominent nasal guard, swept cheek-pieces, and refined contouring around the cranium for defensive resilience.',
    provenance: 'Recovered from an underwater votive cache in the Corinthian Gulf (1964); conserved in Athens; certified authentic.',
    historicalContext: 'Worn by Greek hoplites in phalanx formations, such helmets were often dedicated to Zeus or Athena at panhellenic sanctuaries following triumphant campaigns.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
    threeDModelAvailable: true,
    modelId: '3d-003',
    category: 'metalwork',
    verificationStatus: 'verified',
    institution: 'Mediterranean Archaeological Institute',
    curatorNotes: 'Trace metal analysis shows copper mined from ancient Laurion deposits.',
    tags: ['Bronze Age', 'Corinthian', 'Metallurgy', 'Armor', 'Votive'],
    featured: true,
    significanceRating: 9.7
  },
  {
    id: 'art-004',
    title: 'Illuminated Vellum Manuscript of Cosmography',
    subtitle: 'Hand-copied astronomical charts and gold-leaf celestial maps',
    catalogNumber: 'HH-ARC-3310',
    period: 'High Medieval',
    epoch: 'Medieval Scholars & Silk Routes (1000 – 1450 CE)',
    dateRange: 'circa 1380 CE',
    culture: 'Late Byzantine / Venetian Guild',
    region: 'Constantinople & Northern Adriatic',
    coordinates: { lat: 41.0082, lng: 28.9784 },
    medium: 'Iron gall ink and ground lapis lazuli on fine calfskin vellum with burnished 23k gold leaf',
    dimensions: 'Folio size: 34.5 x 24.8 cm | 182 leaves',
    description: 'An exceptionally preserved codex synthesizing Ptolemaic planetary tables with Arabic navigational coordinates. The intricate frontispiece depicts an armillary sphere supported by winged allegorical figures.',
    provenance: 'Monastery of St. John the Theologian archive until 1812; private collection of Lord Harford; gifted 1974.',
    historicalContext: 'Reflects the vibrant intellectual synthesis across Mediterranean trade routes prior to the Renaissance.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1000&q=80',
    category: 'manuscripts',
    verificationStatus: 'verified',
    institution: 'Historical Manuscripts Foundation',
    tags: ['Manuscript', 'Gold Leaf', 'Astronomy', 'Byzantine', 'Vellum'],
    featured: false,
    significanceRating: 9.5
  },
  {
    id: 'art-005',
    title: 'Mesoamerican Ceremonial Jade Mosaic Mask',
    subtitle: 'Polished jadeite tesserae with shell inlays and obsidian irises',
    catalogNumber: 'HH-ARC-4912',
    period: 'Classic Maya',
    epoch: 'Pre-Columbian Civilizations (2000 BCE – 1500 CE)',
    dateRange: 'circa 600 – 750 CE',
    culture: 'Maya Civilisation (Palenque style)',
    region: 'Chiapas Highlands, Mesoamerica',
    coordinates: { lat: 17.4838, lng: -92.0463 },
    medium: 'Apple-green jadeite mosaic tiles, mother-of-pearl, and polished obsidian mounted on cedar core',
    dimensions: 'Height: 24.0 cm | Width: 18.5 cm',
    description: 'Crafted for a Maya ruler to accompany the spirit into the Underworld (Xibalba), this funerary portrait radiates royal serenity. The jade mosaic tiles were meticulously cut and fitted with pine-resin adhesive.',
    provenance: 'Royal Tomb excavation 1956; preserved in national heritage registry under protocol A-74.',
    historicalContext: 'In Maya cosmology, jade represented breath, maize, and eternal life, conferring divine solar lineage upon the ruler.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    threeDModelAvailable: true,
    modelId: '3d-004',
    category: 'jewelry',
    verificationStatus: 'verified',
    institution: 'Mesoamerican Heritage Council',
    tags: ['Maya', 'Jade', 'Funerary', 'Mosaic', 'Mesoamerica'],
    featured: true,
    significanceRating: 9.8
  },
  {
    id: 'art-006',
    title: 'Indus Valley Harappan Steatite Seal: Unicorn & Script',
    subtitle: 'Intaglio carved soft stone stamp seal with undeciphered proto-Dravidian script',
    catalogNumber: 'HH-ARC-0118',
    period: 'Mature Harappan Phase',
    epoch: 'Bronze Age Dawns (3300 – 1300 BCE)',
    dateRange: 'circa 2500 – 1900 BCE',
    culture: 'Indus Valley Civilisation',
    region: 'Mohenjo-daro (Sindh Basin)',
    coordinates: { lat: 27.3292, lng: 68.1389 },
    medium: 'Baked steatite with alkali glaze coating',
    dimensions: '3.2 x 3.2 x 0.8 cm | Weight: 24 g',
    description: 'An iconic master-seal depicting a majestic mythical one-horned animal standing before a ritual brazier or manger. Above the creature is a five-glyph line of Indus script carved in reverse intaglio for stamping clay seals.',
    provenance: 'Recovered during 1927 excavation seasons in HR Area; catalogued in archival indices.',
    historicalContext: 'Used by merchant guilds and civic administrators to seal sacks of cotton, lapis, and grains traded through maritime routes to ancient Mesopotamia.',
    imageUrl: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1000&q=80',
    category: 'sculpture',
    verificationStatus: 'verified',
    institution: 'Indus Basin Cultural Mission',
    tags: ['Indus Valley', 'Steatite', 'Seal', 'Proto-Script', 'Bronze Age'],
    featured: true,
    significanceRating: 9.9
  },
  {
    id: 'art-007',
    title: 'Coptic Linen & Wool Tapestry Roundel',
    subtitle: 'Finely woven decorative medallion featuring confronting peacocks and vine scrolls',
    catalogNumber: 'HH-ARC-1855',
    period: 'Late Roman / Byzantine Egypt',
    epoch: 'Late Antiquity & Transitions (200 – 700 CE)',
    dateRange: 'circa 450 – 550 CE',
    culture: 'Coptic Egyptian',
    region: 'Fayum Oasis & Nile Valley',
    coordinates: { lat: 29.3084, lng: 30.8428 },
    medium: 'Unbleached linen warp with polychrome dyed wool weft (madder red, woad blue, weld yellow)',
    dimensions: 'Diameter: 22.8 cm',
    description: 'This circular textile medallion (orbiculus) once adorned a linen tunic. The naturalistic peacocks flanking a central kantharos urn symbolize renewal and eternal life in early Christian iconography.',
    provenance: 'Acquired in Cairo 1904; textile stabilization completed by conservation labs 2018.',
    historicalContext: 'Coptic weavers preserved Greco-Roman aesthetic traditions while developing distinct Christian liturgical textile idioms.',
    imageUrl: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=1000&q=80',
    category: 'textiles',
    verificationStatus: 'verified',
    institution: 'Mediterranean Textile Archives',
    tags: ['Coptic', 'Textiles', 'Weaving', 'Late Antiquity', 'Fayum'],
    featured: false,
    significanceRating: 9.1
  },
  {
    id: 'art-008',
    title: 'Samarkand Kufic Calligraphic Ceramic Bowl',
    subtitle: 'White slip-painted terracotta with black slip blessing inscription',
    catalogNumber: 'HH-ARC-2773',
    period: 'Samanid Dynasty',
    epoch: 'Islamic Golden Age & Samanid Renaissance (800 – 1200 CE)',
    dateRange: 'circa 950 – 1000 CE',
    culture: 'Samanid Central Asia',
    region: 'Nishapur / Samarkand (Transoxiana)',
    coordinates: { lat: 39.6542, lng: 66.9597 },
    medium: 'Fine reddish earthenware coated with opaque white engobe, slip-painted, clear lead glaze',
    dimensions: 'Diameter: 27.5 cm | Height: 8.2 cm',
    description: 'Renowned for its austere elegance, the wide rim features a florid Kufic proverb: "Planning before work protects you from regret; prosperity and peace." The calligraphy stretches gracefully across the stark white ground.',
    provenance: 'Afrasiab archaeological survey 1937; conserved and catalogued in regional registry.',
    historicalContext: 'Reflects the flourishing intellectual and urban elite culture of the Silk Road under Samanid patronage.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
    category: 'pottery',
    verificationStatus: 'verified',
    institution: 'Central Asian Historical Guild',
    tags: ['Samanid', 'Calligraphy', 'Ceramics', 'Kufic', 'Silk Road'],
    featured: true,
    significanceRating: 9.6
  }
];

export const THREE_D_MODELS: ThreeDModelData[] = [
  {
    id: '3d-001',
    artifactId: 'art-001',
    title: 'Terracotta Lion Relief Amphora',
    geometryType: 'amphora',
    texturePreset: 'terracotta',
    polygonCount: 84200,
    dimensions: '48.5 cm (H) x 32.2 cm (W)',
    historicalContext: 'Late Hellenistic ceremonial vessel with raised frieze reliefs. Laser scanned at 50-micron resolution with photogrammetric color normalization.',
    hotspots: [
      {
        id: 'hs-1',
        position: [0, 0.4, 0.9],
        title: 'High-Relief Lion Frieze',
        annotation: 'Note the muscular articulation in the pacing lion. The slip was hand-burnished prior to kiln reduction.'
      },
      {
        id: 'hs-2',
        position: [0, 1.2, 0.4],
        title: 'Archival Rim Lip & Neck',
        annotation: 'The wide outward flare was engineered for ceremonial pouring during harvest libations.'
      },
      {
        id: 'hs-3',
        position: [0.7, 0.1, 0],
        title: 'Mineral Crystallization',
        annotation: 'Natural silica and iron oxide precipitation formed during centuries in calcified soil.'
      }
    ],
    curatorAudioGuide: 'Curator Dr. Eleanor Vance describes the chemical composition and the rare slip technique used in Magna Graecia.'
  },
  {
    id: '3d-002',
    artifactId: 'art-002',
    title: 'Tang Sancai Courser',
    geometryType: 'horse',
    texturePreset: 'gold_patina',
    polygonCount: 112000,
    dimensions: '68.0 cm (H) x 74.5 cm (L)',
    historicalContext: 'Earthenware funerary steed with tricolor lead glaze. Preserves authentic pooled mineral drip patterns.',
    hotspots: [
      {
        id: 'hs-201',
        position: [0, 0.8, 0.8],
        title: 'Saddle & Trappings',
        annotation: 'Embossed leather and silk saddlecloth detailing modeled after royal cavalry gear.'
      },
      {
        id: 'hs-202',
        position: [0, 1.4, 0.5],
        title: 'Arched Head & Flared Nostrils',
        annotation: 'Sculptural vitality characteristic of imperial workshops in Chang\'an.'
      }
    ]
  },
  {
    id: '3d-003',
    artifactId: 'art-003',
    title: 'Corinthian Archaic Helmet',
    geometryType: 'helmet',
    texturePreset: 'bronze',
    polygonCount: 96500,
    dimensions: '31.0 cm (H) x 22.4 cm (W)',
    historicalContext: 'Seamless forged single-sheet high-tin bronze. Shows characteristic malachite and cuprite oxidation patinas.',
    hotspots: [
      {
        id: 'hs-301',
        position: [0, 0.2, 0.8],
        title: 'Nasal Guard & Sight Apertures',
        annotation: 'Carefully tapered to balance maximum vision in battle with facial protection.'
      },
      {
        id: 'hs-302',
        position: [0, 0.9, 0.1],
        title: 'Crest Mount Ridge',
        annotation: 'Reinforced ridge designed to mount horsehair crest plumes signifying hoplite rank.'
      }
    ]
  },
  {
    id: '3d-004',
    artifactId: 'art-005',
    title: 'Classic Maya Jade Mask',
    geometryType: 'mask',
    texturePreset: 'jade',
    polygonCount: 135000,
    dimensions: '24.0 cm (H) x 18.5 cm (W)',
    historicalContext: 'Royal funerary portrait mosaic assembled from 160 cut jadeite plates and obsidian pupil inlays.',
    hotspots: [
      {
        id: 'hs-401',
        position: [0, 0.1, 0.5],
        title: 'Polished Jadeite Tesserae',
        annotation: 'High-grade imperial green jadeite quarried from the Motagua River Valley in Guatemala.'
      },
      {
        id: 'hs-402',
        position: [0.3, 0.3, 0.4],
        title: 'Mother-of-Pearl Sclera',
        annotation: 'Marine shell sourced from Pacific trade networks, representing primordial oceanic deities.'
      }
    ]
  }
];

export const TIMELINE_EPOCHS: TimelineEpoch[] = [
  {
    id: 'ep-01',
    name: 'Dawn of Bronze & Early Urban Centers',
    span: '3500 BCE – 1200 BCE',
    startBCE: 3500,
    endBCE: 1200,
    description: 'The birth of writing, monumental stone architecture, and sophisticated metallurgy across the fertile river valleys of Mesopotamia, Egypt, and the Indus.',
    keyEvents: [
      '3300 BCE: Cuneiform script develops in Uruk',
      '2600 BCE: Construction of the Great Bath at Mohenjo-daro',
      '2550 BCE: Giza Pyramid complex built',
      '1750 BCE: Code of Hammurabi inscribed in Babylon'
    ],
    representativeArtifactIds: ['art-006'],
    image: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ep-02',
    name: 'Archaic, Classical & Hellenistic Horizon',
    span: '1200 BCE – 31 BCE',
    startBCE: 1200,
    endBCE: 31,
    description: 'An era of profound philosophical enquiry, democratic civic structures, and unprecedented mastery over marble, bronze, and wheel-thrown ceramic arts.',
    keyEvents: [
      '776 BCE: First recorded Olympic Games',
      '508 BCE: Athenian democratic reforms',
      '334 BCE: Alexander the Great connects Mediterranean with Indus Valley',
      '146 BCE: Rome establishes dominance in the Aegean'
    ],
    representativeArtifactIds: ['art-001', 'art-003'],
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ep-03',
    name: 'Imperial Empires & Silk Road Arteries',
    span: '200 BCE – 900 CE',
    startBCE: 200,
    endBCE: -900,
    description: 'Trans-continental trade routes link Rome, Parthia, the Kushan Empire, and Han-Tang China, driving explosive exchange in science, textiles, and religions.',
    keyEvents: [
      '130 BCE: Han Dynasty officially opens Silk Road routes',
      '313 CE: Edict of Milan legalizes Christianity in Rome',
      '618 CE: Tang Dynasty establishes cosmopolitan capital in Chang\'an',
      '751 CE: Battle of Talas transmits papermaking technologies'
    ],
    representativeArtifactIds: ['art-002', 'art-005', 'art-007'],
    image: 'https://images.unsplash.com/photo-1599707307044-84d411f592cb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ep-04',
    name: 'Medieval Synthesis & Renaissance Dawn',
    span: '900 CE – 1600 CE',
    startBCE: -900,
    endBCE: -1600,
    description: 'The Golden Age of Islamic scholarship, Gothic cathedral engineering, Mesoamerican temple-cities, and the rediscovery of classical proportions in Italy.',
    keyEvents: [
      '969 CE: Al-Azhar University founded in Cairo',
      '1215 CE: Magna Carta sealed at Runnymede',
      '1380 CE: Byzantine-Venetian cosmographical manuscripts peak',
      '1440 CE: Gutenberg invents movable type press'
    ],
    representativeArtifactIds: ['art-004', 'art-008'],
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80'
  }
];

export const ONLINE_EXHIBITIONS: OnlineExhibition[] = [
  {
    id: 'ex-01',
    title: 'Vessel & Void: Form, Function and Fire in Ancient Ceramics',
    curator: 'Prof. Sofia Al-Hassan',
    curatorTitle: 'Senior Archival Fellow in Mediterranean Material Culture',
    curatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'A curated exploration of how the humble medium of earth and water was elevated by ancient artisans into timeless vessels of religious devotion, trade wealth, and statecraft.',
    heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    artifactIds: ['art-001', 'art-002', 'art-008'],
    estimatedTime: '18 min tour',
    publishedDate: 'Curated Autumn 2024',
    sections: [
      {
        title: 'The Alchemical Transform of Clay',
        body: 'Across ancient civilizations, the potter held a sacred role. The manipulation of fire atmospheres—switching from oxidizing red flames to oxygen-starved reduction—allowed potters in Greece and Samarkand to control surface mineral colors with chemist-like precision.'
      },
      {
        title: 'Ceramics as Global Trade Currency',
        body: 'Whether containing oil, grain, wine, or prized medicinal balms, ceramic vessels were the shipping containers of antiquity. Stamped handles and stylistic friezes acted as the earliest verified brand marks.'
      }
    ]
  },
  {
    id: 'ex-02',
    title: 'Echoes of the Indus: Secrets of the First Planned Cities',
    curator: 'Dr. Tariq Dev Verma',
    curatorTitle: 'Director of Harappan Epigraphy and Urban Archaeology',
    curatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    description: 'Step into the 5,000-year-old grid streets of Mohenjo-daro and Harappa. Discover standardized weights, covered sanitation systems, and the tantalizing mysteries of undeciphered glyphs.',
    heroImage: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=1200&q=80',
    artifactIds: ['art-006'],
    estimatedTime: '15 min tour',
    publishedDate: 'Curated Winter 2024',
    sections: [
      {
        title: 'Egalitarian Civil Engineering',
        body: 'Unlike their contemporaries in Mesopotamia and Egypt who built monumental royal palaces and tombs, the cities of the Indus Valley emphasized civic infrastructure: uniform burnt-brick homes, private bathing facilities, and elaborate drain systems.'
      },
      {
        title: 'The Undeciphered Seals',
        body: 'Over 4,000 inscribed objects have been cataloged. Through modern machine-learning computational linguistic models integrated into HeritageHub, researchers are analyzing structural patterns to decode this ancient language.'
      }
    ]
  }
];

export const COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: 'cs-01',
    title: 'Preserving the Forgotten Terracotta Kilns of Apulia',
    authorName: 'Matteo Bellini',
    authorRole: 'Heritage Guardian & 4th Generation Potter',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    region: 'Puglia, Italy',
    date: '3 days ago',
    content: 'For four generations, our family has documented the ancient subterranean wood-firing kilns around Canosa. Last month, with the help of HeritageHub\'s mobile photogrammetry tool, we created a complete 3D digital twin of a 4th-century BCE kiln before local highway expansion began. Here is the oral account recorded with my grandfather...',
    audioRecordingUrl: 'https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3',
    audioLength: '4:12 min',
    tags: ['Apulia', 'Oral History', 'Kiln Tech', 'Fieldwork', 'Photogrammetry'],
    likes: 142,
    commentsCount: 28,
    verifiedByScholar: true,
    relatedArtifactId: 'art-001',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'cs-02',
    title: 'Deciphering the Weaving Songs of the Andean Cloud Forests',
    authorName: 'Elena Quispe Huaman',
    authorRole: 'Quechua Textile Archivist',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    region: 'Cusco Highlands, Peru',
    date: '1 week ago',
    content: 'Every color and geometric thread in our backstrap-loom weavings corresponds to specific genealogical events and agricultural cycles. By linking our community sound recordings directly to the HeritageHub archive, we are ensuring future generations can hear the original songs that guide each pattern.',
    audioRecordingUrl: 'https://cdn.freesound.org/previews/518/518305_5674468-lq.mp3',
    audioLength: '5:48 min',
    tags: ['Andes', 'Indigenous Heritage', 'Textiles', 'Oral Tradition'],
    likes: 218,
    commentsCount: 45,
    verifiedByScholar: true,
    images: ['https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=800&q=80']
  }
];

export const FORUM_DISCUSSIONS: ForumDiscussion[] = [
  {
    id: 'fd-01',
    title: 'Re-evaluating the Stamp Inscriptions of Late Bronze Age Trade Amphorae',
    category: 'Epigraphy & Translation',
    author: 'Dr. Marcus Thorne',
    authorBadge: 'Senior Epigrapher',
    timeAgo: '2 hours ago',
    replies: 19,
    views: 340,
    tags: ['Amphorae', 'Epigraphy', 'Bronze Age', 'Levant'],
    pinned: true
  },
  {
    id: 'fd-02',
    title: 'Best Practices for Non-Invasive Multispectral Imaging on Charred Papyrus',
    category: 'Conservation Tech',
    author: 'Aisha Al-Mansoor',
    authorBadge: 'Conservator Fellow',
    timeAgo: '1 day ago',
    replies: 34,
    views: 612,
    tags: ['Multispectral', 'Manuscripts', 'Papyrus', 'Imaging']
  },
  {
    id: 'fd-03',
    title: 'Unrecorded Rock Art Petroglyphs in the Western Ghats: A Provenance Request',
    category: 'Field Discoveries',
    author: 'Rohan Deshmukh',
    authorBadge: 'Field Contributor',
    timeAgo: '3 days ago',
    replies: 42,
    views: 890,
    tags: ['Rock Art', 'Petroglyphs', 'India', 'Survey']
  }
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-01',
    name: 'Canosa Lion Relief Amphora (Certified Master Replica)',
    subtitle: 'Hand-thrown terracotta with archival red slip and relief carvings',
    price: 340,
    category: 'replicas',
    artisanGuild: 'Bottega Ceramiche Antiche (Puglia, Italy)',
    originRegion: 'Southern Italy',
    material: 'Natural calcified terracotta, wood-fired at 980°C',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5sBeA-KNBqV45gfL58R80lQFkly9zqOHhYHYmnYq7R2ESShq6q0C4McFlhJ9c5ek5NW_KazTu3Loe837dLqUn5erSnQn6eHgf6YWTzdGltfVvYtnP6_3UmalZqjyRslOL9peBD-tV-1_6dAG_DvpWYJ5UPiTXa7VEED5_xqDmfa96_HWumTilr2_IhJJbWaprDd6vTy3DFD3zhw5TNebouldoMmjYb5vFQsCly_bd4pewVCw5zz_KkQ',
    description: 'Handcrafted by master potters using traditional Hellenistic techniques and historical clay mineral formulas. Each piece includes an authenticated certificate of craftsmanship and individual registry number.',
    dimensions: 'Height: 38 cm | Diameter: 25 cm',
    inStock: true,
    certifiedMasterpiece: true,
    editionLimit: 'Limited Archival Edition of 100'
  },
  {
    id: 'prod-02',
    name: 'Tang Sancai Courser Studio Sculpture',
    subtitle: 'Tri-color glazed stoneware recreating Chang\'an royal tomb figurines',
    price: 420,
    category: 'replicas',
    artisanGuild: 'Luoyang Imperial Kiln Masters',
    originRegion: 'Henan, China',
    material: 'Stoneware with lead-free traditional sancai glaze',
    imageUrl: 'https://images.unsplash.com/photo-1599707307044-84d411f592cb?auto=format&fit=crop&w=800&q=80',
    description: 'Molded and hand-finished with meticulous attention to 8th-century imperial proportions. Features natural crystalline glaze pooling on the flanks and saddle.',
    dimensions: 'Height: 45 cm | Length: 50 cm',
    inStock: true,
    certifiedMasterpiece: true,
    editionLimit: 'Limited Edition of 50'
  },
  {
    id: 'prod-03',
    name: 'Atlas of Ancient Civilizations & Epigraphic Scripts',
    subtitle: 'Hardbound archival monograph with 420 color plates and folding maps',
    price: 85,
    category: 'books',
    artisanGuild: 'HeritageHub Academic Publishing',
    originRegion: 'London / Athens',
    material: 'FSC Certified Archival Linen Cloth & 150gsm Munken Paper',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    description: 'An authoritative survey of world material cultures, compiled by 48 international archaeologists and epigraphers. Contains high-resolution scans and contextual essays.',
    dimensions: '32 x 26 cm | 512 pages',
    inStock: true,
    certifiedMasterpiece: false
  },
  {
    id: 'prod-04',
    name: 'Corinthian Archaic Helmet Museum Cast',
    subtitle: 'Lost-wax cast bronze with hand-applied malachite patina',
    price: 580,
    category: 'replicas',
    artisanGuild: 'Peloponnese Foundry Guild',
    originRegion: 'Peloponnese, Greece',
    material: '90% Copper / 10% Tin alloy with natural patina oxidations',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
    description: 'Cast using the ancient lost-wax method from laser scans of museum originals. Mounted on a solid honed black travertine marble pedestal.',
    dimensions: 'Height: 30 cm on pedestal',
    inStock: true,
    certifiedMasterpiece: true,
    editionLimit: 'Numbered 1 to 75'
  }
];

export const mockArtifacts = ARTIFACTS;
export const mockTimeline = TIMELINE_EPOCHS;
export const mockExhibitions = ONLINE_EXHIBITIONS;
export const mockCommunityStories = COMMUNITY_STORIES;
export const mockForumDiscussions = FORUM_DISCUSSIONS;
export const mockThreeDModels = THREE_D_MODELS;
export const mockProducts = MARKETPLACE_PRODUCTS;


