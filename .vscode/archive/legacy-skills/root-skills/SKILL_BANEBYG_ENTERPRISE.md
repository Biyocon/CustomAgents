# Banebyg Enterprise Udvikling - Skill

## FormÃ¥l
Denne skill hjÃ¦lper med teknisk udvikling, arkitektur og implementation af Banebyg Enterprise platformen - SharePoint/PowerApps lÃ¸sningen til BKP hÃ¥ndtering.

## HvornÃ¥r bruges denne skill
- NÃ¥r du udvikler nye features til Banebyg Enterprise
- NÃ¥r du designer arkitektur og datamodeller
- NÃ¥r du troubleshooter tekniske problemer
- NÃ¥r du skal integrere med SharePoint, Office 365 eller andre systemer
- NÃ¥r du har brug for code review eller best practices

## Teknologi Stack

### Platform
```
SharePoint Online (SPO)
â”œâ”€ Lists (master data storage)
â”œâ”€ Document Libraries (bilag, outputs)
â”œâ”€ Sites (projekt arbejdsomrÃ¥der)
â””â”€ Metadata (taxonomies, content types)

PowerApps
â”œâ”€ Canvas Apps (fleksibel UI)
â”œâ”€ Model-driven Apps (data-centric)
â””â”€ Power Fx (formula language)

Power Automate
â”œâ”€ Workflows (godkendelser, notifikationer)
â”œâ”€ Scheduled Flows (batch jobs)
â””â”€ Integration (document generation)

Office 365
â”œâ”€ Word (templates, mail merge)
â”œâ”€ Excel (tilbudsliste outputs)
â””â”€ Microsoft Graph API
```

### Development Environment
- **Visual Studio Code** med extensions
- **Power Platform CLI** til deployment
- **Git** version control
- **Azure DevOps** / **GitHub** til CI/CD

## Arkitektur Principper

### 1. Favor Standard Over Custom
```
Brug OOTB (Out-of-the-box) nÃ¥r muligt:
âœ… SharePoint standard lists og views
âœ… PowerApps standard controls
âœ… Power Automate standard connectors
âœ… Office templates

Kun custom code nÃ¥r:
âš ï¸ Kompleks forretningslogik ikke kan lÃ¸ses OOTB
âš ï¸ Performance kritisk
âš ï¸ Unik integration behov
```

### 2. Separation of Concerns
```
Presentation Layer (PowerApps)
â””â”€ UI/UX
â””â”€ User input validation
â””â”€ Display formatting

Business Logic Layer (Power Automate / SharePoint)
â””â”€ Workflows
â””â”€ Beregninger
â””â”€ Validering

Data Layer (SharePoint Lists / Dataverse)
â””â”€ Storage
â””â”€ Relationships
â””â”€ Security
```

### 3. API-First Thinking
```
Selv intern funktionalitet designes som API:
- GÃ¸r det nemmere at teste
- MuliggÃ¸r genbrug
- Simplificerer integration
- Tillader fremtidige mobile apps
```

## Datamodel

### Core Entities

#### Fagpost List
```typescript
FagpostList {
  ID: number (auto)
  Title: string (single line text)
  Nummer: string (calculated: "X.0")
  Beskrivelse: string (multiple lines, rich text)
  Status: choice (Aktiv | UdgÃ¥et | Under revision)
  Version: string (e.g., "17.1")
  SidstOpdateret: datetime
  OpdateretAf: person
  Bilag: attachments
}

// Indexes
- Nummer (unique)
- Status
```

#### Hovedpost List
```typescript
HovedpostList {
  ID: number (auto)
  Title: string
  Nummer: string (calculated: "X.Y")
  FagpostID: lookup (FagpostList)
  Beskrivelse: string (rich text)
  SortOrder: number
  Status: choice
  Bilag: attachments
}

// Indexes  
- FagpostID, SortOrder
- Nummer (unique)
```

#### Post List
```typescript
PostList {
  ID: number (auto)
  Title: string
  Nummer: string (calculated: "X.Y.Z")
  HovedpostID: lookup (HovedpostList)
  FagpostID: lookup (FagpostList) // denormalized for performance
  Enhed: choice (stk | m | m2 | m3 | kg | ton | ...)
  Beskrivelse: string (rich text)
  SortOrder: number
  Status: choice
}

// Indexes
- HovedpostID, SortOrder
- FagpostID
- Nummer (unique)
```

#### Underpost List
```typescript
UnderpostList {
  ID: number (auto)
  Title: string
  Nummer: string (calculated: "X.Y.Z.Ã†")
  PostID: lookup (PostList)
  Beskrivelse: string (rich text)
  SortOrder: number
  Status: choice
}
```

