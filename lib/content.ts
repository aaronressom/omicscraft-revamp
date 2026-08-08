/**
 * Single source of truth for all site copy.
 *
 * ---------------------------------------------------------------------------
 * EDITING RULES
 * ---------------------------------------------------------------------------
 * Fields marked `@verbatim` are migrated word-for-word from omicscraft.com and
 * describe the scientific capabilities of the platform. DO NOT reword, trim,
 * summarize, or "improve" them. Only the company can change a scientific claim.
 *
 * The ONLY edits applied during migration were four spelling corrections:
 *   1. "imaging data aanalysis"  -> "imaging data analysis"     (home card)
 *   2. "many years of exertise"  -> "many years of expertise"   (about)
 *   3. "image segementation"     -> "image segmentation"        (ImgCraft)
 *   4. ImgCraft listed "feature extraction" twice; the second instance is
 *      rendered as "quantitative analysis". THIS ONE IS A GUESS - it is
 *      flagged for the client to confirm, since only they know the intent.
 *
 * Headlines, eyebrows, and section titles are NOT verbatim - those were
 * rewritten by agreement. They carry no scientific claims.
 */

export const SITE = {
  name: "OmicsCraft",
  legalName: "OmicsCraft LLC",
  tagline: "AI-powered multi-omics biomarker discovery",
  description:
    "OmicsCraft provides AI-powered software tools and expert bioinformatics services to biomedical researchers to accelerate disease biomarker discovery.",
  url: "https://www.omicscraft.com",
  email: "info@omicscraft.com",
  phone: "202-709-5383",
  phoneHref: "tel:+12027095383",
  address: {
    street: "1305 30th St NW #105",
    city: "Washington",
    region: "DC",
    postalCode: "20007",
    full: "1305 30th St NW #105, Washington, DC 20007",
  },
  /** Google Maps place query - used by the click-to-load embed. */
  mapQuery: "OmicsCraft LLC, 1305 30th St NW %23105, Washington, DC 20007",
  copyrightYear: 2026,
  /**
   * All three supplied by the client. KEY ORDER IS RENDER ORDER — the footer
   * and the news card both iterate this object, so LinkedIn stays first.
   *
   * `twitter` keeps its key: it is what `SOCIAL_MARKS` and `SOCIAL_LABELS` in
   * social-marks.tsx are keyed on, and the label there already renders it as
   * "X". Setting any of these back to null removes the icon everywhere with no
   * component change.
   */
  social: {
    linkedin: "https://www.linkedin.com/company/omicscraft/" as string | null,
    twitter: "https://x.com/omicscraft" as string | null,
    facebook: "https://www.facebook.com/OmicsCraft" as string | null,
  },
} as const;

/**
 * Top navigation.
 *
 * NO CONTACT ENTRY — that is the header's "Get in touch" button, which is
 * bigger, is the only filled element up there, and points at the same page.
 * Listing it twice split the emphasis between them. /contact is still a real
 * route and still linked from the hero's secondary CTA; it just is not in this
 * list. Anything added here appears in both the desktop nav and the mobile
 * drawer.
 */
export const NAV = [
  { label: "Software Platform", href: "/platform" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
] as const;

/* -------------------------------------------------------------------------- */
/* Hero - REWRITTEN (no scientific claims)                                    */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: "NIH & NSF SBIR-funded",
  headline: "From raw metabolomics data to biomarker discovery",
  subhead:
    "AI-powered bioinformatics tools and expert services that compress the path from data acquisition to discovery.",
  primaryCta: { label: "Explore aiSysMet", href: "/platform" },
  secondaryCta: { label: "Talk to our team", href: "/contact" },
} as const;

