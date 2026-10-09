// ─────────────────────────────────────────────────────────────────────────────
// Everything shown on the site lives in this file.
// To add a live link later, fill in the `live` field of a project (or any
// `href`) and redeploy. Leave a field empty ("") to hide its button.
// ─────────────────────────────────────────────────────────────────────────────

export type LinkKind = "live" | "video" | "code" | "kaggle" | "design" | "doc" | "paper";

export interface ProjectLink {
  kind: LinkKind;
  label: string;
  href: string;
  /** Short note shown under the button, e.g. free-tier cold start. */
  note?: string;
}

export interface Metric {
  value: string;
  label: string;
}

export type Category = "live" | "agents" | "vision" | "scratch" | "swe" | "nlp";

export interface Project {
  id: string;
  title: string;
  /** One line, technical. */
  tagline: string;
  /** One or two sentences a non-technical reader understands. */
  plain: string;
  year: string;
  role?: string;
  ribbon?: string;
  featured?: boolean;
  categories: Category[];
  metrics: Metric[];
  stack: string[];
  highlights: string[];
  links: ProjectLink[];
  /** Embeddable video shown inside the project window (loaded only on click). */
  video?: { provider: "youtube" | "drive"; id: string; title: string };
  /** Extra visual shown in the project window. */
  extra?: "resolv";
  /** Fact a recruiter should not miss, shown as a small banner. */
  recognition?: string;
}

// ── Profile ─────────────────────────────────────────────────────────────────

export const profile = {
  firstName: "Rajveer",
  lastName: "Gupta",
  headline: "AI / ML engineer & researcher",
  shortIntro:
    "I build AI systems end to end: read the papers, train the model, measure it honestly, then ship it behind an API people can use.",
  location: "India",
  college: "IIIT Nagpur",
  degree: "B.Tech, Computer Science & Engineering",
  years: "2024 – 2028",
  cgpa: "9.08",
  email: "rajveercareer1@gmail.com",
  phone: "+91 85639 38645",
  phoneHref: "tel:+918563938645",
  github: "https://github.com/rajveer1421",
  linkedin: "https://www.linkedin.com/in/rajveer-gupta-619462313",
  kaggle: "https://www.kaggle.com/rajveergup1455",
  huggingface: "https://huggingface.co/RajTheBuilder",
  /** Paste a public link to your résumé PDF here to show a "Résumé" button. */
  resumeUrl: "",
};

export const about = [
  "I'm a third-year Computer Science student at IIIT Nagpur. I like problems where a model has to be right for real people: a returned parcel that might be a swap, a patient who can't recognise their own family, a factory camera that has suddenly gone dark.",
  "Most of my work goes the whole way. I read the paper, build the model (sometimes from raw maths), check it against honest baselines, and then put it behind a Flask or FastAPI service that someone can actually use. When numbers disagree with my idea, I change the idea.",
];

export const quickFacts: { label: string; value: string }[] = [
  { label: "Studying", value: "B.Tech CSE, IIIT Nagpur" },
  { label: "CGPA", value: "9.08 / 10" },
  { label: "Graduating", value: "2028" },
  { label: "Main language", value: "Python" },
];

// ── Headline proof (the strip under the hero) ───────────────────────────────

export const proof: { value: string; label: string; href: string }[] = [
  { value: "AIR 345", label: "of 11,000+ teams · Amazon ML Challenge 2026", href: "#awards" },
  { value: "IEEE", label: "Paper presented at IRAI 2026, Melbourne", href: "#research" },
  { value: "Top 3,000", label: "of 1,34,000+ · Amazon ML Summer School 2026", href: "#research" },
  { value: "Best Innovation", label: "Tech Expo 2026 · Tinkerers' Lab, IIT Hyderabad", href: "#awards" },
];

// ── Roles ───────────────────────────────────────────────────────────────────

export const roles: { title: string; what: string; proof: string; proofHref: string }[] = [
  {
    title: "AI / ML Engineer",
    what: "Train, evaluate and ship models, from feature engineering to deployment.",
    proof: "Resolv: AIR 345 at the Amazon ML Challenge",
    proofHref: "#project-resolv",
  },
  {
    title: "AI Engineer (LLMs & agents)",
    what: "Multi-agent systems with LangGraph and LangChain, RAG, VLMs and evaluation.",
    proof: "ReturnGuard: a 5-agent fraud pipeline",
    proofHref: "#project-returnguard",
  },
  {
    title: "Applied AI / Applied Scientist",
    what: "Turn a messy real-world problem into a metric, then move that metric.",
    proof: "Resolv: 0.94 → 0.986 leaderboard F0.5",
    proofHref: "#project-resolv",
  },
  {
    title: "Research roles",
    what: "Computer vision and deep learning research with careful ablations.",
    proof: "IEEE IRAI 2026 paper",
    proofHref: "#research",
  },
  {
    title: "Application Engineer",
    what: "Take a product from problem discovery and Figma to shipped full-stack code.",
    proof: "Memora: memory care for Alzheimer's",
    proofHref: "#project-memora",
  },
  {
    title: "SDE / Python Developer",
    what: "Flask, FastAPI, SQL, clean object-oriented design and system design.",
    proof: "Stock Simulator: C++ OOP engine",
    proofHref: "#project-stock-simulator",
  },
];

