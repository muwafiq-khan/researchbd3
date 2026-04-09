import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  // ===== USERS =====
  const rahim = await prisma.users.upsert({
    where: { email: 'rahim@test.com' },
    update: { passwordHash: '$2b$10$U.Ty.u5IbB7VprQ0Pv8xJ.AgtfHt5fdpA.uvf7FqYWA4OPftqnsQq', isVerified: true },
    create: {
      email: 'rahim@test.com',
      passwordHash: '$2b$10$U.Ty.u5IbB7VprQ0Pv8xJ.AgtfHt5fdpA.uvf7FqYWA4OPftqnsQq',
      accountType: 'researcher',
      displayName: 'Dr. Rahim Uddin',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
    }
  })

  const nusrat = await prisma.users.upsert({
    where: { email: 'nusrat@test.com' },
    update: {},
    create: {
      email: 'nusrat@test.com',
      passwordHash: 'placeholder',
      accountType: 'researcher',
      displayName: 'Nusrat Jahan',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      isVerified: true,
    }
  })

  const kamal = await prisma.users.upsert({
    where: { email: 'kamal@test.com' },
    update: {},
    create: {
      email: 'kamal@test.com',
      passwordHash: 'placeholder',
      accountType: 'researcher',
      displayName: 'Prof. Kamal Hossain',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      isVerified: true,
    }
  })

  const greenbd = await prisma.users.upsert({
    where: { email: 'greenbd@test.com' },
    update: {},
    create: {
      email: 'greenbd@test.com',
      passwordHash: 'placeholder',
      accountType: 'funding_agency',
      displayName: 'GreenBD Foundation',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      isVerified: true,
    }
  })

  // ===== POSTS =====
  await prisma.posts.createMany({
    skipDuplicates: true,
    data: [
      {
        authorId: rahim.id,
        postType: 'collaboration',
        title: 'Looking for collaborators on climate change impact study in Bangladesh',
        visibility: 'public',
      },
      {
        authorId: nusrat.id,
        postType: 'help',
        title: 'Need help with statistical analysis for my thesis on water quality',
        visibility: 'public',
      },
      {
        authorId: kamal.id,
        postType: 'finished_work',
        title: 'Published: Machine learning approach to crop yield prediction',
        visibility: 'public',
      },
      {
        authorId: greenbd.id,
        postType: 'funding_opportunity',
        title: 'Funding available for renewable energy research projects',
        visibility: 'public',
      },
    ]
  })

  // ===== FIELDS =====
  const csField = await prisma.fields.upsert({
    where: { name: 'Computer Science' },
    update: {},
    create: {
      name: 'Computer Science',
      description: 'Study of computation, algorithms, and information systems',
    }
  })

  const envField = await prisma.fields.upsert({
    where: { name: 'Environmental Science' },
    update: {},
    create: {
      name: 'Environmental Science',
      description: 'Study of environment and solutions to environmental problems',
    }
  })

  const agriField = await prisma.fields.upsert({
    where: { name: 'Agricultural Science' },
    update: {},
    create: {
      name: 'Agricultural Science',
      description: 'Study of farming, food production, and rural development',
    }
  })

  // ===== SUBFIELDS =====
  const mlSubfield = await prisma.subfields.upsert({
    where: { id: 'subfield-ml' },
    update: {},
    create: {
      id: 'subfield-ml',
      fieldId: csField.id,
      name: 'Machine Learning',
      description: 'Algorithms that learn from data',
    }
  })

  const climateSubfield = await prisma.subfields.upsert({
    where: { id: 'subfield-climate' },
    update: {},
    create: {
      id: 'subfield-climate',
      fieldId: envField.id,
      name: 'Climate Change',
      description: 'Study of long-term shifts in global temperatures and weather patterns',
    }
  })

  const cropSubfield = await prisma.subfields.upsert({
    where: { id: 'subfield-crop' },
    update: {},
    create: {
      id: 'subfield-crop',
      fieldId: agriField.id,
      name: 'Crop Science',
      description: 'Study of crop production and improvement',
    }
  })
