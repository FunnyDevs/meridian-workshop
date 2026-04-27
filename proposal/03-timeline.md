# Timeline

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## Approccio alla pianificazione

La sequenza è dettata dalle dipendenze reali, non dalla numerazione dell'RFP. R3 (test) viene prima perché sblocca l'approvazione IT su tutto il resto. R4 (architettura) viene subito dopo perché orienta il lavoro tecnico. R1 e R2 seguono in ordine di rischio: prima si risolve il debito esistente, poi si costruisce il nuovo.

---

## Piano di consegna

| Settimana | Attività | Deliverable |
|-----------|----------|-------------|
| **1** | Kickoff, accesso alla codebase, discovery architetturale, allineamento con IT su flussi critici | — |
| **2** | R4: review codebase + produzione documentazione architetturale | `architecture.html` consegnato a Meridian IT |
| **2–3** | R3: scrittura test Playwright sui flussi critici approvati da IT | Suite di test, CI-ready |
| **3–4** | R1: audit Reports module, fix di tutti i difetti noti, verifica con test | Reports module stabile e coperto da test |
| **5–7** | R2: design e build della vista Restocking (backend + frontend) | Restocking view in produzione |
| **8** | Collaudo finale, revisione con Meridian, consegna documentazione | Pacchetto di consegna completo |
| **9+** | D1–D3 (scope condizionale, se approvato) | UI refresh / i18n / dark mode |

---

## Milestone principali

- **Fine settimana 2** — Meridian IT riceve la documentazione architetturale e può iniziare la review interna
- **Fine settimana 3** — Suite di test consegnata; da questo punto ogni modifica è approvabile da IT
- **Fine settimana 4** — Reports module risolto; il team operativo può tornare a fidarsi dei dati
- **Fine settimana 7** — Restocking view live; R. Tanaka e il team operations possono iniziare a usarla
- **Fine settimana 8** — Collaudo e consegna formale

---

## Note

- La timeline assume accesso al backlog difetti Reports entro la settimana 1 (vedi A1 nel Technical Approach).
- I desired item D1–D3 richiedono approvazione separata di scope e budget prima di iniziare.
- Ogni milestone è accompagnata da una demo con Meridian — nessuna sorpresa alla consegna finale.