export const interests = [
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "RAG",
  "LangChain",
  "LangGraph",
  "Agent orchestration",
  "Python development",
  "Flask & FastAPI",
  "SQL",
  "System design",
];

// ── Projects ────────────────────────────────────────────────────────────────

export const categoryLabels: Record<Category, string> = {
  live: "Live demos",
  agents: "LLMs & agents",
  vision: "Computer vision",
  nlp: "NLP",
  scratch: "Built from scratch",
  swe: "Software engineering",
};

export const projects: Project[] = [
  {
    id: "returnguard",
    title: "ReturnGuard",
    tagline: "Multi-agent AI that catches e-commerce return fraud",
    plain:
      "When someone returns a product, ReturnGuard checks whether the item sent back is really the one that was delivered, and flags swaps or damage before the refund goes out.",
    year: "2026",
    ribbon: "Best project",
    featured: true,
    categories: ["live", "agents", "vision", "swe"],
    metrics: [
      { value: "0.93", label: "precision" },
      { value: "0.88", label: "F1 score" },
      { value: "5", label: "cooperating agents" },
    ],
    stack: ["Python", "LangGraph", "LangChain", "DINOv2", "Vision-language models", "Flask", "SQL", "Docker"],
    highlights: [
      "Five agents share state in a LangGraph pipeline: policy check, return-reason check, fraud-risk scoring, visual analysis and a final decision step.",
      "Photos taken at delivery (front, back and side) are the ground truth. Each view of the returned item is compared with DINOv2 embeddings first; only the unclear views go on to vision-language models, and an LLM judge combines the per-view verdicts.",
      "My first version used a single video or a mixed set of photos, and accuracy was too low. Re-designing it around fixed views is what got it to 0.93 precision, 0.83 recall and 0.88 F1 on a hand-labelled set of 36+ product pairs.",
      "Tuned for precision so honest customers are not wrongly refused. Every case is routed to accept, send to a human, or reject.",
      "Flask + SQL backend with REST APIs, risk scores that take the customer's history into account, a full audit trail, and an explainable report (evidence, reasoning, verdict) for every case.",
    ],
    links: [
      // Paste the live demo URL here when it is ready:
      { kind: "live", label: "Live demo", href: "" },
      {
        kind: "video",
        label: "Watch demo",
        href: "https://drive.google.com/file/d/1XDHfIS821Vh63UTy2mTPHHnbKwXFnSfe/view?usp=sharing",
      },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/ReturnGuard" },
    ],
    video: { provider: "drive", id: "1XDHfIS821Vh63UTy2mTPHHnbKwXFnSfe", title: "ReturnGuard demo" },
  },
  {
    id: "memora",
    title: "Memora",
    tagline: "A memory-care assistant for people living with Alzheimer's",
    plain:
      "A patient points their phone at someone and Memora tells them who it is, in a loved one's recorded voice. Families can draw safe zones and get an SOS alert if the patient wanders off.",
    year: "2025 – 2026",
    role: "Co-founder & team lead",
    featured: true,
    categories: ["live", "vision", "swe"],
    recognition: "Microsoft Imagine Cup 2025 MVP round · Best Innovation Award, IIT Hyderabad",
    metrics: [
      { value: "98.5%", label: "face-match accuracy (LFW)" },
      { value: "0", label: "raw face images stored" },
      { value: "4", label: "services in production" },
    ],
    stack: ["React 18", "Node.js / Express", "FastAPI", "DeepFace · ArcFace", "BERT", "Supabase · pgvector", "Azure"],
    highlights: [
      "It started with a real event: a friend's grandfather with Alzheimer's went missing for a whole day.",
      "Face recognition with ArcFace embeddings (via DeepFace), 98.5% on the LFW benchmark. Camera frames become 512-number vectors, are matched by cosine similarity (threshold 0.68) on a pgvector index, and are thrown away. Raw images are never saved.",
      "A BERT model reads the patient's speech for signs of distress so the app can respond more gently.",
      "Families draw safe zones on a map. Leaving one triggers an automatic SOS with live location. The app also remembers where misplaced objects were last seen.",
      "Separate patient and family dashboards. The patient screen needs almost no tapping; I tried several Figma designs before picking the simplest one.",
      "React front end, Node.js/Express API with JWT auth, a FastAPI face-recognition service, and Postgres with row-level security. Deployed on Azure and Render.",
    ],
    links: [
      { kind: "live", label: "Live app", href: "https://memora-tqs5.onrender.com", note: "Free hosting: may take ~30 s to wake up" },
      { kind: "video", label: "Watch demo", href: "https://youtu.be/Lc7E4a7Mppg" },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/ARKA" },
      {
        kind: "design",
        label: "Figma",
        href: "https://www.figma.com/make/HSvitCD0Qhm9bt6kEOsltI/ARKA-Dashboard?t=YYcEKUNYIzJKNn4U-20&fullscreen=1",
      },
      {
        kind: "doc",
        label: "Case study",
        href: "https://drive.google.com/file/d/1fEkdFQ_bi4Hg4xjqnhm73N2pbmSp06ut/view?usp=sharing",
      },
    ],
    video: { provider: "youtube", id: "Lc7E4a7Mppg", title: "Memora demo" },
  },
  {
    id: "resolv",
    title: "Resolv",
    tagline: "Business entity resolution over 11.7 million records · Amazon ML Challenge 2026",
    plain:
      "The same shop shows up in different databases with different spellings, scripts and addresses. Resolv finds every record that belongs to the same real business, across France, India and the US.",
    year: "2026",
    role: "Team lead · The Epoch Warriors (4 people)",
    featured: true,
    categories: ["nlp", "agents"],
    recognition: "AIR 345 out of 11,000+ teams",
    metrics: [
      { value: "0.986", label: "public leaderboard F0.5" },
      { value: "0.99158", label: "validation F0.5" },
      { value: "0.998", label: "validation precision" },
    ],
    stack: ["Python", "LightGBM", "multilingual-e5", "Qwen3-Reranker-0.6B", "PyTorch", "Polars", "RapidFuzz"],
    highlights: [
      "Train on what the test set looks like. Test had far more unmatched \"distractor\" records than train (about 39.8% against 26.0%), and our first version dropped from 0.963 on validation to about 0.94 on the leaderboard. So we removed 20% of the training businesses (\"ghost S1\"), turning their records into realistic noise, and fitted every model and threshold on that.",
      "Two retrievers that cover each other's gaps: IDF-weighted keys from 11 families (name tokens, a phonetic skeleton, ZIP, house numbers…) and a multilingual-e5-small bi-encoder fine-tuned with InfoNCE that reads Indic scripts directly. Keys alone keep 95.75% of true pairs, the dense model 99.77%, together 99.86%.",
      "A two-pass LightGBM re-ranker cuts 86.7 candidates per business to 5.58 while keeping 99.43% of true pairs (validation).",
      "One record, one business. Every stage sees how strongly other businesses claim the same record, and these competition features rank near the top of every model. The final step gives each record to at most one business.",
      "Matching stack: 107 hand-built pair features into LightGBM, a multilingual-e5-base cross-encoder, a 126-feature stacker, a collective pass, and Qwen3-Reranker-0.6B fine-tuned and run only on uncertain pairs. The Qwen step was the biggest single leaderboard jump (+0.0022).",
      "Precision first. Under F0.5, adding an uncertain record only pays off above 0.632–0.743 precision, so a pair is kept only when p ≥ 0.70.",
    ],
    links: [{ kind: "code", label: "Code", href: "https://github.com/rajveer1421/resolv-" }],
    extra: "resolv",
  },
  {
    id: "stock-simulator",
    title: "Stock Market Simulator",
    tagline: "A trading engine in C++ built around clean object-oriented design",
    plain:
      "A stock market game: traders buy and sell shares, set up SIPs and compete on a live leaderboard, all in the browser.",
    year: "2025",
    featured: true,
    categories: ["swe"],
    metrics: [
      { value: "C++", label: "core engine" },
      { value: "5", label: "independent modules" },
      { value: "O(log n)", label: "leaderboard rank queries" },
    ],
    stack: ["C++", "STL", "OOP", "Python", "Flask", "JSON"],
    highlights: [
      "Trader, Company, Stock, SIP and Leaderboard are separate classes that use encapsulation, inheritance and polymorphism.",
      "Order types sit behind abstract base classes, so a new strategy plugs in without changing the core engine.",
      "Portfolio and leaderboard structures answer ranked queries on live profit and loss in O(log n).",
      "State is saved to JSON between sessions, and a Flask layer keeps the C++ engine separate from the web interface.",
    ],
    links: [{ kind: "code", label: "Code", href: "https://github.com/rajveer1421/Stock-Simulator-OOPs" }],
  },
  {
    id: "pneumonia-vit",
    title: "Pneumonia Detector",
    tagline: "A Vision Transformer written from first principles",
    plain: "Upload a chest X-ray and the model says whether it shows signs of pneumonia.",
    year: "2025",
    categories: ["live", "vision", "scratch"],
    metrics: [
      { value: "81%", label: "validation accuracy" },
      { value: "3", label: "architectures compared" },
    ],
    stack: ["TensorFlow", "Keras", "Flask", "Render"],
    highlights: [
      "Patch extraction, positional encodings, multi-head self-attention and encoder blocks all written by hand, with no pre-trained backbone.",
      "Compared CNN-only, pure ViT and a hybrid CNN + Transformer. The hybrid was the most stable on a small medical dataset.",
      "Deployed with Flask on Render with an image-upload prediction page.",
    ],
    links: [
      {
        kind: "live",
        label: "Live app",
        href: "https://pneumonia-detector-using-vision-image.onrender.com/",
        note: "Free hosting: may take ~30 s to wake up",
      },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/Pneumonia-Detector-using-Vision-Image-Transformer" },
    ],
  },
  {
    id: "mediguard",
    title: "MediGuard-AI",
    tagline: "A reinforcement-learning environment for context-aware ICU monitoring",
    plain:
      "A heart rate of 130 is normal while eating and an emergency at rest. MediGuard trains AI agents to read that context instead of flooding nurses with false alarms.",
    year: "2026",
    categories: ["live", "agents"],
    recognition: "Built for the Meta PyTorch × Scaler OpenEnv Hackathon 2026",
    metrics: [
      { value: "3", label: "graded tasks" },
      { value: "+0.23", label: "LLM agent over rule-based (triage)" },
    ],
    stack: ["Python", "OpenEnv", "FastAPI", "Gradio", "Docker", "Hugging Face Spaces"],
    highlights: [
      "Three tasks: false-alarm suppression with a personal 3-hour baseline, early sepsis detection, and ranking 4 ICU patients by urgency (NDCG@4).",
      "An LLM agent beats rule-based baselines by +0.07, +0.22 and +0.23 on the three tasks.",
      "Activity context (rest, eating, walking, distressed, falling) is compatible with MediaPipe Pose, so it could run on real camera feeds.",
      "FastAPI + Gradio, Dockerised with no hard-coded secrets, deployed on Hugging Face Spaces.",
    ],
    links: [
      { kind: "live", label: "Live app", href: "https://huggingface.co/spaces/RajTheBuilder/MediGuard-AI" },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/MediGuard-AI" },
    ],
  },
  {
    id: "ayursutra",
    title: "AyurSutra",
    tagline: "A full-stack AI platform for Ayurveda clinics",
    plain: "Software that helps Ayurveda clinics with diagnosis support, therapy scheduling, billing and day-to-day running.",
    year: "2025",
    categories: ["live", "swe"],
    recognition: "Smart India Hackathon 2025 · National semi-finalist",
    metrics: [
      { value: "9", label: "modules" },
      { value: "50+", label: "concurrent centres supported" },
    ],
    stack: ["React", "Node.js", "FastAPI", "MySQL", "XGBoost", "TensorFlow", "AWS"],
    highlights: [
      "Two-layer diagnosis support: XGBoost predicts dosha imbalance, then a neural network suggests therapies with confidence scores. The doctor always signs off.",
      "A reinforcement-learning and operations-research scheduler assigns rooms, therapists and equipment, and reschedules on cancellations.",
      "Medicine finder using OCR + retrieval-augmented LLM lookup, and an analytics dashboard.",
    ],
    links: [
      { kind: "live", label: "Live app", href: "https://ayursutra.amyverse.in/" },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/SIH-AI-Therapy-Assistant" },
    ],
  },
  {
    id: "peft",
    title: "Fine-tuning study: LoRA vs QLoRA vs Adapters",
    tagline: "A benchmark of parameter-efficient fine-tuning on cross-domain sentiment",
    plain: "Which way of teaching a language model a new task gives the best accuracy for the least computing cost?",
    year: "2026",
    categories: ["nlp"],
    metrics: [
      { value: "65 → 86%", label: "full fine-tune → QLoRA" },
      { value: "−75%", label: "GPU memory with QLoRA" },
    ],
    stack: ["PyTorch", "Hugging Face PEFT", "LoRA", "QLoRA", "Adapters"],
    highlights: [
      "Model pre-trained on AG News, then adapted to 50K IMDB reviews.",
      "Full fine-tuning 65%, Adapters 78%, LoRA 85%, QLoRA 86% accuracy.",
      "4-bit QLoRA cut GPU memory by 75%, so the training fits on consumer hardware. Full analysis is public on Kaggle.",
    ],
    links: [
      { kind: "kaggle", label: "Kaggle notebook", href: "https://www.kaggle.com/code/rajveergup1455/fine-tuning-using-lora" },
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/from-full-to-efficient-fine-tuning-sentiment-transformers" },
    ],
  },
  {
    id: "babybert",
    title: "BabyBERT",
    tagline: "Pre-training a BERT-style encoder from random weights",
    plain: "Teaching a language model to read from nothing, without borrowing any pre-trained knowledge.",
    year: "2026",
    categories: ["nlp", "scratch"],
    metrics: [
      { value: "100", label: "epochs × 1,667 steps" },
      { value: "0", label: "pre-trained weights" },
    ],
    stack: ["PyTorch", "DataParallel", "Custom tokenizer"],
    highlights: [
      "Masked-language-model and next-sentence-prediction objectives together, with 15% random masking, sentence pairs and segment IDs.",
      "Token, position and segment embeddings, multi-head attention and two prediction heads, all written by hand.",
      "Loss converged steadily from random initialisation. The pre-training dataset is published on Kaggle.",
    ],
    links: [
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/PreTraining-BabyBERT-From-Scratch" },
      { kind: "kaggle", label: "Kaggle dataset", href: "https://www.kaggle.com/datasets/rajveergup1455/bert-dataset" },
    ],
  },
  {
    id: "rag-assistant",
    title: "Company-policy RAG assistant",
    tagline: "Question answering over company documents that refuses to make things up",
    plain: "Employees ask questions about company policy in plain language and get answers taken only from the real documents.",
    year: "2026",
    categories: ["agents", "nlp"],
    metrics: [
      { value: "1,000 / 200", label: "token chunks / overlap" },
      { value: "\"I don't know\"", label: "when the answer isn't there" },
    ],
    stack: ["LangChain", "LLaMA", "ChromaDB", "Hugging Face embeddings"],
    highlights: [
      "Grew from a DPR + GPT-2 prototype into a LangChain + LLaMA retrieval pipeline with a persistent ChromaDB vector store.",
      "A strict prompt makes the model say \"I don't know\" when the retrieved context does not contain the answer.",
      "Semantic (not keyword) retrieval with Hugging Face embeddings; the stored index means repeat queries need no recomputation.",
    ],
    links: [{ kind: "code", label: "Code", href: "https://github.com/rajveer1421/Company-Policy-Rag-Assistant-" }],
  },
  {
    id: "kidney-xray",
    title: "Kidney scan classifier",
    tagline: "A depthwise-separable CNN with Grad-CAM explanations",
    plain: "Sorts kidney scans into cyst, stone, tumour or normal, and highlights the part of the image behind each decision.",
    year: "2025",
    categories: ["vision", "scratch"],
    recognition: "2nd place · Analytica, Tantrafiesta 2025, IIIT Nagpur",
    metrics: [
      { value: "85%", label: "accuracy, 4 classes" },
      { value: "5", label: "depthwise blocks" },
    ],
    stack: ["PyTorch", "Grad-CAM"],
    highlights: [
      "Custom network: five depthwise + pointwise blocks (3 → 512 channels) with BatchNorm, pooling and dropout. Far fewer parameters than a standard CNN.",
      "Grad-CAM overlays show which regions drove each prediction, which matters for trust in medical AI.",
    ],
    links: [{ kind: "code", label: "Code", href: "https://github.com/rajveer1421/ANALYTICA_theepochwarriors" }],
  },
  {
    id: "gpt-decoder",
    title: "GPT-style text generator",
    tagline: "A decoder-only Transformer built from scratch",
    plain: "A small GPT that learned to write movie reviews one word at a time.",
    year: "2026",
    categories: ["nlp", "scratch"],
    metrics: [{ value: "50K", label: "IMDb reviews" }],
    stack: ["PyTorch", "TorchText"],
    highlights: [
      "Token embeddings, sinusoidal positions, causal masking and stacked decoder blocks trained with next-token prediction.",
    ],
    links: [
      { kind: "code", label: "Code", href: "https://github.com/rajveer1421/GPT-Like-Decoder-Model-for-Text-Generation-using-IMDb-Dataset" },
    ],
  },
];

