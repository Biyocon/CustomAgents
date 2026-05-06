import json
from pathlib import Path
from textwrap import dedent

ROOT = Path(".")
ROSTER_PATH = ROOT / ".vscode/.codex/agents/agent-roster.json"
AGENTS_DIR = ROOT / "Avatar/agents"

roster = json.loads(ROSTER_PATH.read_text(encoding="utf-8"))

# New agents from Iqra
NEW_AGENTS = [
    {
        "id": "ahmad-el-wali",
        "name": "Ahmad El-Wali",
        "role": "Strategic Engineering Leader / Head of Sourcing, Contracts & Interface Management",
        "category": "Ledelse og governance",
        "avatar": "Avatar/2_Avatar_Agent_Ahmad_El-Wali_Strategic_Engineering_Leader.png",
        "accent": "emerald",
        "skills": [
            "karpathy-guidelines",
            "shared-quality",
            "shared-docx",
            "bdk-brand-governance",
            "bdk-gdpr-praksis",
            "bbtr-raadgiver-udbud",
            "bbtr-fagpakkestruktur",
            "bbtr-dokumentstyring",
            "bbtr-leverance-mapping",
            "bbtr-kvalitet-dod",
            "bdk-legal-mapping",
            "bdk-styregruppearbejde",
            "bdk-portefoljekontor-governance",
            "bdk-projektindstilling-og-finansiering",
            "bdk-risk-profile",
            "grill-with-docs",
        ],
        "capabilities": [
            "strategisk engineering-ledelse",
            "sourcing- og procurement-strategi",
            "contract management framework",
            "interface management model",
            "governance og beslutningsoplæg",
        ],
    },
    {
        "id": "hassan-dahir",
        "name": "Hassan Dahir",
        "role": "Technical Interface & Product Owner / Fagprojektleder / Byggeleder / Fagtilsyn",
        "category": "Teknik og udførelse",
        "avatar": "Avatar/2_Avatar_Agent_Hassan_Dahir_Technical_Interface_Product_Owner.png",
        "accent": "orange",
        "skills": [
            "karpathy-guidelines",
            "shared-quality",
            "shared-docx",
            "bdk-brand-governance",
            "bdk-gdpr-praksis",
            "bbtr-tvaerfaglig-koordinering",
            "bbtr-fagpakkestruktur",
            "bbtr-leverance-mapping",
            "bbtr-dokumentstyring",
            "bbtr-risiko-myndighed",
            "bbtr-kvalitet-dod",
            "bbtr-csm-tsi-compliance",
            "bdk-bkp-v17-overview",
            "bdk-bkp-v17-data-model",
            "bdk-trafikale-regler-anvendelse",
            "bdk-projektrapportering-frister",
            "bdk-styregruppearbejde",
            "bdk-forbedringsloop",
        ],
        "capabilities": [
            "fagprojektledelse",
            "fagtilsyn og kvalitetskontrol",
            "byggeledelse og udførelse",
            "afløbsteknik og kloak",
            "product ownership BaneByg",
            "interface management",
            "tværfaglig koordinering",
        ],
    },
]

for agent in NEW_AGENTS:
    roster.append(agent)
    print(f"Added to roster: {agent['id']}")

ROSTER_PATH.write_text(json.dumps(roster, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Roster now has {len(roster)} agents")
