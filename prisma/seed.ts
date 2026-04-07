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

  // ===== PROBLEMS =====
  await prisma.problems.upsert({
    where: { id: 'problem-001' },
    update: {},
    create: {
      id: 'problem-001',
      subfieldId: mlSubfield.id,
      title: 'Low accuracy of Bengali NLP models',
      description: 'Bengali NLP models remain significantly less accurate than English counterparts despite 230 million speakers worldwide.',
      detailedContent: `Bengali is the seventh most spoken language in the world with over 230 million native speakers, yet the state of natural language processing for Bengali is decades behind English. Current Bengali NLP models achieve accuracy rates of 60-70% on standard benchmarks, compared to 90-95% for English models on equivalent tasks.

This gap exists across all NLP domains — machine translation produces awkward and often incorrect output, sentiment analysis misclassifies emotional tone in social media content, speech recognition fails in noisy environments, and named entity recognition struggles with Bengali-specific proper nouns and transliterations.

The consequences are real and immediate. Government digital services cannot effectively serve Bengali-speaking citizens. Healthcare information systems fail to communicate accurately. Educational technology built on NLP cannot reach the majority of Bangladeshi students in their native language.`,
      impact: 'Affects 230 million Bengali speakers globally. Limits access to AI-powered services, digital government, healthcare information, and educational technology for the entire Bengali-speaking population.',
      currentProgress: 'Several universities in Bangladesh and India have released Bengali NLP datasets. BanglaLM and BanglaBERT models have shown improvement but still underperform on domain-specific tasks. Google Translate has improved Bengali support but remains unreliable for technical and medical content.',
      whatHasBeenTried: 'Transfer learning from multilingual models like mBERT and XLM-R has shown partial success. Bengali-specific tokenizers have been developed. However, lack of high-quality labeled datasets remains the core bottleneck. Crowdsourcing efforts have been inconsistent in quality.',
      coverImageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400',
      urgencyLevel: 'critical',
      country: 'Bangladesh',
      isActive: true,
    }
  })

  await prisma.problems.upsert({
    where: { id: 'problem-002' },
    update: {},
    create: {
      id: 'problem-002',
      subfieldId: climateSubfield.id,
      title: 'Coastal erosion threatening 20 million Bangladeshis',
      description: 'Rising sea levels and increased cyclone intensity are accelerating coastal erosion, threatening displacement of millions.',
      detailedContent: `Bangladesh sits at the confluence of three major river systems and has one of the world's largest river deltas. This geography makes the country extraordinarily vulnerable to sea level rise. The Bay of Bengal has risen approximately 6-8mm per year over the past two decades — nearly double the global average.

The Sundarbans mangrove forest, which acts as a natural barrier against cyclones and storm surges, has lost over 40% of its area in the last 40 years. Island chars that house hundreds of thousands of people are disappearing at a rate of 10-15 square kilometers per year.

Climate models project that by 2050, 17% of Bangladesh's land area could be permanently submerged, displacing an estimated 20 million people. This would represent one of the largest climate-driven displacement events in human history, creating massive strain on urban centers and neighboring countries.`,
      impact: '20 million people at risk of displacement by 2050. Loss of agricultural land, freshwater sources, and fisheries that millions depend on for survival. Potential for massive climate refugee crisis.',
      currentProgress: 'Embankment projects funded by the World Bank have protected some coastal areas. Mangrove replanting programs are underway in the Sundarbans. Early warning systems for cyclones have significantly reduced mortality. However, long-term solutions remain underfunded.',
      whatHasBeenTried: 'Concrete embankments have failed repeatedly against storm surges. Floating garden techniques have been adopted in flood-prone areas. Community relocation programs have faced resistance. International climate funds have been slow to deploy.',
      coverImageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400',
      urgencyLevel: 'critical',
      country: 'Bangladesh',
      isActive: true,
    }
  })

  await prisma.problems.upsert({
    where: { id: 'problem-003' },
    update: {},
    create: {
      id: 'problem-003',
      subfieldId: cropSubfield.id,
      title: 'Rice yield stagnation in high-temperature regions',
      description: 'Rice yields have plateaued due to increasing temperatures during critical growth periods, threatening food security.',
      detailedContent: `Rice is the staple food of Bangladesh, consumed by virtually the entire population and grown on over 11 million hectares of farmland. Bangladesh has achieved remarkable progress in rice production over the past 50 years through Green Revolution technologies. However, yields have stagnated over the past decade.

The primary cause is temperature stress. Rice is highly sensitive to temperature during the flowering stage. When temperatures exceed 35°C during anthesis, pollen viability drops sharply, leading to spikelet sterility and yield loss. Bangladesh's average temperatures during the Boro rice season have increased by 0.5-1°C over the past two decades.

Current projections suggest that without intervention, rice yields could decline by 10-15% by 2030 and up to 30% by 2050 under moderate climate change scenarios. For a country where rice accounts for 70% of caloric intake, this poses a severe food security threat.`,
      impact: 'Threatens food security for 170 million people. Rice farming is the primary livelihood for 40% of Bangladesh\'s workforce. Yield decline would increase food import dependency and drive rural poverty.',
      currentProgress: 'BRRI (Bangladesh Rice Research Institute) has developed some heat-tolerant varieties. IRRI is collaborating on speed breeding programs. Some farmers have adopted early transplanting to avoid peak heat periods.',
      whatHasBeenTried: 'Introduction of short-duration varieties to shift harvest before peak temperatures. Supplemental irrigation to cool crop microclimate. Shade netting in small-scale trials. Results have been promising but adoption remains low due to cost.',
      coverImageUrl: 'https://images.unsplash.com/photo-1536054575926-fbf4e9a3ba75?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1536054575926-fbf4e9a3ba75?w=400',
      urgencyLevel: 'moderate',
      country: 'Bangladesh',
      isActive: true,
    }
  })

  await prisma.problems.upsert({
    where: { id: 'problem-004' },
    update: {},
    create: {
      id: 'problem-004',
      subfieldId: mlSubfield.id,
      title: 'Lack of medical imaging AI for South Asian populations',
      description: 'Medical imaging AI models trained on Western data underperform for South Asian patients, leading to misdiagnoses.',
      detailedContent: `Artificial intelligence has shown remarkable promise in medical imaging — detecting cancer from X-rays, identifying diabetic retinopathy from eye scans, and spotting tuberculosis from chest CTs with accuracy matching or exceeding human radiologists. However, virtually all of these models were trained predominantly on data from Western populations.

South Asian patients have distinct physiological characteristics — different bone density distributions, different fat distribution patterns, different prevalence of specific conditions — that cause Western-trained models to perform poorly. Studies have shown that AI models trained on Western chest X-ray datasets miss tuberculosis lesions in South Asian patients at significantly higher rates.

Bangladesh has a severe shortage of radiologists — approximately 1 radiologist per 100,000 people compared to 10 per 100,000 in developed countries. AI-assisted diagnosis could be transformative in closing this gap, but only if the models are trained on representative data.`,
      impact: 'Affects diagnostic accuracy for 1.8 billion South Asians. In Bangladesh specifically, AI misdiagnosis compounds an existing shortage of 15,000 radiologists. Conditions like tuberculosis, which kills 80,000 Bangladeshis annually, are particularly affected.',
      currentProgress: 'Some local hospitals have begun digitizing medical records. A few research groups at BUET and BSMMU are working on Bengali medical datasets. The government has announced a digital health initiative but implementation is early stage.',
      whatHasBeenTried: 'Fine-tuning Western models on small local datasets has shown marginal improvement. Federated learning approaches to aggregate data across hospitals without sharing patient records are being explored. Data collection drives face privacy regulation challenges.',
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      urgencyLevel: 'critical',
      country: 'Bangladesh',
      isActive: true,
    }
  })

  await prisma.problems.upsert({
    where: { id: 'problem-005' },
    update: {},
    create: {
      id: 'problem-005',
      subfieldId: climateSubfield.id,
      title: 'Groundwater arsenic contamination in rural Bangladesh',
      description: 'Over 20 million people are exposed to arsenic levels exceeding safe limits, with no scalable village-level solution.',
      detailedContent: `Bangladesh's arsenic crisis is one of the largest mass poisoning events in human history. During the 1970s and 1980s, millions of tube wells were installed across rural Bangladesh to provide clean drinking water and reduce deaths from waterborne diseases like cholera. The program was enormously successful at reducing infectious disease mortality.

However, it was later discovered that the shallow aquifers tapped by these tube wells contain naturally occurring arsenic at concentrations far exceeding WHO safe limits of 10 micrograms per liter. An estimated 20-35 million people drink water with arsenic levels above this threshold daily.

Chronic arsenic exposure causes keratosis, blackfoot disease, cancers of the skin, lung, and bladder, cardiovascular disease, and neurological damage. Children exposed to arsenic show measurable reductions in cognitive function. The health burden is enormous and largely invisible because symptoms develop over years of exposure.`,
      impact: '20-35 million people chronically exposed. Leading cause of preventable cancer in rural Bangladesh. Cognitive impairment in exposed children affects educational outcomes for entire communities. Healthcare costs from arsenic-related diseases strain the public health system.',
      currentProgress: 'Arsenic-safe deep tube wells have been installed in some areas. Household filtration using iron oxide media has shown effectiveness in trials. Rainwater harvesting promoted in some NGO programs. However, coverage remains far below need.',
      whatHasBeenTried: 'Sand filtration, chemical precipitation, and reverse osmosis have all been tested. Community-level treatment plants have failed due to maintenance challenges. Social interventions to change water-fetching behavior have had limited success. Cost remains the primary barrier to scaling any solution.',
      coverImageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400',
      urgencyLevel: 'moderate',
      country: 'Bangladesh',
      isActive: true,
    }
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