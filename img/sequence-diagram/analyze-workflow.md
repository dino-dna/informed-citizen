# https://www.websequencediagrams.com/
title Analyze Workflow

UI->Cronkite: Request analysis
Cronkite->Scraper: Visits article URL
Scraper->Cronkite: Scrapes article contents
Cronkite->Analyzer: Requests AutoAnalysis
Analyzer->Cronkite: Generates AutoAnalysis
Cronkite->DB: Caches analysis
Cronkite->UI: Returns analysis