export const experiments: { title: string; detail: string; href: string }[] = [
  { title: "Seq2Seq RNN translator", detail: "Encoder–decoder LSTM with hand-written weight maths", href: "https://github.com/rajveer1421/Seq2Seq-RNN-Translator" },
  { title: "MNIST digit GAN", detail: "Generator and discriminator trained adversarially in Keras", href: "https://github.com/rajveer1421/MNIST-Images-Generation-with-GAN" },
  { title: "N-gram lyric generator", detail: "N-gram vs neural language model, perplexity ≈ 2.69", href: "https://github.com/rajveer1421/NgramLyricGen" },
  { title: "Handwritten digit CNN", detail: "98.8% accuracy on MNIST", href: "https://github.com/rajveer1421/Handwritten-Digit-Recognition-Using-CNN-in-Keras" },
  { title: "Australian rainfall prediction", detail: "Random forest vs XGBoost, 87% accuracy", href: "https://github.com/rajveer1421/Australian-Rainfall-Prediction" },
  { title: "UIDAI Aadhaar analytics", detail: "Streamlit dashboard and anomaly patterns on government data", href: "https://github.com/rajveer1421/DATAweb" },
];

// ── Resolv numbers (all from the team's submission documentation) ──────────

export const resolvFunnel: { value: string; label: string; split: string }[] = [
  { value: "1,732,544", label: "businesses to resolve (S1)", split: "test" },
  { value: "9,969,589", label: "records to search (S2 + S3)", split: "test" },
  { value: "86.7", label: "candidates per business after retrieval", split: "validation" },
  { value: "5.58", label: "after the LightGBM re-ranker", split: "validation" },
  { value: "≈ 3.38", label: "final matches per business", split: "test" },
];