/**
 * Home hero carousel — slide 1 is HERO above; slides 2-7 follow.
 *
 * COPY IS THE CLIENT'S, VERBATIM. Every headline and subhead below is taken
 * word for word from the slider on the live omicscraft.com, as supplied. Do not
 * reword them: they describe what the company does, and the wording was chosen
 * by the company.
 *
 * The images are the client's own slider backgrounds, at their native 1920x730.
 *
 * CONTRAST. Three of these photographs are very light — the compound-ID bench,
 * the monitors, and the test tubes are all close to white in places. The
 * original omicscraft.com dealt with that per slide, tinting the type dark on
 * pale images and light on dark ones, and it is exactly what produced the
 * failing headline the rebuild was commissioned to fix. So every slide here
 * carries the same measured dark scrim instead and the type is always white —
 * see the note in `hero-carousel.tsx`. Adding a slide means adding an image
 * that the existing scrim can carry, not tuning the scrim to the image.
 */
export const SLIDES = [
  {
    id: "interdisciplinary-solutions",
    headline: "Interdisciplinary Solutions to Omics",
    subhead: "Apply innovative strategies for omics data analysis",
    image: "/slides/01-interdisciplinary-solutions.jpg",
  },
  {
    id: "compound-identification",
    headline: "Compound Identification",
    subhead: "Use AI-powered tools for metabolite annotation",
    image: "/slides/02-compound-identification.jpg",
  },
  {
    id: "multi-omics-integration",
    headline: "Multi-Omics Data Integration",
    subhead: "Perform multi-omics data integration for biomarker discovery",
    image: "/slides/03-multi-omics-integration.jpg",
  },
  {
    id: "data-analytic-pipelines",
    headline: "Data Analytic Pipelines",
    subhead: "Build data analytic pipelines via a cloud-based platform",
    image: "/slides/04-data-analytic-pipelines.jpg",
  },
  {
    id: "interdisciplinary-team",
    headline: "Interdisciplinary Team",
    subhead: "Interact with experts in omics, medical images, and data science",
    image: "/slides/05-interdisciplinary-team.jpg",
  },
  {
    id: "consulting-services",
    headline: "Consulting Services",
    subhead:
      "Experience end-to-end support from experimental design to technological insights",
    image: "/slides/06-consulting-services.jpg",
  },
] as const;

/** Stages rendered by the animated pipeline diagram. */
export const PIPELINE_STAGES = [
  { label: "Raw Data", detail: "LC-MS/MS" },
  /* "Peak Detection" matches the shipping product: the live aiSysMet app lists
     MetCraft's functions as Peak Detection and Batch Correction. */
  { label: "Processing", detail: "Peak Detection · batch correction" },
  { label: "Annotation", detail: "Spectral matching · deep learning" },
  { label: "Integration", detail: "Multi-omics + imaging" },
  { label: "Biomarkers", detail: "Ranked candidates" },
] as const;

/* -------------------------------------------------------------------------- */
/* Trust band - VERIFIABLE FACTS ONLY. No invented figures.                    */
/* Every number below is derived from the projects and platform listed on the  */
/* company's own site. If a fact cannot be sourced there, it does not belong.  */
/* -------------------------------------------------------------------------- */

/**
 * Two boxes only, under the "SBIR-Funded Projects" heading rendered by
 * `trust-band.tsx`. The former "6 Federally funded SBIR projects" total is now
 * carried by that heading, and the "4 Integrated platform tools" box was
 * dropped at the client's request.
 */
export const TRUST_STATS = [
  { value: "2", label: "Phase II SBIR Awards" },
  { value: "4", label: "Phase I SBIR Awards" },
] as const;

export const TRUST_DATA_SOURCES = ["TCGA", "CPTAC", "TCIA", "CRDC"] as const;

