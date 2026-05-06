# Agent-kort

> Oversigt over agenter i harnesset, deres roller og relationer.
> **Note**: Dette er en skabelon der skal udfyldes loebende efterhaanden som agenter tilfoejes.

## Agenter (placeholder)

| Agent | Rolle | Trigger | Bruger skills | Bemaerkning |
|-------|-------|---------|---------------|------------|
| *(tom)* | *(tom)* | *(tom)* | *(tom)* | *(tom)* |

## Roller (foreslaede)

Foelgende roller er identificeret som potentielle agenter baseret paa projektets domaene:

- **Kompetenceassistent** — Haandterer funktions- og stillingsbeskrivelser
- **BBTR-raadgiver** — Teknisk raadgivning efter BaneByg-standarder
- **Sikkerhedsvurderer** — CSM-RA og risikovurdering
- **Trafikal regelassistent** — ORS/ORF/SR og lokale instruktioner
- **Projektindstillingsassistent** — Portefoaljekontor og governance
- **Dokumentkontrollant** — Kvalitet, DoD og receptionskontrol

## Relationer

```
+---------------------+
|   Orkestrator (?)   |
+----------+----------+
           |
    +------+------+----------+
    |      |      |          |
    V      V      V          V
+-------++-----++--------++----------+
| BBTR  || Sik.|| Trafik || Projekt  |
| raadg.|| vurd|| regler || indst.   |
+-------++-----++--------++----------+
```

> *Dette kort skal opdateres naar agenter faktisk implementeres. Se runbook `how-to-add-agent.md` for proceduren.*