export const resolvAblation: { label: string; value: number }[] = [
  { label: "LightGBM on 107 features", value: 0.98466 },
  { label: "e5-base cross-encoder alone", value: 0.98545 },
  { label: "Stacker (126 features)", value: 0.99093 },
  { label: "+ collective pass", value: 0.99098 },
  { label: "+ Qwen3 reranker", value: 0.99153 },
  { label: "Final (wider Qwen band)", value: 0.99158 },
];

export const resolvLeaderboard: { version: string; value: number; approx?: boolean; note: string }[] = [
  { version: "v1", value: 0.94, approx: true, note: "trained on the raw train distribution" },
  { version: "v2", value: 0.981874, note: "ghost-S1 training + dense retrieval" },
  { version: "v3", value: 0.9834, note: "two-pass re-ranker + competition features" },
  { version: "v4a", value: 0.985619, note: "Qwen3 reranker on uncertain pairs" },
  { version: "v4b", value: 0.985978, note: "wider Qwen band (final)" },
];

// ── Research & experience ───────────────────────────────────────────────────

export const publication = {
  title:
    "Fault Tolerant Industrial Vision Framework Through Semantic-Guided Cross-View Temporal Reconstruction and Restoration",
  venue: "IEEE International Conference on Responsible Artificial Intelligence (IRAI 2026)",
  where: "2–5 September 2026 · Melbourne, Australia",
  status: "Accepted and presented · to appear in IEEE Xplore",
  paperId: "IRAI26-000373",
  authors: ["Akshay Gupta", "Anshumaan Singh", "Rajveer Gupta", "Pranshu Jain", "Tushar Patidar"],
  plain:
    "When one camera in a factory's CCTV network fails, its view is simply lost. Our framework, HocVid, notices the failure and rebuilds the missing view from the overlapping cameras around it.",
  pipeline: [
    { step: "Detect", detail: "Hysteresis-based camera fault classification" },
    { step: "Reconstruct", detail: "Pose-free 3D Gaussian cross-view reconstruction (NoPoSplat)" },
    { step: "Fill", detail: "Semantic-guided diffusion inpainting" },
    { step: "Restore", detail: "Mamba-CNN dual-branch restoration, linear-time instead of quadratic attention" },
  ],
  results: [
    { value: "30.02 dB", label: "PSNR on Wildtrack (SSIM 0.893)" },
    { value: "32.42 dB", label: "PSNR on GoPro (SSIM 0.953)" },
  ],
  resultNote:
    "Outperforms the NAFNet and MoCE-IR baselines, with ablations isolating each module. The work began as a finalist entry at the IEEE IES Generative AI Hackathon 2026.",
  certificate: "/certificates/irai-2026-presentation.webp",
};

