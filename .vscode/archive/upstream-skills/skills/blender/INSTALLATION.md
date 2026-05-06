# BLENDER SKILL - INSTALLATION GUIDE

## Hvad er dette?

Dette er et komplet skill-sæt til din OpenClaw Personal AI Assistant system, der giver Claude ekspertise i:
- Parametrisk 3D modellering i Blender
- Ingeniørdokumentation og tværsnitsvisualisering
- Teknisk korrekte materialer og rendering
- Integration med PolyHaven, Sketchfab og AI-generering

## Indhold

```
blender-skill/
├── SKILL.md                    # 12 KB - Hovedskill definition
├── parametric-modeling.md      # 12 KB - Parametrisk modellering guide
├── material-library.md         # 12 KB - Materialebibliotek reference
└── README.md                   #  5 KB - Brugervejledning
                                ─────────
                                  41 KB total
```

## Installation i OpenClaw System

### Trin 1: Upload til Project Knowledge

1. Gå til dit Claude projekt
2. Find "Project Knowledge" sektionen
3. Upload ALLE 4 filer fra `blender-skill/` mappen:
   - ✓ SKILL.md
   - ✓ parametric-modeling.md
   - ✓ material-library.md
   - ✓ README.md

### Trin 2: Verificer Installation

Test med følgende prompts:

```
"Har du Blender skills?"
→ Claude skal bekræfte Blender MCP capabilities

"Vis mig hvordan jeg laver en parametrisk model"
→ Claude skal referere til parametric-modeling.md

"Hvilke materialer kan du lave i Blender?"
→ Claude skal liste fra material-library.md
```

### Trin 3: Aktivering

Skill aktiveres AUTOMATISK når du:
- Nævner "Blender", "3D model", "3D visualization"
- Beder om tekniske tegninger, cutaway views, tværsnit
- Diskuterer parametrisk modellering
- Refererer til engineering visualization

## Forudsætninger

### Påkrævet:
- ✓ Blender 5.0+ installeret
- ✓ MCP Blender server kørende
- ✓ OpenClaw/HassanDigitalTwin projekt setup

### Valgfrit (for fuld funktionalitet):
- ○ PolyHaven API adgang (gratis)
- ○ Sketchfab API nøgle
- ○ Hyper3D Rodin API nøgle
- ○ Hunyuan3D API nøgle

## Hvad kan Blender Skill?

### ✓ Parametrisk Modellering
```python
# Eksempel: Claude opretter dimension-drevet model
User: "Lav en sporkasse med ballast 0.30m, underballast 0.25m"

Claude:
1. Validerer kildedata
2. Opretter parametrisk script
3. Markerer TBD parametre
4. Genererer model
5. Validerer dimensioner
6. Leverer justeringsinstruktioner
```

### ✓ Realistiske Materialer
- Beton (ny, gammel, sveller)
- Stål (ren, oxideret, galvaniseret, rustent)
- Aggregater (granitskærver, grus, sand, betongrus)
- Jord (mørk, ler, sand)
- Plast (PVC orange/sort, PE)
- Asfalt (ny, gammel)
- Glas, træ, maling

### ✓ Teknisk Dokumentation
- Organiserede collections
- Dimensionsvalidering
- Cutaway visualisering
- Kamera-setup
- Screenshot-capture

### ✓ Asset Integration
- PolyHaven teksturer og modeller
- Sketchfab 3D models
- AI-genereret 3D (Hyper3D, Hunyuan3D)

## Eksempel-Workflows

### Workflow 1: Jernbane Tværsnit
```
User: "Lav jernbanespor tværsnit med:
- Sporvidde 1.435m
- Ballast 0.30m
- Underballast 0.25m
- Planumsbredde 3.0m"

Claude:
✓ Verificerer kildedata
✓ Markerer TBD (sporvidde antaget)
✓ Opretter lagdelt model
✓ Anvender realistiske materialer
✓ Transparent cutaway
✓ Dimensionsvalidering
✓ Screenshot + justeringsinstruktioner
```

### Workflow 2: Asset Import
```
User: "Find en betonvæg fra Sketchfab og tilføj til scenen"

Claude:
✓ Søger Sketchfab
✓ Viser preview
✓ Downloader med korrekt skalering
✓ Importerer til scene
✓ Anvender materialer
```

### Workflow 3: AI Generering
```
User: "Generer en moderne kontorbygning fra dette billede"

Claude:
✓ Checker Hyper3D/Hunyuan3D status
✓ Uploader billede
✓ Starter generering
✓ Poller for completion
✓ Importerer færdig model
✓ Skalerer korrekt
```

## Kvalitetssikring

### Hver Blender Opgave Skal:
- [ ] Verificere kildedimensioner (✓)
- [ ] Markere antagelser (ANTAGET)
- [ ] Printe dimensionsvalidering
- [ ] Organisere i collections
- [ ] Anvende realistiske materialer
- [ ] Positionere kamera optimalt
- [ ] Tage screenshot
- [ ] Levere justeringsinstruktioner

## Best Practices

### GØR:
✓ Angiv kildespecifikationer
✓ Bed om dimensionsvalidering
✓ Anmod om screenshots
✓ Brug organiserede collections
✓ Verificer materialer i Material Preview

### UNDGÅ:
✗ Forvente opdigtede dimensioner
✗ Spring kildeverifikation over
✗ Ignorer TBD advarsler
✗ Bland enhedssystemer
✗ Glem viewport shading

## Fejlfinding

### "Materialer ikke synlige"
→ Skift til Material Preview (Z-menu)

### "Dimensioner matcher ikke"
→ Check console validation report

### "Blender tools virker ikke"
→ Verificer MCP server kører

### "Asset download fejler"
→ Check API status + internet

## Support

### Få Hjælp:
1. Spørg Claude: "Hvordan laver jeg [specifik opgave]?"
2. Bed om: "Vis Blender skill dokumentation"
3. Check Project Knowledge for seneste filer

### Opdater Skill:
1. Upload nye/modificerede filer til Project Knowledge
2. Skill opdateres automatisk
3. Verificer med test-query

## Version

**v1.0** (2026-02-15)
- Initial release
- Fuld MCP integration
- Komplet materialbibliotek
- AI generering support
- Parametrisk modellering

## Output

Alle filer er klar i `/mnt/user-data/outputs/blender-skill/`

Du kan nu:
1. Downloade mappen
2. Uploade filerne til dit Claude projekt
3. Begynde at bruge Blender skills

---

**Status**: Production Ready ✓  
**Kompatibilitet**: Blender 5.0+, MCP Blender Server  
**Maintainer**: OpenClaw Development Team