// ===== PROBLEM APPLICABLE FIELDS =====
  // Junction table: connects problems to fields that can help solve them.
  // This is the cross-disciplinary link — coastal erosion isn't JUST
  // an environmental problem, CS and AgSci can help too.
  //
  // Django equivalent: Problem.applicable_fields.through.objects.create(...)
  //
  // createMany with skipDuplicates — re-running seed won't crash
  // on the composite primary key (problemId + fieldId).

  await prisma.problem_applicable_fields.createMany({
    skipDuplicates: true,
    data: [
      // ── Problem 001: Bengali NLP ──
      {
        problemId: 'problem-001',
        fieldId: csField.id,
        howThisFieldHelps: 'NLP model architecture, transformer fine-tuning, tokenizer design, and benchmark creation for low-resource languages.',
        relevantTechniques: 'Transfer learning, multilingual transformers (mBERT, XLM-R), data augmentation, active learning for annotation',
        openResearchQuestions: 'Can synthetic data generation close the gap for low-resource Bengali NLP? How do morphologically rich languages affect tokenizer design?',
      },

      // ── Problem 002: Coastal erosion — 3 fields can help ──
      {
        problemId: 'problem-002',
        fieldId: envField.id,
        howThisFieldHelps: 'Climate modeling, coastal geomorphology, mangrove ecosystem restoration, and sea level rise projections.',
        relevantTechniques: 'GIS mapping, sediment transport modeling, mangrove replanting protocols, tidal gauge analysis',
        openResearchQuestions: 'What is the tipping point for Sundarbans mangrove collapse? Can engineered wetlands replace natural barriers?',
      },
      {
        problemId: 'problem-002',
        fieldId: csField.id,
        howThisFieldHelps: 'Satellite image analysis for erosion tracking, ML-based flood prediction models, early warning system software.',
        relevantTechniques: 'Remote sensing with CNNs, time-series forecasting (LSTM), real-time sensor data pipelines',
        openResearchQuestions: 'Can satellite imagery predict erosion hotspots 5-10 years in advance? How accurate are ML flood models for deltaic regions?',
      },
      {
        problemId: 'problem-002',
        fieldId: agriField.id,
        howThisFieldHelps: 'Salt-tolerant crop varieties for affected regions, soil science for understanding land degradation patterns.',
        relevantTechniques: 'Saline agriculture, floating garden cultivation, soil salinity mapping',
        openResearchQuestions: 'Can floating agriculture scale to feed displaced coastal populations?',
      },

      // ── Problem 003: Rice yield stagnation ──
      {
        problemId: 'problem-003',
        fieldId: agriField.id,
        howThisFieldHelps: 'Heat-tolerant rice breeding, crop management practices, irrigation optimization for temperature control.',
        relevantTechniques: 'Speed breeding, marker-assisted selection, deficit irrigation, crop microclimate management',
        openResearchQuestions: 'Can CRISPR-edited heat tolerance genes be deployed in Bangladesh rice varieties within regulatory frameworks?',
      },
      {
        problemId: 'problem-003',
        fieldId: csField.id,
        howThisFieldHelps: 'Precision agriculture using drone imagery, yield prediction models, and weather-crop interaction simulations.',
        relevantTechniques: 'Computer vision for crop stress detection, random forest yield prediction, IoT soil sensors',
        openResearchQuestions: 'Can low-cost smartphone-based crop monitoring replace expensive drone systems for smallholder farmers?',
      },

      // ── Problem 004: Medical imaging AI ──
      {
        problemId: 'problem-004',
        fieldId: csField.id,
        howThisFieldHelps: 'Building South Asian medical imaging datasets, fine-tuning diagnostic models, federated learning across hospitals.',
        relevantTechniques: 'Transfer learning on medical images, federated learning, data augmentation for medical scans, explainable AI',
        openResearchQuestions: 'How much South Asian training data is needed to match Western-trained model accuracy? Can federated learning solve privacy concerns?',
      },

      // ── Problem 005: Arsenic contamination ──
      {
        problemId: 'problem-005',
        fieldId: envField.id,
        howThisFieldHelps: 'Hydrogeology of arsenic mobilization, water treatment chemistry, community-scale filtration system design.',
        relevantTechniques: 'Iron oxide adsorption, electrocoagulation, aquifer mapping, groundwater flow modeling',
        openResearchQuestions: 'Why do arsenic levels vary so dramatically between neighboring wells? Can we predict safe aquifer zones without drilling?',
      },
      {
        problemId: 'problem-005',
        fieldId: csField.id,
        howThisFieldHelps: 'Geospatial prediction of arsenic hotspots, mobile apps for village-level water testing data collection.',
        relevantTechniques: 'Spatial interpolation (kriging), classification models for well safety, crowdsourced data platforms',
        openResearchQuestions: 'Can ML models predict arsenic concentration from geological features alone, eliminating the need for chemical testing of every well?',
      },
    ]
  })
  console.log('Seed complete!')
}

main()
  .catch(function(e) {
    console.error(e)
    process.exit(1)
  })
  .finally(async function() {
    await prisma.$disconnect()
  })