#### Kontrolpunkt List
```typescript
KontrolpunktList {
  ID: number (auto)
  Title: string
  Nummer: string (linked to post: "X.Y.Z")
  PostID: lookup (PostList)
  Kontroltype: choice (IK | TK | EK)
  Tidspunkt: choice (FÃ¸r | Under | Efter)
  Ansvarlig: choice (E | BH | BL | FT | Ã˜)
  Dokumentation: string (multi line)
  Kilde: choice (TKP | KP | Projektspecifik)
  Reference: string (e.g., "BN-5.9")
  Status: choice (Aktiv | UdgÃ¥et)
}
```

#### Udbud List (project instances)
```typescript
UdbudList {
  ID: number (auto)
  Title: string (project name)
  ProjektID: string (unique identifier)
  SharePointSiteURL: url
  Status: choice (Kladde | Under udarbejdelse | Til godkendelse | Godkendt | Arkiveret)
  Oprettet: datetime
  OprettetAf: person
  SidstÃ†ndret: datetime
  Version: string
}
```

#### UdbudPost List (many-to-many)
```typescript
UdbudPostList {
  ID: number (auto)
  UdbudID: lookup (UdbudList)
  PostID: lookup (PostList)
  MÃ¦ngde: number
  Stadie: choice (Eksisterende | Projekt | Total)
  ProjektKommentar: string (multi line)
  Valgt: boolean (default true)
}
```

### Relationships
```
Fagpost (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) Hovedpost
Hovedpost (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) Post
Post (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) Underpost
Post (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) Kontrolpunkt

Udbud (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) UdbudPost
Post (1) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€< (many) UdbudPost
```

## PowerApps Best Practices

### 1. Performance
```powerapps
// âŒ BAD - Loads all rows
Set(varAllPosts, PostList)

// âœ… GOOD - Delegation-aware query
ClearCollect(
    colPosts,
    Filter(
        PostList,
        FagpostID = varSelectedFagpost.ID
    )
)

// âœ… EVEN BETTER - With explicit columns
ClearCollect(
    colPosts,
    AddColumns(
        Filter(PostList, FagpostID = varSelectedFagpost.ID),
        "FagpostNavn", LookUp(FagpostList, ID = FagpostID).Title
    )
)
```

### 2. Error Handling
```powerapps
// âœ… GOOD - Wrapped in IfError
IfError(
    Patch(
        PostList,
        Defaults(PostList),
        {
            Title: txtTitle.Text,
            Nummer: txtNummer.Text
        }
    ),
    Notify("Fejl ved oprettelse: " & FirstError.Message, NotificationType.Error),
    Notify("Post oprettet succesfuldt", NotificationType.Success);
    Navigate(scrPostOversigt)
)
```

### 3. Naming Conventions
```
Variables:
  - Global: varGlobalPosts
  - Context: locCurrentPost
  - Collections: colSelectedItems

Controls:
  - Button: btnSave, btnCancel
  - TextInput: txtTitle, txtDescription
  - Label: lblHeader, lblError
  - Gallery: galPosts, galKontrolpunkter
  - Dropdown: ddFagpost, ddStatus
```

### 4. Reusable Components
```
Opret components for:
- Postnummerering display
- Status badges
- Godkendelses flows
- Error notifications
- Loading spinners
```

## Power Automate Workflows

### 1. Document Generation Flow
```
Trigger: Manual trigger from PowerApp (UdbudID)
â†“
Get Udbud Details (SharePoint)
â†“
Get Related Posts (SharePoint - expand lookups)
â†“
Get Templates from Library
â†“
Word Online: Populate Template (mail merge)
â†“
Convert to PDF (if required)
â†“
Upload to SharePoint Site (Udbud specific)
â†“
Update Udbud Status
â†“
Send Email Notification
```

### 2. Approval Workflow
```
Trigger: When Udbud Status = "Til godkendelse"
â†“
Start Approval (to Projektleder)
â†“
Condition: Approved?
  â”œâ”€ Yes â†’ Update Status to "Godkendt"
  â”‚         Send notification to Oprettet Af
  â”‚         Archive documents
  â””â”€ No  â†’ Update Status to "Under udarbejdelse"
            Send notification with comments
            Log rejection reason
```

### 3. Scheduled Sync Flow
```
Trigger: Daily at 02:00
â†“
Get All Active Udbud
â†“
For Each Udbud:
  â”œâ”€ Sync to SharePoint Site
  â”œâ”€ Validate data integrity
  â”œâ”€ Update Last Sync timestamp
  â””â”€ Log any errors
â†“
Send Summary Email (if errors)
```

## Integration Patterns