export const experience: {
  title: string;
  org: string;
  when: string;
  points: string[];
  link?: { label: string; href: string };
}[] = [
  {
    title: "Research Intern, Computer Vision & Deep Learning",
    org: "IIIT Nagpur · under Dr. Nishat Afshan Ansari",
    when: "2026",
    points: [
      "Researched fault-tolerant multi-camera vision for industrial CCTV networks: detecting camera failure, rebuilding a dead camera's view and restoring video, all in one pipeline.",
      "Co-developed HocVid (3D Gaussian reconstruction, diffusion inpainting, Mamba-CNN restoration). The paper was accepted and presented at IEEE IRAI 2026.",
    ],
  },
  {
    title: "Selected participant, Amazon ML Summer School 2026",
    org: "Amazon · top 3,000 of 1,34,000+ applicants",
    when: "Summer 2026",
    points: [
      "Intensive programme taught by Amazon scientists: representation learning, deep learning, reinforcement learning and production-scale ML systems.",
    ],
    link: { label: "View certificate (PDF)", href: "https://cdn.unstop.com/uploads/certificates/azmlss/0507_Rajveer_Gupta.pdf" },
  },
];

export const education: { school: string; detail: string; when: string; score: string }[] = [
  { school: "Indian Institute of Information Technology, Nagpur", detail: "B.Tech, Computer Science & Engineering", when: "2024 – 2028", score: "CGPA 9.08" },
  { school: "St. Joseph's School, Kota", detail: "Class XII", when: "2024", score: "92%" },
  { school: "City Montessori School, Lucknow", detail: "Class X", when: "2022", score: "98%" },
];

