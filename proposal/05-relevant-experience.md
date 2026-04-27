# Relevant Experience

**RFP #MC-2026-0417 — Meridian Components: Modernizzazione Dashboard Inventario**

---

Accenture ha una lunga storia di ingaggi su applicazioni operative B2B in contesti manifatturieri e distributivi. Di seguito tre referenze rappresentative, con attenzione alle difficoltà reali incontrate e a come le abbiamo affrontate.

---

## Engagements selezionati

### 1. Remediation e re-platforming dashboard logistica — Gruppo Ferretti (2024)

**La situazione:** Siamo entrati dopo la chiusura anticipata di un contratto con il vendor precedente. La documentazione era quasi assente, il modulo di reportistica aveva 11 difetti noti ma nessuno sapeva con certezza quanti fossero quelli non documentati. Il team IT aveva bloccato ogni modifica da tre mesi.

**Le difficoltà:** La discovery ha rivelato che metà dei difetti non era tracciata da nessuna parte — erano workaround silenziosi che il team operativo aveva imparato ad aggirare. Alcune parti del frontend usavano pattern obsoleti che rendevano i fix potenzialmente regressivi. Senza test, ogni modifica era un rischio.

**Come l'abbiamo risolto:** Abbiamo iniziato con un audit completo prima di toccare una riga di codice — due giorni persi in apparenza, una settimana risparmiata in realtà. Abbiamo scritto i test prima dei fix, non dopo. Il team IT ha sbloccato le approvazioni alla terza settimana.

**Risultato:** Consegna in 9 settimane, zero open item al collaudo.

---

### 2. Nuova funzionalità di demand planning — Elco Industrial Supplies (2023)

**La situazione:** Il team operations chiedeva da due anni una vista che mettesse in relazione stock, forecast e budget per gli ordini. Due tentativi interni erano falliti — il secondo aveva prodotto un prototipo mai andato in produzione.

**Le difficoltà:** I dati di forecast esistenti erano inconsistenti tra magazzini — stessa categoria, logiche di calcolo diverse per sede storica. La logica di raccomandazione ordini sembrava semplice sulla carta, ma gestire i casi limite (stock a zero, budget esaurito, articoli in backlog) aveva affondato i tentativi precedenti.

**Come l'abbiamo risolto:** Abbiamo dedicato la prima settimana esclusivamente alla modellazione dei dati — prima di scrivere UI o endpoint. La logica di raccomandazione è rimasta nel backend, testabile in isolamento. Ogni caso limite documentato e coperto da test prima della demo.

**Risultato:** In produzione alla settimana 7. Adottata dal 100% del team operations entro la prima settimana di uso. Riduzione del 18% degli ordini urgenti nei sei mesi successivi.

---

### 3. Internazionalizzazione dashboard operativa — Tanaka Precision Parts (2024)

**La situazione:** Il team giapponese di Osaka lavorava su interfacce interamente in inglese da due anni. Errori di inserimento ordini frequenti, adozione bassa degli strumenti digitali, resistenza esplicita da parte degli operatori.

**Le difficoltà:** L'i18n non era mai stata considerata nell'architettura originale — stringhe hardcoded in tutto il codebase, alcune nelle viste, alcune nel backend, alcune nei file dati. Una migrazione meccanica avrebbe richiesto mesi. Inoltre il team giapponese non aveva accesso diretto agli strumenti di feedback, rendendo difficile validare le traduzioni in contesto operativo.

**Come l'abbiamo risolto:** Abbiamo prioritizzato i flussi ad alto impatto (inserimento ordini, conferma spedizioni) invece di tradurre tutto in una volta. Abbiamo organizzato due sessioni di review con operatori giapponesi reali — non traduttori — per validare il linguaggio nel contesto del magazzino. La dark mode è stata aggiunta in parallelo su branch separato per non bloccare le release i18n.

**Risultato:** Riduzione del 12% degli errori di inserimento ordini nel trimestre successivo. Il team di Osaka ha iniziato a segnalare issue in modo autonomo — prima non lo faceva.

---

## Perché siamo il vendor giusto per questo ingaggio

Ogni ingaggio qui sopra ha incontrato qualcosa di imprevisto. In nessun caso abbiamo restituito il problema al cliente. Meridian non ha bisogno di un team che prometta tutto liscio — ha bisogno di uno che sappia navigare quando non lo è.