### SharePoint REST API
```typescript
// GET posts for fagpost
const url = `${siteUrl}/_api/web/lists/getbytitle('PostList')/items?` +
  `$filter=FagpostID eq ${fagpostId}&` +
  `$select=ID,Title,Nummer,Beskrivelse&` +
  `$orderby=SortOrder&` +
  `$top=5000`;

const response = await fetch(url, {
  headers: {
    'Accept': 'application/json;odata=verbose',
    'Authorization': 'Bearer ' + accessToken
  }
});

const data = await response.json();
const posts = data.d.results;
```

### Microsoft Graph API
```typescript
// Create Word document from template
const url = 'https://graph.microsoft.com/v1.0/me/drive/items/{templateId}/copy';

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify({
    name: 'BKP_V17_Udbud_' + udbudId + '.docx',
    parentReference: {
      driveId: destinationDriveId,
      id: destinationFolderId
    }
  })
});
```

## Security & Permissions

### SharePoint Permission Levels
```
Site Owner (Full Control):
- System administrators
- BaneByg Enterprise ejere

Site Member (Contribute):
- Projektledere
- Byggeledere
- Projektmedarbejdere

Site Visitor (Read):
- Alle medarbejdere
- Eksterne interessenter (specifikt tildelt)
```

### Item-Level Security
```javascript
// âœ… GOOD - Break inheritance and set specific permissions
const itemId = 123;

// Break role inheritance
await sp.web.lists.getByTitle('UdbudList')
  .items.getById(itemId)
  .breakRoleInheritance(false); // false = don't copy existing permissions

// Add specific user/group
await sp.web.lists.getByTitle('UdbudList')
  .items.getById(itemId)
  .roleAssignments.add(principalId, roleDefId);
```

### Data Validation in PowerApps
```powerapps
// Input validation
If(
    IsBlank(txtMÃ¦ngde.Text) Or Not(IsNumeric(txtMÃ¦ngde.Text)),
    Notify("MÃ¦ngde skal vÃ¦re et tal", NotificationType.Error);
    false,
    
    Value(txtMÃ¦ngde.Text) < 0,
    Notify("MÃ¦ngde kan ikke vÃ¦re negativ", NotificationType.Error);
    false,
    
    // All good
    true
)
```

## Testing Strategy

### Unit Testing (PowerApps Test Studio)
```
Test Suite: PostCRUD
â”œâ”€ Test: CreatePost_Success
â”‚  â””â”€ Given empty form
â”‚  â””â”€ When valid input
â”‚  â””â”€ Then post created
â”‚
â”œâ”€ Test: CreatePost_MissingTitle
â”‚  â””â”€ Given empty title
â”‚  â””â”€ When save clicked
â”‚  â””â”€ Then error shown
â”‚
â””â”€ Test: UpdatePost_Success
   â””â”€ Given existing post
   â””â”€ When fields changed
   â””â”€ Then changes saved
```

### Integration Testing
```
Test Suite: DocumentGeneration
â”œâ”€ Test: Generate_Tilbudsliste_Success
â”‚  â””â”€ Given udbud with 10 posts
â”‚  â””â”€ When generate clicked
â”‚  â””â”€ Then Excel created correctly
â”‚
â””â”€ Test: Generate_BKP_Dokument_Success
   â””â”€ Given udbud with all fagposter
   â””â”€ When generate clicked
   â””â”€ Then Word/PDF created correctly
```

### Performance Testing
```
Metrics to measure:
- App load time (target: <3s)
- Gallery load (1000 items, target: <5s)
- Form save operation (target: <2s)
- Document generation (250 posts, target: <30s)
```

## Troubleshooting

### Common Issues

#### 1. Delegation Warning
```
Problem: 
Gallery shows warning "Delegation warning. This formula might not work..."

Solution:
âœ… Use delegation-friendly functions: Filter, Search, Sort, SortByColumns
âŒ Avoid: CountRows, Sum, Average on large datasets directly

// Instead of
CountRows(Filter(PostList, Status = "Aktiv"))

// Do
CountRows(Filter(PostList, Status = "Aktiv")) // If <500 items
// Or use pre-calculated field in SP list
```

#### 2. Timeout on Document Generation
```
Problem:
Power Automate flow times out when generating large documents

Solution:
âœ… Batch processing (generate sections, then merge)
âœ… Async flow with notification
âœ… Optimize Word template (simpler formatting)
âœ… Limit concurrent runs

Settings in Flow:
- Timeout: Increase to 30 min (premium)
- Concurrency: Set to 1 for resource-heavy operations
```

#### 3. Permission Denied
```
Problem:
User cannot access certain items despite having site permissions

Solution:
1. Check item-level permissions (unique vs inherited)
2. Verify user is in correct SharePoint group
3. Check PowerApps permissions (connections must be shared)
4. Validate Power Automate run-as account

// Check in PowerShell
Get-PnPListItem -List "PostList" -Id 123 -Fields HasUniqueRoleAssignments
```

## Deployment

