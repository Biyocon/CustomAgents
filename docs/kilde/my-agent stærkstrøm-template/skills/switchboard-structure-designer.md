# Skill: Switchboard Structure Designer

> Design af tavlestruktur og forsyningshierarki
> Input: Belastningsdata, forsyningsprincip, krav
> Output: Tavlestruktur med fordeling og redundans

---

## Formål

Design en principiel tavlestruktur baseret på belastningsfordeling, forsyningsprincip, redundanskrav og grænseflader til andre systemer.

## Input

- Load list med tavlehenvisninger
- Forsyningsprincip (normal, nød, UPS)
- Redundanskrav
- Kortslutningsdata
- Krav til sektionsering
- Interface til automatik, BMS/SCADA
- Tavlestandard (DS/EN 61439)
- IP-klasse og miljøkrav

## Metode

1. **Kortlæg forsyningshierarki**
   - Hovedtavle (HT)
   - Fordelingstavler (UT)
   - Lokale tavler (LT)
   - Terminaler

2. **Fordel belastninger**
   - Gruppér efter system, område, kritikalitet
   - Balancér faser
   - Reserver kapacitet

3. **Definér forsyningsprincip**
   - Normalforsyning
   - Nødforsyning (generator, UPS)
   - Redundans (N+1, N+N)

4. **Sektioner**
   - Del tavler efter behov
   - Sikring af forsyning ved vedligeholdelse

5. **Navngiv tavler**
   - Konsistent nomenklatur
   - Eksempel: HT-01, UT-SPILDEVAND, LT-PUMPERUM-A

## Output

| Tavle-ID | Type | Forsyning fra | Spænding | Samlet effekt | Reserve | Redundans | Bemærkning |
|---|---|---|---|---|---|---|---|

## Output — forsyningshierarki

```
HT-01 (Hovedtavle)
├── UT-01 (Spildevand)
│   ├── LT-PUMPERUM-A
│   └── LT-PUMPERUM-B
├── UT-02 (Proces)
│   └── LT-PROCES-A
└── UT-03 (Nødstrøm)
    └── LT-NØD-A
```

## Begrænsninger

- Principiel struktur — detaljeret design kræver tavleproducent
- Kræver verificerede kortslutningsdata
- Skal markeres som foreløbig