// ── Awards (the trophy shelf) ───────────────────────────────────────────────

export type TrophyShape = "cup" | "medal" | "plaque" | "scroll" | "star" | "frame";

export interface Award {
  id: string;
  /** Label on the shelf plaque. */
  short: string;
  title: string;
  event: string;
  detail: string;
  when: string;
  shape: TrophyShape;
  tone: "gold" | "silver" | "bronze" | "blue" | "ink";
  image?: string;
  thumb?: string;
  link?: { label: string; href: string };
}

export const awards: Award[] = [
  {
    id: "amazon-ml-challenge",
    short: "AIR 345",
    title: "Top 350 · AIR 345",
    event: "Amazon ML Challenge 2026",
    detail:
      "Ranked 345th of 11,000+ teams with an overall score of 0.985978. I led team The Epoch Warriors (with Hrutuparna Bedekar, Sutikshan Upman and Manas Tiwari); our solution is the Resolv project above.",
    when: "2026",
    shape: "cup",
    tone: "gold",
    image: "/certificates/amazon-ml-challenge-rank-345.webp",
    thumb: "/certificates/amazon-ml-challenge-rank-345-thumb.webp",
  },
  {
    id: "irai",
    short: "IEEE paper",
    title: "Paper presented",
    event: "IEEE IRAI 2026, Melbourne",
    detail:
      "Certificate of presentation for \"Fault Tolerant Industrial Vision Framework Through Semantic-Guided Cross-View Temporal Reconstruction and Restoration\". To appear in IEEE Xplore.",
    when: "Sept 2026",
    shape: "scroll",
    tone: "blue",
    image: "/certificates/irai-2026-presentation.webp",
    thumb: "/certificates/irai-2026-presentation-thumb.webp",
  },
  {
    id: "tinkerers",
    short: "Best Innovation",
    title: "Best Innovation Award",
    event: "Tech Expo 2026 · Tinkerers' Lab, IIT Hyderabad",
    detail: "Won the Best Innovation title with team ForgeInsight for computer-vision AI for assistive technology (Memora). Held on 21 March 2026.",
    when: "Mar 2026",
    shape: "medal",
    tone: "gold",
    image: "/certificates/tinkerers-lab-best-innovation.webp",
    thumb: "/certificates/tinkerers-lab-best-innovation-thumb.webp",
  },
  {
    id: "amazon-mlss",
    short: "Amazon MLSS",
    title: "Selected participant",
    event: "Amazon ML Summer School 2026",
    detail: "Selected among the top 3,000 of 1,34,000+ applicants across India.",
    when: "2026",
    shape: "frame",
    tone: "ink",
    link: { label: "Open certificate (PDF)", href: "https://cdn.unstop.com/uploads/certificates/azmlss/0507_Rajveer_Gupta.pdf" },
  },
  {
    id: "analytica",
    short: "2nd place",
    title: "2nd place",
    event: "Analytica · Tantrafiesta 2025, IIIT Nagpur",
    detail: "Certificate of Excellence for 2nd place in the ML/DL hackathon (10–11 Oct 2025) with a custom depthwise CNN and Grad-CAM for medical imaging.",
    when: "Oct 2025",
    shape: "cup",
    tone: "silver",
    image: "/certificates/analytica-2nd-place.webp",
    thumb: "/certificates/analytica-2nd-place-thumb.webp",
  },
  {
    id: "imagine-cup",
    short: "Imagine Cup",
    title: "MVP round qualifier",
    event: "Microsoft Imagine Cup 2025",
    detail: "Qualified for the international MVP round with Memora, an Azure-powered assistant for Alzheimer's patients.",
    when: "2025",
    shape: "star",
    tone: "blue",
  },
  {
    id: "ieee-ies",
    short: "IEEE IES",
    title: "Finalist",
    event: "IEEE IES Generative AI Hackathon 2026",
    detail: "Finalist with mentoring from IEEE experts. The idea grew into the IRAI 2026 paper.",
    when: "2026",
    shape: "plaque",
    tone: "bronze",
  },
  {
    id: "sih",
    short: "SIH 2025",
    title: "National semi-finalist",
    event: "Smart India Hackathon 2025",
    detail: "Semi-finalist with AyurSutra, from 1,00,000+ participants nationwide.",
    when: "2025",
    shape: "plaque",
    tone: "silver",
  },
  {
    id: "build-with-india",
    short: "Top 5k",
    title: "Top 5,000 of 25,000+ teams",
    event: "Build With India",
    detail: "Semi-finalist with an AI virtual-psychiatrist concept.",
    when: "Mar 2025",
    shape: "medal",
    tone: "bronze",
  },
];