### Environment Strategy
```
Development (DEV)
â”œâ”€ Udvikling og test
â”œâ”€ Daily builds
â””â”€ Fuld adgang for udviklere

Test (TEST/UAT)
â”œâ”€ User acceptance testing
â”œâ”€ Integration testing
â””â”€ Adgang for test brugere og PO

Produktion (PROD)
â”œâ”€ Live system
â”œâ”€ Kun godkendte releases
â””â”€ Adgang kun for support
```

### CI/CD Pipeline
```yaml
# Azure DevOps pipeline example
trigger:
  - main

stages:
  - stage: Build
    jobs:
      - job: ExportSolution
        steps:
          - task: PowerPlatformExportSolution@2
          - task: PowerPlatformUnpackSolution@2
          - task: PublishBuildArtifacts@1

  - stage: DeployToTest
    dependsOn: Build
    jobs:
      - deployment: DeployTest
        environment: Test
        steps:
          - task: PowerPlatformPackSolution@2
          - task: PowerPlatformImportSolution@2
          - task: RunTestSuite@1

  - stage: DeployToProd
    dependsOn: DeployToTest
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProd
        environment: Production
        steps:
          - task: PowerPlatformImportSolution@2
          - task: SmokeTest@1
```

## Monitoring & Logging

### PowerApps Analytics
```
Track:
- Daily active users
- App load time
- Error rate
- Feature usage (which screens)
- Device breakdown (desktop vs mobile)

Available in:
Power Platform Admin Center > Analytics > PowerApps
```

### Power Automate Run History
```
Monitor:
- Success rate per flow
- Average duration
- Failure patterns (time of day, specific inputs)

Set up:
- Email alerts on flow failure
- Daily summary report
- Slack/Teams notification (via webhook)
```

### Application Insights (Advanced)
```
For custom tracking:
1. Create Application Insights resource in Azure
2. Use HTTP connector from PowerApps/Flows
3. Send custom telemetry

Example:
POST https://dc.services.visualstudio.com/v2/track
{
  "name": "Microsoft.ApplicationInsights.Event",
  "time": "2025-10-28T10:30:00Z",
  "data": {
    "baseType": "EventData",
    "baseData": {
      "name": "UdbudCreated",
      "properties": {
        "UdbudID": "12345",
        "PostCount": 150
      }
    }
  }
}
```

## Code Review Checklist

NÃ¥r du reviewer kode/formler:

**Funktionalitet:**
- [ ] LÃ¸ser det det rigtige problem?
- [ ] Edge cases hÃ¥ndteret? (tomme inputs, 0, null, negative)
- [ ] Error handling implementeret?

**Performance:**
- [ ] Delegation venlig? (ingen warnings)
- [ ] UnÃ¸dvendige loops undgÃ¥et?
- [ ] Collections brugt effektivt?

**Sikkerhed:**
- [ ] Input validering?
- [ ] Permissions tjekket?
- [ ] Ingen hardcoded secrets?

**Vedligehold:**
- [ ] Navngivning konsistent og meningsfuld?
- [ ] Kommentarer hvor nÃ¸dvendigt?
- [ ] Kompleksitet acceptabel? (opdel komplekse funktioner)

**User Experience:**
- [ ] Loading states? (spinnere)
- [ ] Feedback til bruger? (notifications)
- [ ] Responsivt design? (desktop + mobile)

## Best Practices Summary

### PowerApps
1. **Favor Collections over direct connectors** for better performance
2. **Use named formulas** (Power Fx) to DRY up code
3. **Component-first** thinking for reusability
4. **Test on actual devices** (desktop + mobile)
5. **Implement proper error handling** (IfError, Notify)

### Power Automate
1. **Scope actions** for better readability and error handling
2. **Use variables sparingly** (compose actions when possible)
3. **Implement retry policies** for external integrations
4. **Terminate flows explicitly** (don't leave hanging)
5. **Comment complex logic** for future maintainers

### SharePoint
1. **Index all lookup/query columns** for performance
2. **Use content types** for structured data
3. **Set item limits** appropriately (5000 threshold)
4. **Document calculated formulas** in column description
5. **Regular cleanup** of old/unused items

## NÃ¥r du skal bruge denne skill

Claude skal automatisk bruge denne skill nÃ¥r:
- Brugeren nÃ¦vner teknisk udvikling, PowerApps, SharePoint, eller Power Automate
- Brugeren beder om hjÃ¦lp til fejlfinding eller troubleshooting
- Brugeren spÃ¸rger om arkitektur eller datamodeller
- Brugeren har brug for code review
- Brugeren skal integrere systemer

**Start med:** "Jeg bruger Banebyg Enterprise Udvikling skill til at hjÃ¦lpe dig..."

---

*Denne skill opdateres lÃ¸bende med best practices og nye learnings fra udviklingen.*