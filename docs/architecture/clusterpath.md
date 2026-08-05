# ClusterPath

Career direction is opaque. Which skills should you learn, and which roles actually fit the résumé you already have? ClusterPath takes a PDF and answers both with a clustered skills graph and a generated roadmap.

## System

![Architecture](/diagrams/clusterpath.svg)

## Résumé to roadmap

1. A PDF is parsed into structured sections with PyMuPDF.
2. Two extractions run over it: keywords via YAKE and KeyBERT, and vector embeddings of each section via Gemini.
3. Jobs are matched by vector similarity, executed as database-side pgvector functions rather than pulled into application memory.
4. Section embeddings are clustered with k-means to surface peer cohorts and adjacent roles.
5. Matches and gaps feed a generated learning roadmap with skill-gap questions.
6. The client renders the result as an interactive force-directed graph.

## Stack

**Web:** React 19 · Vite · React Router 7 · Tailwind · shadcn/ui · React Flow, sigma and d3 · Zustand · Supabase Auth, on Vercel.

**API:** FastAPI · PyMuPDF · Google Gemini (`embedding-001` and `gemini-2.0-flash`) · Supabase pgvector · KeyBERT · YAKE · scikit-learn, on Azure.

## Decisions worth noting

**Similarity search lives in the database.** Matching runs as pgvector functions inside Postgres, so candidate ranking never round-trips a large embedding set into Python. The store does the work it is good at.

**Keywords and embeddings both, not either.** Embeddings capture meaning and miss exact tokens; keyword extraction catches the literal terms a job description screens on. Running both and matching on the pair beats either alone.

**Clustering answers a different question from matching.** Matching says which jobs fit. Clustering over section embeddings says which *cohort* a résumé belongs to, which is what makes an adjacent-role suggestion useful rather than obvious.

**A measured refactor.** Moving to a utility-first design system cut the bundle by 60% and page load from 3.2s to 1.8s.

*Solo, full-stack. The [API is public](https://github.com/git07Sandesh/clusterpath-api); the web client is currently private.*