// ── Skills ──────────────────────────────────────────────────────────────────

export const skillGroups: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Python (primary)", "C++", "C", "Java", "SQL", "JavaScript"] },
  {
    title: "ML & deep learning",
    items: ["PyTorch", "TensorFlow", "Keras", "scikit-learn", "XGBoost", "LightGBM", "CNNs", "RNN / LSTM", "Transformers", "ViT", "BERT", "GANs", "Mamba / SSMs", "Diffusion models", "Reinforcement learning"],
  },
  {
    title: "LLMs & agents",
    items: ["LangChain", "LangGraph", "Multi-agent orchestration", "RAG", "Hugging Face Transformers", "PEFT (LoRA, QLoRA)", "Vision-language models", "FAISS", "ChromaDB", "pgvector", "Prompt engineering"],
  },
  {
    title: "Computer vision & NLP",
    items: ["OpenCV", "DeepFace / ArcFace", "DINOv2", "3D Gaussian Splatting", "MediaPipe", "Grad-CAM", "multilingual-e5", "Rerankers", "Sentence embeddings"],
  },
  {
    title: "Backend & deployment",
    items: ["FastAPI", "Flask", "Node.js / Express", "REST APIs", "PostgreSQL", "MySQL", "Supabase", "Docker", "Azure", "AWS", "Hugging Face Spaces", "Git", "Linux"],
  },
  { title: "Data", items: ["NumPy", "pandas", "Polars", "Matplotlib", "seaborn", "Plotly", "Streamlit"] },
];

