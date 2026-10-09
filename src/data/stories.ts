export interface StoryStep {
  id: string;
  stepNumber: number;
  badge: string;
  headline: string;
  body: string;
  dataCallout: {
    label: string;
    value: string;
    change?: string;
  };
  chartState: {
    highlightYear?: number | string;
    focusMetric: string;
    viewMode: 'trend' | 'breakdown' | 'impact';
  };
}

export interface DataStory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  category: string;
  readTime: string;
  listenTimeSeconds: number;
  author: string;
  date: string;
  leadParagraph: string;
  steps: StoryStep[];
  chartData: {
    labels: string[];
    primarySeries: number[];
    secondarySeries?: number[];
    primaryLabel: string;
    secondaryLabel?: string;
    unit: string;
    threshold?: number;
    breakdownCategories?: {
      category: string;
      value: number;
      delta: string;
    }[];
  };
}

export const DATA_STORIES: DataStory[] = [
  {
    id: "story-inflation",
    slug: "inflation-decade",
    title: "The Decade That Shrank the Dollar: 2016–2026",
    subtitle: "Tracking the 10-year macroeconomic shockwave that permanently altered purchasing power, supply chains, and living standards.",
    coverImage: "/src/assets/images/inflation_macro_economy_1791519956685.jpg",
    category: "Macroeconomics",
    readTime: "6 min read",
    listenTimeSeconds: 340,
    author: "Elena Rostova & Dispatch Data Unit",
    date: "October 8, 2026",
    leadParagraph: "Over the past decade, the global economy moved from a world of near-zero interest rates and negligible consumer price growth to the most violent inflationary spike in four decades. While headline numbers have now receded to the 2.4% range, the cumulative compound effect has left average living expenses 24% higher than in 2016.",
    steps: [
      {
        id: "inf-1",
        stepNumber: 1,
        badge: "2016–2019",
        headline: "The Decade of Dormant Prices",
        body: "From 2016 through 2019, inflation hovered reliably between 1.3% and 2.4%. Central bankers frequently fretted over prices being *too low*, fearing deflationary stagnation. Global supply chains operated on ultra-lean 'just-in-time' schedules, keeping manufactured goods remarkably affordable.",
        dataCallout: {
          label: "Average Annual CPI",
          value: "1.8%",
          change: "Stable baseline"
        },
        chartState: {
          highlightYear: "2018",
          focusMetric: "baseline",
          viewMode: "trend"
        }
      },
      {
        id: "inf-2",
        stepNumber: 2,
        badge: "2020–2021",
        headline: "The Supply Chain Fracture & Liquidity Injection",
        body: "When pandemic lockdowns grounded international freight and shuttered microchip fabs, consumer spending rapidly shifted from experiences to physical goods. Massive fiscal stimulus coincided with shipping container freight rates leaping by over 500%. By December 2021, headline inflation accelerated to 7.0%.",
        dataCallout: {
          label: "Container Freight Rate",
          value: "$10,380 / FEU",
          change: "+512% vs 2019"
        },
        chartState: {
          highlightYear: "2021",
          focusMetric: "acceleration",
          viewMode: "trend"
        }
      },
      {
        id: "inf-3",
        stepNumber: 3,
        badge: "June 2022",
        headline: "The 40-Year Apex: 9.1% Headline CPI",
        body: "Geopolitical tensions in Eastern Europe disrupted international wheat, fertilizer, and crude oil markets. In June 2022, United States and European inflation peaked at 9.1% and 10.6% respectively. Grocery staples surged 12.2% year-over-year, and gasoline averaged above $5.00 per gallon, sparking immediate consumer distress.",
        dataCallout: {
          label: "Peak CPI Inflation",
          value: "9.1%",
          change: "40-year historical high"
        },
        chartState: {
          highlightYear: "2022",
          focusMetric: "peak",
          viewMode: "breakdown"
        }
      },
      {
        id: "inf-4",
        stepNumber: 4,
        badge: "2023–2024",
        headline: "The Most Aggressive Rate Hikes in Modern Memory",
        body: "The Federal Reserve and European Central Bank enacted rapid 525-basis-point rate increases within 16 months. Commercial borrowing costs and 30-year mortgage rates surged above 7.5%, cooling industrial investments and manufacturing orders while housing transactions froze.",
        dataCallout: {
          label: "Central Bank Terminal Rate",
          value: "5.50%",
          change: "+525 bps in 16 mos"
        },
        chartState: {
          highlightYear: "2024",
          focusMetric: "tightening",
          viewMode: "trend"
        }
      },
      {
        id: "inf-5",
        stepNumber: 5,
        badge: "2025–2026",
        headline: "The New Plateau: Rates Ease, But the Price Level Stays",
        body: "By 2026, headline CPI settled near 2.3%, but disinflation is not deflation. Prices did not fall back to 2016 levels; they merely stopped rising as fast. A basket of essentials that cost $100 in 2016 requires $123.80 today, permanently altering wage dynamics and retirement projections.",
        dataCallout: {
          label: "10-Year Cumulative Price Rise",
          value: "+23.8%",
          change: "$100 in 2016 = $123.80 today"
        },
        chartState: {
          highlightYear: "2026",
          focusMetric: "plateau",
          viewMode: "impact"
        }
      }
    ],
    chartData: {
      labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
      primarySeries: [1.3, 2.1, 2.4, 1.8, 1.2, 4.7, 9.1, 4.1, 3.1, 2.5, 2.3],
      secondarySeries: [1.8, 2.0, 2.1, 1.9, 1.7, 3.6, 6.2, 4.8, 3.3, 2.7, 2.4],
      primaryLabel: "Headline CPI YoY (%)",
      secondaryLabel: "Core CPI (ex Food & Energy) (%)",
      unit: "%",
      threshold: 2.0,
      breakdownCategories: [
        { category: "Food & Groceries", value: 31.4, delta: "+31.4% since 2016" },
        { category: "Shelter & Rent", value: 29.8, delta: "+29.8% since 2016" },
        { category: "Electricity & Gas", value: 27.2, delta: "+27.2% since 2016" },
        { category: "Transportation", value: 24.1, delta: "+24.1% since 2016" },
        { category: "Consumer Tech", value: -14.6, delta: "-14.6% (hedonic adjustment)" }
      ]
    }
  },
  {
    id: "story-climate",
    slug: "climate-1-5-c-threshold",
    title: "Breaching 1.5°C: The Anatomy of Planetary Heat",
    subtitle: "How ocean thermal inertia, greenhouse gas accumulation, and atmospheric feedback loops pushed Earth past critical thresholds.",
    coverImage: "/src/assets/images/climate_antarctic_research_1791519968000.jpg",
    category: "Earth Systems",
    readTime: "7 min read",
    listenTimeSeconds: 380,
    author: "Dr. Marcus Vance & Glacial Data Initiative",
    date: "October 7, 2026",
    leadParagraph: "For decades, international treaties framed 1.5°C above pre-industrial levels as an essential guardrail against irreversible climatic tipping cascades. By 2024 and 2025, twelve consecutive months exceeded that threshold for the first time in human history. Here is how heat distributed through oceans, atmosphere, and polar ice.",
    steps: [
      {
        id: "cli-1",
        stepNumber: 1,
        badge: "1970–1990",
        headline: "The Early Signal: Decadal Baselines",
        body: "Between 1970 and 1990, scientific consensus crystallized around greenhouse gas radiative forcing. Temperature anomalies steadily climbed from +0.10°C to +0.35°C above the 1850–1900 pre-industrial benchmark. Marine heat absorption shielded continental land masses from the steepest immediate jumps.",
        dataCallout: {
          label: "1980 Decadal Anomaly",
          value: "+0.27°C",
          change: "Emerging trend"
        },
        chartState: {
          highlightYear: "1980",
          focusMetric: "early",
          viewMode: "trend"
        }
      },
      {
        id: "cli-2",
        stepNumber: 2,
        badge: "2000–2015",
        headline: "The Arctic Amplification Paradox",
        body: "As reflective sea ice melted, dark open ocean water absorbed 90% of incoming solar radiation rather than reflecting it. The Arctic began warming at nearly four times the global rate, weakening the circumpolar jet stream and generating prolonged weather blockages in mid-latitudes.",
        dataCallout: {
          label: "Arctic Warming Rate",
          value: "3.8x",
          change: "vs Global Average"
        },
        chartState: {
          highlightYear: "2010",
          focusMetric: "amplification",
          viewMode: "trend"
        }
      },
      {
        id: "cli-3",
        stepNumber: 3,
        badge: "2016–2022",
        headline: "The Hottest Run in Recorded History",
        body: "Every single year between 2016 and 2022 ranked among the eight warmest years on instrumental record. Continental heatwaves broke all-time high records across Western Europe, South Asia, and the Pacific Northwest, with temperatures reaching 49.6°C (121°F) in British Columbia.",
        dataCallout: {
          label: "Pre-industrial Delta (2020)",
          value: "+1.25°C",
          change: "Approaching guardrail"
        },
        chartState: {
          highlightYear: "2020",
          focusMetric: "record",
          viewMode: "trend"
        }
      },
      {
        id: "cli-4",
        stepNumber: 4,
        badge: "2023–2024",
        headline: "The 1.5°C Breach & Sea Surface Anomalies",
        body: "In 2023–2024, an intense El Niño phase interacted with unprecedented North Atlantic sea surface temperatures, sending average global daily anomalies above +2.0°C on individual dates in November 2023. Over the full 12-month period, global temperatures averaged +1.52°C above pre-industrial levels.",
        dataCallout: {
          label: "12-Month Rolling Mean",
          value: "+1.52°C",
          change: "First full year past 1.5°C"
        },
        chartState: {
          highlightYear: "2024",
          focusMetric: "breach",
          viewMode: "breakdown"
        }
      },
      {
        id: "cli-5",
        stepNumber: 5,
        badge: "2025–2026",
        headline: "The Ocean Heat Sink: 310 Zettajoules Accumulated",
        body: "Ninety percent of planetary energy imbalance is absorbed by the world's oceans. Upper ocean heat content reached 310 Zettajoules above the 1980 baseline. This colossal thermal mass continues melting Antarctic grounding lines and driving tropical storm intensification regardless of short-term weather fluctuations.",
        dataCallout: {
          label: "Ocean Heat Content",
          value: "310 ZJ",
          change: "Equivalent to 5 Hiroshima bombs/sec"
        },
        chartState: {
          highlightYear: "2026",
          focusMetric: "ocean",
          viewMode: "impact"
        }
      }
    ],
    chartData: {
      labels: ["1970", "1980", "1990", "2000", "2010", "2015", "2020", "2023", "2024", "2025", "2026"],
      primarySeries: [0.12, 0.27, 0.44, 0.62, 0.88, 1.05, 1.25, 1.48, 1.54, 1.51, 1.49],
      secondarySeries: [0.18, 0.38, 0.65, 0.94, 1.35, 1.62, 1.95, 2.30, 2.45, 2.38, 2.32],
      primaryLabel: "Global Mean Surface Anomaly (°C)",
      secondaryLabel: "Land-Only Mean Anomaly (°C)",
      unit: "°C",
      threshold: 1.5,
      breakdownCategories: [
        { category: "Arctic Region (>66°N)", value: 3.8, delta: "+3.8°C above baseline" },
        { category: "Europe & Mediterranean", value: 2.3, delta: "+2.3°C above baseline" },
        { category: "North America Land", value: 1.9, delta: "+1.9°C above baseline" },
        { category: "Asia Continental", value: 1.8, delta: "+1.8°C above baseline" },
        { category: "Global Ocean Surface", value: 1.1, delta: "+1.1°C (massive thermal inertia)" }
      ]
    }
  }
];