/** Official agency artwork, recovered from the company's own Wix CDN. */
export const FUNDERS = [
  {
    name: "National Institutes of Health — SBIR/STTR",
    short: "NIH",
    logo: "/logos/nih-sbir.jpg",
  },
  {
    name: "National Science Foundation",
    short: "NSF",
    logo: "/logos/nsf.jpg",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Home motto band                                                            */
/* -------------------------------------------------------------------------- */

export const MOTTO = {
  /**
   * CLIENT-DIRECTED CLAIM — kept verbatim at their explicit instruction.
   *
   * "months to days" is a quantitative performance claim. It is NOT currently
   * substantiated: the company's own Bioinformatics paper (42(7), btag520)
   * lists "quantitative benchmarking of runtime, memory usage, metabolite
   * annotation accuracy, and scalability" as FUTURE work, and the verbatim
   * About copy says only "reduce the time and cost" with no magnitude.
   *
   * The client was shown this and chose to publish it as written. Do not treat
   * this string as verified copy or reuse the figure elsewhere on the site.
   */
  headline: "Reduce biomarker discovery time from months to days!",
  /**
   * Mission, Value and Product — @verbatim from the client's own slide,
   * supplied 6 Aug 2026 as an image and transcribed exactly, including the
   * missing full stops on Value and Product and the ampersand in "platform &
   * service". Do not tidy the punctuation: it is the company's statement of
   * what it is, not copy written for this site.
   *
   * Rendered as the three feeds converging on the aim below them — see
   * `motto-band.tsx`. Adding a fourth entry changes that diagram's geometry;
   * the connector is built for three.
   */
  pillars: [
    {
      id: "mission",
      label: "Mission",
      body: "Become the leading AI platform for quick and cost-effective biomarker discovery.",
    },
    {
      id: "value",
      label: "Value",
      body: "Accelerate the time from data acquisition to biomarker discovery",
    },
    {
      id: "product",
      label: "Product",
      body: "AI-powered platform & service for biomedical data analytics",
    },
  ],
  /**
   * Decorative only — never captioned as OmicsCraft's own lab or staff.
   *
   * THE PNG IS THE SOURCE, DELIBERATELY. This was briefly re-encoded to JPEG to
   * save ~450KB, which stacked a second round of lossy compression on top of
   * whatever the original already carried and showed as mush in the plaque.
   * Next re-encodes to WebP/AVIF at serve time anyway, so the extra bytes never
   * reach a browser and starting from a lossless master is strictly better.
   *
   * HARD CEILING: the client's original is only 537x310. The plaque caps its
   * photo cell to stay near that, but on a 2x display some upscaling is
   * unavoidable. A higher-resolution original dropped in at this path fixes it
   * with no code change.
   */
  image: "/img/lab-bench.png",
} as const;

/* -------------------------------------------------------------------------- */
/* Home summary cards - descriptions @verbatim                                 */
/* -------------------------------------------------------------------------- */

export const HOME_CARDS = [
  {
    title: "Services",
    href: "/services",
    /** @verbatim (fixed: "aanalysis" -> "analysis") */
    body: "We provide consulting services on omics study design, data acquisition, data analysis, multi-omics integration, imaging data analysis, and biological interpretation of results. In addition, we offer customers access to customized data analysis pipeline and a sample-to-solution service.",
  },
  {
    title: "Products",
    href: "/platform",
    /** @verbatim */
    body: "We offer our clients a cloud-based platform that allows them to build data analysis pipelines for omics and imaging data processing, mass spectrometric-based metabolite annotation, and multi-omics and imaging data integration.",
  },
  {
    title: "Projects",
    href: "/projects",
    /** @verbatim */
    body: "We work on systems metabolomics and multi-omics projects aimed at identifying disease biomarkers and to unravel the associations between analytes and diseases using innovative machine learning and AI models including large language models (LLMs).",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* About - all @verbatim                                                       */
/* -------------------------------------------------------------------------- */

export const ABOUT = {
  company: {
    label: "Company",
    /** @verbatim */
    body: "OmicsCraft is a company focused on providing AI-powered software tools and expert bioinformatics services to biomedical researchers to accelerate disease biomarker discovery.",
  },
  product: {
    label: "Product",
    /** @verbatim - "aiSysMet" is linked to /platform at render time. */
    body: "Our cloud-based platform, aiSysMet, enables our customers to build data analytic pipelines for omics data processing, metabolite annotation, and integrative analysis of multi-omics and biomedical imaging data, providing them with fast, accurate, and scalable solutions for biomarker discovery.",
  },
  whoWeAre: {
    label: "Who We Are",
    /** @verbatim (fixed: "exertise" -> "expertise") */
    body: "We are an interdisciplinary team of bioinformaticians, engineers, and data scientists with many years of expertise in multi-omics, imaging, and AI/ML including large language models (LLMs). Our goal is to reduce the time and cost from raw omics and medical imaging data acquisition to validated biomarkers.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Team - every bio @verbatim                                                  */
/* -------------------------------------------------------------------------- */

export type TeamMember = {
  name: string;
  credential: string;
  role: string;
  bio: string;
  photo: string;
  featured?: boolean;
};

export const TEAM: TeamMember[] = [
  {
    name: "Habtom Ressom",
    credential: "PhD",
    role: "Founder & CEO",
    photo: "/team/ressom.jpg",
    featured: true,
    /** @verbatim */
    bio: "Dr. Ressom has many years of experience in developing workflows and computational methods for large-scale omics studies. His research interests include identification of biomarkers, aberrant pathways, and network activities in complex diseases such as cancer using omics technologies.",
  },
  {
    name: "Dawit Mengistu",
    credential: "PhD",
    role: "Principal Investigator",
    photo: "/team/mengistu.jpg",
    featured: true,
    /** @verbatim */
    bio: "Dr. Mengistu's research interests include bioinformatics and applications of deep learning for big data analysis. He has many years of experience in software development. He also has significant expertise in performance analysis and optimization in resource-constrained computational environments.",
  },
  {
    name: "Bardia Nezami",
    credential: "PhD",
    role: "Bioinformatics Lead",
    photo: "/team/nezami.jpg",
    /** @verbatim */
    bio: "Dr. Nezami has extensive experience in the design and development of computational methods for omics data analysis. This experience has provided him a broad range of skills in the genomics, metabolomics, and proteomics fields and a deep understanding of the challenges in systems biology research.",
  },
  {
    name: "Sara Hashemi",
    credential: "PhD",
    role: "Computational Scientist",
    photo: "/team/hashemi.jpg",
    /** @verbatim */
    bio: "Dr. Hashemi's expertise and research interest lie in applying AI-powered computational methods for medical image analysis and integration of multi-omics and imaging data. She has been conducting research in the intersection of AI and biomedical data for over a decade.",
  },
  {
    name: "Linge Yan",
    credential: "MS",
    role: "Software Developer",
    photo: "/team/yan.jpg",
    /** @verbatim */
    bio: "Mr. Yan holds an MS degree in Computer Science from George Washington University. He is a highly experienced software developer and an expert in JavaScript, Python, and cloud-based tools.",
  },
  {
    name: "Hongyu Ao",
    credential: "MS",
    role: "Data Scientist",
    photo: "/team/ao.jpg",
    /** @verbatim */
    bio: "Mr. Ao holds an M.Sc. degree in Mathematics and Statistics from Georgetown University and a B.Sc. (Hons) from the University of Toronto. He is adept in data science and software development. Proficient in languages such as Python and JavaScript, and tools such as React and AWS.",
  },
  {
    name: "Xinran Zhang",
    credential: "MS",
    role: "Data Scientist",
    photo: "/team/zhang.jpg",
    /** @verbatim */
    bio: "Ms. Zhang received MS degree in Data Science & Analytics from Georgetown University. Her key area of interest lies in leveraging the power of AI for metabolite annotation, multi-omics integration, and image analysis.",
  },
];

/* -------------------------------------------------------------------------- */
/* Services - every description @verbatim                                      */
/* -------------------------------------------------------------------------- */

export type Service = {
  title: string;
  body: string;
  icon: string;
};

export const SERVICES: Service[] = [
  {
    title: "Consulting",
    icon: "Handshake",
    /** @verbatim */
    body: "Offer clients customized application of our data analysis pipelines",
  },
  {
    title: "Study Design",
    icon: "FlaskConical",
    /** @verbatim */
    body: "Assist in experimental design to carry out a successful omics study",
  },
  {
    title: "Biological Insight",
    icon: "Microscope",
    /** @verbatim */
    body: "Help with biological interpretation of results from omics studies",
  },
  {
    title: "Metabolite Annotation",
    icon: "Atom",
    /** @verbatim */
    body: "Perform metabolite annotation by spectral matching and deep learning-based computational methods",
  },
  {
    title: "Metabolomics Data Analysis",
    icon: "ChartSpline",
    /** @verbatim */
    body: "Use AI-enabled data analysis pipelines for mass spectrometry-based metabolomics data processing",
  },
  {
    title: "Multi-Omics Integration",
    icon: "Layers",
    /** @verbatim */
    body: "Offer scalable solutions for integration of multi-omics and imaging data using AI/ML methods",
  },
];

/* -------------------------------------------------------------------------- */
/* Platform                                                                    */
/*                                                                             */
/* SCOPE: this site does NOT host or implement these products. They run on     */
/* AWS and are owned by a separate team. Each entry here is presentational     */
/* only; `href` is an outbound link.                                           */
/*                                                                             */
/* TODO(client): supply the AWS URLs. A null href renders a non-interactive    */
/* "Coming soon" tile rather than a dead link - no component changes needed.   */
/* -------------------------------------------------------------------------- */

export type Product = {
  id: string;
  name: string;
  blurb: string;
  icon: string;
  logo: string;
  /** Outbound AWS URL, or null until provided. */
  href: string | null;
};

export const PLATFORM = {
  name: "aiSysMet",
  logo: "/logos/aisysmet.png",
  /** Live application, supplied by the client and verified running at v1.50. */
  href: "https://tools.omicscraft.com/aiSysMet/" as string | null,
  /** @verbatim */
  blurb:
    "aiSysMet is an AI-powered data analytics platform that consists of a suite of tools (MetCraft, MetaboQuest, ImgCraft, and IntSys) for biomarker discovery by enabling systems metabolomics and integrative analysis of multi-omics and imaging data.",
} as const;

export const PRODUCTS: Product[] = [
  {
    id: "metcraft",
    name: "MetCraft",
    icon: "Workflow",
    logo: "/logos/metcraft.png",
    href: null,
    /** @verbatim */
    blurb:
      "MetCraft converts raw metabolomics data for annotation and quantitative analysis. It also performs omics data processing including normalization, missing value imputation, batch correction, etc.",
  },
  {
    id: "metaboquest",
    name: "MetaboQuest",
    icon: "Search",
    logo: "/logos/metaboquest.png",
    href: null,
    /** @verbatim */
    blurb:
      "MetaboQuest uses databases for metabolite annotation by mass-based search and spectral matching. It also applies deep learning models for ranking putative metabolite candidates based on mass spectrometric data.",
  },
  {
    id: "imgcraft",
    name: "ImgCraft",
    icon: "ScanEye",
    logo: "/logos/imgcraft.jpg",
    href: null,
    /**
     * @verbatim (fixed: "segementation" -> "segmentation")
     * The source sentence ended "...feature extraction, and feature
     * extraction." The duplicate now reads "quantitative analysis" -
     * CONFIRMED BY CLIENT as the official copy. Treat as verbatim from here.
     */
    blurb:
      "ImgCraft processes raw medical images (whole slide, CT, and MR images). This includes image segmentation, feature extraction, and quantitative analysis.",
  },
  {
    id: "intsys",
    name: "IntSys",
    icon: "Network",
    logo: "/logos/intsys.png",
    href: null,
    /** @verbatim */
    blurb:
      "IntSys performs integrative analysis of multi-omics and imaging data for biomarker selection by using statistical, machine learning, and generative AI methods.",
  },
];

/* -------------------------------------------------------------------------- */
/* Projects - all 6 abstracts @verbatim                                        */
/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  name: string;
  subtitle: string;
  phase: "Phase I" | "Phase II";
  abstract: string;
  /**
   * The award's public record — NIH RePORTER or NSF Award Search, supplied by
   * the client 7 Aug 2026. This is the primary source for every claim on the
   * page: the phase, the abstract and the funder all come from these records,
   * so a reader can check any of them.
   *
   * The AGENCY IS DERIVED FROM THE HOSTNAME at render time rather than stored
   * beside the URL — see `awardSource` in projects-list.tsx. A separate field
   * could disagree with the link it labels, and a link that names the wrong
   * agency is worse than one that names none.
   */
  awardHref: string;
};

export const PROJECTS: Project[] = [
  {
    id: "aisysmet",
    name: "aiSysMet",
    subtitle: "AI-Powered Platform for Integrative Analysis of Multimodal Data",
    phase: "Phase II",
    awardHref:
      "https://reporter.nih.gov/search/pTsIyY4JAkatFqdNVlsDNg/project-details/11196862",
    /** @verbatim */
    abstract:
      "Recent advances in cloud-based resources and technologies for imaging and multi-omics analysis have created new opportunities for exploring relationships between medical images, molecular events, and clinical outcomes using quantitative methods. However, the unprecedented scale and complexity of imaging and multi-omics data have presented critical computational bottlenecks requiring new concepts and enabling tools. The objective of this proposal is to address the computational challenges in integrative analysis of imaging and multi-omics data from The Cancer Genome Atlas (TCGA), Clinical Proteomic Tumor Analysis Consortium (CPTAC), and The Cancer Imaging Archive (TCIA) via an innovative AI-powered, scalable, and cloud-based data analytics platform to fully unlock the potential of the Cancer Research Data Commons (CRDC). This will be accomplished by building a computational framework that integrates novel data analysis algorithms including deep learning into a cloud-based platform for revealing complex relationships between medical images, multi-omics, and phenotypic outcomes. This project not only facilitates the development of new data analysis techniques, but also addresses emerging scientific questions in cancer research via a cloud-based data analytics pipeline that consists of innovative modules interfaced with CRDC. The proposed computational methods and pipeline are expected to impact cancer research and enable investigators to effectively test their scientific hypothesis.",
  },
  {
    id: "metaboquest",
    name: "MetaboQuest",
    subtitle: "A Suite of Tools for Metabolite Annotation",
    phase: "Phase II",
    awardHref:
      "https://reporter.nih.gov/search/kMNicA378EinlzyLdPhgZA/project-details/10395223",
    /** @verbatim */
    abstract:
      "The goal of this Phase II SBIR proposal is to make metabolomics studies on a par with other omics studies such as genomics, transcriptomics, and proteomics, for which well-established pipelines are available. By doing so, we will accelerate the role of metabolomics in systems biology approaches for various applications including biomarker and drug discovery. To achieve this goal, we propose to develop a cloud-based platform that allows customers to build pipelines for analysis of LC-MS-based untargeted metabolomics data, starting from peak detection to metabolite annotation. This will be accomplished by implementing a suite of innovative tools that can be assembled into customized pipelines and by enhancing metabolite annotation accuracy through integration of information derived from multiple resources including compound databases, pathways, biochemical networks, and mass spectral libraries. Successful implementation and validation of MetaboQuest will contribute to addressing the major bottleneck in metabolomics - metabolite identification, thereby eliminating the need for manual verification of putative metabolite IDs and enhancing the contribution of metabolomics studies, specifically in disease biomarker and drug discovery.",
  },
  {
    id: "metcraft",
    name: "MetCraft",
    subtitle: "Pipeline for Analysis of Metabolomics Data",
    phase: "Phase I",
    /* The one NSF award of the six; every other link is NIH RePORTER. */
    awardHref:
      "https://www.nsf.gov/awardsearch/show-award/?AWD_ID=2126918&HistoricalAwards=false",
    /** @verbatim */
    abstract:
      "The broader impact of this Small Business Innovation Research (SBIR) Phase I project is enhancing the role of metabolite (substances used by cells for growth, reproduction and health) analysis in the growing area of systems biology research. This is expected to lead to faster and less expensive biomarker and drug discovery to allow for more accurate, reproducible, and faster clinical trials, and to accelerate basic scientific research into many areas of cellular and system-wide organismal studies. This will have a significant impact on the bottom line for drug companies and for improving health and reducing health care cost. The innovation will provide customers with a platform and expertise that enable them to increase their ability to develop biomarkers and drugs faster by: (1) allowing more metabolites to be involved in the discovery of new relationships between diseases and metabolites, potentially opening up new areas of basic research; (2) selecting disease-associated metabolites on the basis of not only statistically significant changes in metabolite levels but also correlations of interactions among metabolites in diseased vs. healthy cells; and (3) evaluating the relationships between metabolites and diseases through integration of metabolite analysis with other system-wide analytical methods (i.e. gene expression, protein levels, etc.).",
  },
  {
    id: "isysmet",
    name: "iSysMet",
    subtitle:
      "A Cloud-Based Pipeline for Integrative Analysis of Multi-Omics and Imaging Data",
    phase: "Phase I",
    awardHref:
      "https://reporter.nih.gov/search/4sgZv1usDkqZksa6fEQ53w/project-details/10489550",
    /** @verbatim */
    abstract:
      "Recent advances in cloud-based resources and technologies for multi-omics and imaging analysis have created new opportunities for exploring relationships between histology, molecular events, and clinical outcomes using quantitative methods. However, the unprecedented scale and complexity of multi-omics and imaging data have presented critical computational bottlenecks requiring new concepts and enabling tools. The objective of this proposal is to address the computational challenges in integrative analysis of multi-omics and imaging data from The Cancer Genome Atlas (TCGA), Clinical Proteomic Tumor Analysis Consortium (CPTAC), and The Cancer Imaging Archive (TCIA) via an innovative cloud-based data analytics pipeline to fully unlock the potential of the Cancer Research Data Commons (CRDC). This will be accomplished by building a computational framework that integrates novel big data analysis algorithms into a cloud-based pipeline for revealing complex relationships between histopathology images, multi-omics, and phenotypic outcomes. This project not only facilitates the development of new big data analysis techniques, but also addresses emerging scientific questions in cancer research via a cloud-based data analytics pipeline that consists of innovative computational methods for multi-omics and imaging analysis and interfaced with CRDC. The proposed computational methods and pipeline are expected to impact cancer research and enable investigators to effectively test their scientific hypothesis.",
  },
  {
    id: "metabocraft",
    name: "MetaboCraft",
    subtitle: "Tool for Metabolite Identification",
    phase: "Phase I",
    awardHref: "https://reporter.nih.gov/project-details/9622659",
    /** @verbatim */
    abstract:
      "In a typical untargeted metabolomics analysis by liquid chromatography-mass spectrometry (LC-MS), about 70% of the detected ions represent unknown analytes. While identification of the unknowns without putative IDs remains a significant challenge, we have the opportunity to identify more metabolites by improving the ability to prioritize multiple putative IDs assigned to the known-unknowns. This will be tremendously helpful in selecting promising metabolites for the subsequent experimental verification of the IDs. This project seeks to develop a probabilistic framework that assigns a priority score to each putative metabolite ID by combining information from multiple resources including compound databases, pathways, biochemical networks, and spectral libraries. The proposed probabilistic model will exploit the inter-dependent relationships between metabolites in biological organisms based on knowledge derived from pathways and biochemical networks to assign priority score to each putative metabolite IDs. If MS/MS data are available, the score for a putative ID will take into account how well the measured MS/MS matches against those in spectral libraries or fragment patterns predicted by in-silico spectral interpretation. Successful implementation and validation of the model will enable users to accurately identify putative metabolite IDs and assign priority scores by taking advantage of publicly available databases, pathways, and biochemical networks, spectral libraries, as well as various tools designed for isotope/adduct recognition, decomposition of isotopic patterns, and in-silico spectral interpretation.",
  },
  {
    id: "sysmet",
    name: "SysMet",
    subtitle: "Integrative Systems Metabolomics",
    phase: "Phase I",
    /**
     * SUPPLIED AS A LEGACY URL, and left exactly as supplied.
     * `projectreporter.nih.gov/project_info_description.cfm` is the retired
     * pre-2018 RePORTER interface; NIH redirects it to the current site rather
     * than 404ing, but it is the only one of the six not already on
     * reporter.nih.gov. If the redirect is ever dropped, the modern equivalent
     * is https://reporter.nih.gov/project-details/9568906 — the `aid` in the
     * query string is the same project ID the new URLs use.
     */
    awardHref:
      "https://projectreporter.nih.gov/project_info_description.cfm?aid=9568906&icde=41169685",
    /** @verbatim */
    abstract:
      "Metabolomics plays an indispensable role in the growing systems biology approaches to identify reliable cancer biomarkers. Liquid chromatography coupled to mass spectrometry (LC-MS) and gas chromatography coupled to mass spectrometry (GC-MS) have been extensively used for high-throughput comparison of the levels of thousands of metabolites among biological samples. However, the potential values of many disease-associated analytes discovered by these platforms have been inadequately explored in systems biology research due to lack of computational tools. Partly due to these limitations, poor reproducibility of previously identified metabolite biomarker candidates has been observed, especially when they are evaluated through independent platforms and validation sets. This project aims to address this challenge using a new software tool (SysMet) that utilizes a network-based approach to uncover relationships between disease and metabolites by investigating the rewiring and conserved interactions among metabolites in the progression of the disease. In addition, we propose to extend the network-based approach for integrative analysis of multi-omics data to identify disease-associated metabolites. The tool will contribute to improving the ability of researchers to discover biomarkers by enhancing the role of metabolomics in systems biology research.",
  },
];

/* -------------------------------------------------------------------------- */
/* Section headings - REWRITTEN (no scientific claims)                         */
/* -------------------------------------------------------------------------- */

export const HEADINGS = {
  services: {
    eyebrow: "Services",
    title: null,
    description:
      "End-to-end support across the omics workflow, from study design through biological interpretation.",
  },
  platform: {
    eyebrow: "Software Platform",
    title: null,
    description: null,
  },
  projects: {
    eyebrow: "Projects",
    title: null,
    description:
      "Six SBIR projects supported by the National Institutes of Health and the National Science Foundation.",
  },
  about: {
    eyebrow: "About us",
    title: null,
    description: null,
  },
  team: {
    eyebrow: "Team",
    /* Title dropped at the client's request — "Bioinformaticians, engineers,
       and data scientists" restated the Who We Are block a screen above it,
       almost word for word. With no title, SectionHeading promotes the eyebrow
       to the section's heading element (see that file); `emphasizeEyebrow` in
       team-grid.tsx is what gives it the size the title used to carry. */
    title: null,
    description: null,
  },
  news: {
    eyebrow: "News",
    title: null,
    description:
      "Publications, presentations, and platform releases from the OmicsCraft team.",
  },
  contact: {
    eyebrow: "Contact",
    title: null,
    description:
      "Tell us about your study and we will get back to you.",
  },
} as const;