export const fundamentals: { title: string; note: string }[] = [
  { title: "Data structures & algorithms", note: "200+ problems on LeetCode and GeeksforGeeks" },
  { title: "Object-oriented programming", note: "Course grade AA" },
  { title: "Operating systems", note: "Processes, scheduling, memory" },
  { title: "Database management", note: "SQL, used in Memora, ReturnGuard and AyurSutra" },
  { title: "System design", note: "Microservices and REST APIs (Memora, ReturnGuard)" },
  { title: "Software engineering", note: "Course grade AA" },
  { title: "Design & analysis of algorithms", note: "Complexity, DP, greedy, graphs" },
];

export const certifications: { title: string; href: string }[] = [
  { title: "Machine Learning with Python", href: "https://coursera.org/share/a6b3fab619e85b5872db1063c23686f5" },
  { title: "Intro to Deep Learning & Neural Networks with Keras", href: "https://coursera.org/share/13869e89a3a0f2bf345ae2d38c01e4d8" },
  { title: "Deep Learning with Keras & TensorFlow", href: "https://coursera.org/share/5d1454fb5fa3c718f4b3869e342512be" },
  { title: "Introduction to Neural Networks & PyTorch", href: "https://coursera.org/share/5909b6c445edb13b592869eac5068645" },
  { title: "Deep Learning with PyTorch", href: "https://coursera.org/share/5c57b8be6857bda4f7ee07dff0ae3b6d" },
  { title: "Gen AI Foundational Models for NLP & Language Understanding", href: "https://coursera.org/share/9a3c408c7866c0be6533e9932cffaf87" },
  { title: "Generative AI Language Modeling with Transformers", href: "https://coursera.org/share/6ccd9ef56f0ffbf754a1628337a3d215" },
  { title: "Fundamentals of AI Agents Using RAG & LangChain", href: "https://coursera.org/share/77f13252966c8897e0440a770f127e11" },
];
