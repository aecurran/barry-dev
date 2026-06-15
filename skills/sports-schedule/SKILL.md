# Sports Schedule

> **Phase 2 skill — not yet implemented.**
>
> Per the centralised sports data design (DEVELOPMENT_PLAN 2.2, 12 Jun 2026), this skill does
> **no scraping**. Scraping happens once per team in the platform's `apps/scraper` service.
> This skill will be a thin client that queries the platform fixtures API with the family's
> scoped token (like `family-lists` queries the lists API) to answer questions such as
> "When's Jack's next game?" — reading from the shared fixture cache.
