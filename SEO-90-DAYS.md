# toumé: plan SEO na 90 dni

## Dni 1–30: fundament i oferta

- Opublikować osobne URL-e `/en/` i `/pl/`, z treścią dostępną w HTML bez uruchamiania JavaScript.
- Zachować obecną narrację strony głównej. Nadać jej opisowy title i jeden H1; osobiste przedstawienie może pozostać częścią hero.
- Przygotować pięć stron usług w obu językach: technology-consulting, technology-audit, systems-process-mapping, automation-ai, implementation-support.
- Każda strona odpowiada na sytuację klienta, zakres pracy, przebieg współpracy i rezultat. Unikać niepotwierdzonych obietnic, nazw klientów i liczb.
- Dodać wzajemne hreflang EN/PL, canonical do własnego URL-a, sitemap.xml i robots.txt z adresem sitemapy.
- Dodać JSON-LD zgodny z widoczną treścią: WebSite, Person i Service. Nie dodawać fikcyjnego adresu, ocen ani certyfikatów.
- Po publikacji zgłosić sitemapę w Google Search Console i sprawdzić kluczowe URL-e narzędziem inspekcji.

### Docelowe URL-e

Każda ścieżka w obu wersjach językowych, zakończona ukośnikiem:

| Strona | Ścieżka |
| --- | --- |
| Strona główna | `/en/`, `/pl/` |
| Doradztwo | `/en/technology-consulting/`, `/pl/technology-consulting/` |
| Audyt | `/en/technology-audit/`, `/pl/technology-audit/` |
| Mapowanie | `/en/systems-process-mapping/`, `/pl/systems-process-mapping/` |
| Automatyzacja i AI | `/en/automation-ai/`, `/pl/automation-ai/` |
| Wdrożenie | `/en/implementation-support/`, `/pl/implementation-support/` |
| O mnie | `/en/about/`, `/pl/about/` |
| Kontakt | `/en/contact/`, `/pl/contact/` |
| Artykuły | `/en/insights/`, `/pl/insights/` |

Nie publikować pustych stron ani linków do nieistniejących artykułów. Zachować działanie istniejących adresów i pliku weryfikacyjnego Google.

## Dni 31–60: treści odpowiadające na konkretne problemy

Publikować jeden dopracowany materiał co 1–2 tygodnie, z polskim odpowiednikiem. Każdy materiał ma autora, praktyczny przykład, ograniczenia i link do właściwej usługi.

1. Technology problems rarely exist in isolation: przykład zależności procesu, danych i narzędzia; link do mapowania i audytu.
2. How to audit a business before introducing AI: cele, dowody, jakość danych, ograniczenia i decyzja o przydatności AI; link do audytu i automation-ai.
3. Automation can make a broken process worse: koszt przyspieszania błędnego procesu, wyjątki i warunki sensownej automatyzacji.
4. From prototype to production: odpowiedzialność, awarie, odzyskiwanie działania, monitoring i koszty; link do implementation-support.

Nie fabrykować case studies. Przykłady hipotetyczne oznaczać jako przykłady; doświadczenie zawodowe opisywać tylko w potwierdzonym zakresie.

## Dni 61–90: ocena i korekta

- Sprawdzić, które URL-e są indeksowane i czy Google wybiera właściwy canonical.
- Porównać zapytania i wyświetlenia dla stron usług; poprawić treści, które odpowiadają na inną intencję niż zapytania.
- Ocenić title i opis tam, gdzie są wyświetlenia, ale niski CTR, uwzględniając pozycję i małą próbę danych.
- Rozwinąć dwie najlepiej rokujące grupy tematów zamiast zwiększać liczbę podobnych artykułów.
- Sprawdzić linki, wersje językowe, mobilną czytelność oraz działanie formularza.

## Pomiar

Punkt odniesienia zapisać przed publikacją. Co tydzień sprawdzać błędy indeksowania, a co 30 dni wyświetlenia, kliknięcia, zapytania, strony docelowe i rzeczywiste zapytania biznesowe. Nie obiecywać pozycji ani wzrostu ruchu w określonym terminie. Sama sitemapa ani dane strukturalne nie gwarantują indeksacji lub rozszerzonych wyników.

## Źródła

- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
