# Technical Approach

**RFP #MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

---

## Premessa metodologica

Il materiale di handoff fornito dal vendor precedente è incompleto. Prima di stimare o iniziare qualsiasi attività, condurremo una discovery della codebase esistente: revisione dell'architettura reale, mappatura dei difetti noti nel Reports module, verifica della coerenza tra documentazione e codice.

Le assunzioni riportate in questa sezione sono basate sui materiali RFP disponibili. Ogni assunzione che dovesse risultare errata verrà comunicata a Meridian entro la prima settimana di ingaggio, con impatto su scope e timeline dichiarato per iscritto.

---

## R1 — Reports Module Remediation

**Approccio:** Audit sistematico del Reports module prima di toccare qualsiasi codice. Per ogni difetto noto (filtri non cablati, gap di i18n, pattern dati inconsistenti):

1. Riproduzione documentata del comportamento errato
2. Identificazione della causa radice nel codice
3. Fix mirato, senza refactoring non richiesto
4. Verifica con test automatizzato prima di chiudere l'issue

**Assunzione:** Meridian ha un backlog interno degli 8+ difetti segnalati. Richiediamo accesso a quel backlog nella prima settimana — in assenza, condurremo noi un audit completo del module come attività preliminare.

---

## R2 — Restocking Recommendations

**Approccio:** Nuova vista dedicata nel dashboard, costruita sul pattern architetturale esistente (Vue 3 Composition API + FastAPI). L'operatore potrà:

- Visualizzare i livelli di stock correnti per magazzino e categoria
- Vedere la demand forecast associata a ciascun articolo
- Impostare un budget ceiling per generare raccomandazioni di purchase order prioritizzate

La logica di raccomandazione risiederà nel backend (Python/FastAPI) per garantire testabilità e separazione dalla UI. Il frontend si occupa esclusivamente della presentazione e dell'input del budget.

**Assunzione:** La demand forecast è già disponibile tramite l'endpoint `/api/demand` esistente. Se il dato non è sufficiente per alimentare le raccomandazioni, lo segnaliamo a Meridian come primo deliverable della fase R2.

---

## R3 — Automated Browser Testing

**Approccio:** Copertura end-to-end con Playwright sui flussi critici del dashboard. R3 è il prerequisito che sblocca ogni altra modifica: verrà consegnato per primo, in modo che l'IT team di Meridian possa approvare le successive release con fiducia.

I flussi da coprire saranno definiti insieme all'IT team di Meridian nella prima settimana (sono attualmente non specificati nell'RFP — vedi Assunzioni). Come baseline proponiamo: caricamento dashboard, navigazione tra viste, applicazione filtri, visualizzazione Reports.

---

## R4 — Architecture Documentation

**Approccio:** Review della codebase esistente con output duplice:

1. **Diagramma architetturale navigabile** (HTML) — componenti frontend, endpoint backend, flusso dati, dipendenze
2. **Note operative per l'IT team** — come avviare l'applicazione, come modificare i dati, pattern ricorrenti nel codice, rischi noti

Questo deliverable verrà prodotto all'inizio dell'ingaggio, perché orienta anche il nostro lavoro sugli item successivi.

---

## Desired Items (D1–D3)

Trattati come scope condizionale, nell'ordine di priorità seguente:

- **D1 — UI modernization:** Refresh visivo basato sulle nostre best practice di design per applicazioni operative B2B. Non esiste una guida visiva Meridian — progetteremo noi una proposta di stile coerente con i design token esistenti (palette slate/gray, status colors) e la sottoporremo a Meridian per approvazione prima dell'implementazione. Un ciclo di revisione è incluso nello scope.
- **D2 — Internationalization:** Estensione i18n al team di Tokyo (giapponese come lingua primaria aggiuntiva). Il framework di localizzazione Vue i18n è già parzialmente in uso nel progetto.
- **D3 — Dark mode:** Tema selezionabile dall'operatore, sviluppato su branch isolato per non interferire con il lavoro sul main.

---

## Assunzioni e Rischi Aperti

| # | Assunzione / Rischio | Impatto se errata |
|---|---|---|
| A1 | Il backlog dei difetti Reports è accessibile a Meridian e condivisibile | Aggiungiamo 2–3 giorni di audit preliminare |
| A2 | I flussi "critici" per R3 verranno definiti con l'IT team nella settimana 1 | Scope dei test da rivedere |
| A3 | La demand forecast in `/api/demand` è sufficiente per alimentare R2 | Fase R2 richiede attività di data design aggiuntiva |
| A4 | L'architettura JSON-file (nessun DB) è una scelta deliberata e non va modificata | Se Meridian vuole un DB, è fuori scope di questo ingaggio |
| A5 | "Current standards" per D1 verrà definito da Meridian con un riferimento concreto | Mockup soggetti a revisione aggiuntiva |
