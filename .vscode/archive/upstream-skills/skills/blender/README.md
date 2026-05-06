# Blender 3D Modeling Expert Skill

## Installation

### For OpenClaw/HassanDigitalTwin System

1. **Upload to Project Knowledge**:
   - Upload all files in this directory to Project Knowledge section
   - The skill will auto-activate when Blender/3D topics are discussed

2. **Files to Upload**:
   ```
   blender-skill/
   ├── SKILL.md                    # Main skill definition
   ├── parametric-modeling.md      # Parametric modeling guide
   ├── material-library.md         # Material library reference
   └── README.md                   # This file
   ```

3. **Verification**:
   - Ask Claude: "Do you have Blender skills?"
   - Claude should acknowledge Blender MCP integration capabilities

### Prerequisites

- Blender 5.0+ installed with MCP server running
- MCP Blender server properly configured
- Optional: API keys for PolyHaven, Sketchfab, Hyper3D, Hunyuan3D

## Quick Start

### Example 1: Simple Parametric Model
```
User: "Create a parametric box 2m × 1.5m × 1m in Blender"

Claude will:
1. Check scene status
2. Create parametric Python script
3. Execute with verification
4. Take screenshot
5. Document dimensions
```

### Example 2: Engineering Cross-Section
```
User: "Create railway track cross-section with these specs:
- Track gauge: 1.435m
- Ballast depth: 0.30m
- Formation width: 3.0m"

Claude will:
1. Extract verified dimensions
2. Mark any TBD parameters
3. Create layered model
4. Apply realistic materials
5. Setup cutaway view
6. Validate all dimensions
```

### Example 3: Asset Integration
```
User: "Add a concrete texture from PolyHaven to this surface"

Claude will:
1. Search PolyHaven for concrete textures
2. Show options
3. Download selected texture
4. Apply to object
```

## Skill Capabilities

### ✓ Parametric Modeling
- Dimension-driven designs
- Source verification
- TBD parameter management
- Automatic validation

### ✓ Professional Materials
- Realistic material library
- PBR setup
- Transparent cutaways
- Engineering colors

### ✓ Technical Documentation
- Organized collections
- Camera setup
- Screenshot capture
- Dimension reports

### ✓ Asset Integration
- PolyHaven (HDRIs, textures, models)
- Sketchfab (3D models)
- Hyper3D Rodin (AI generation)
- Hunyuan3D (AI generation)

## Usage Patterns

### Pattern 1: Source-Verified Model
```python
# User provides specifications from technical drawing
# Claude creates model with verification:

# SOURCE VERIFIED ✓
WIDTH = 2.0   # [m] Drawing ABC-123
HEIGHT = 1.5  # [m] Drawing ABC-123

# TBD ASSUMED
DEPTH = 1.0   # [m] ANTAGET - Not in source
```

### Pattern 2: Infrastructure Visualization
```python
# Claude creates layered infrastructure:
- Organized collections (01_Surface, 02_Base, 03_Drainage)
- Realistic materials per layer
- Transparent cutaway for education
- Dimension validation
```

### Pattern 3: Iterative Refinement
```python
# Claude provides adjustment instructions:
"To modify ballast depth:
1. Locate BALLAST_DEPTH = 0.30 at top of script
2. Change value
3. Re-run script (Alt+P)"
```

## Best Practices

### DO:
✓ Provide source documentation for dimensions
✓ Request realistic materials
✓ Ask for dimension validation
✓ Request screenshots for verification
✓ Use organized collection structure

### DON'T:
✗ Expect Claude to fabricate dimensions
✗ Skip source verification
✗ Use without checking viewport shading
✗ Ignore TBD parameter warnings
✗ Mix different unit systems

## Troubleshooting

### Issue: "Materials not visible"
**Solution**: Switch viewport to Material Preview (Z-menu)

### Issue: "Dimensions don't match source"
**Solution**: Check console output for validation report

### Issue: "Blender tools not working"
**Solution**: Verify MCP Blender server is running

### Issue: "Asset download fails"
**Solution**: Check API status, verify internet connection

## Advanced Features

### Generative AI Integration
```
User: "Generate a 3D chair model from this description: modern wooden dining chair"

Claude will:
1. Check Hyper3D/Hunyuan3D status
2. Submit generation request
3. Poll for completion
4. Import generated model
5. Scale appropriately
```

### Multi-Source Projects
```
User: "Create railway project with:
- Track from specifications
- Terrain from real-world data  
- Structures from photo references"

Claude will:
1. Model track parametrically
2. Import/model terrain
3. Use AI generation for structures
4. Integrate all sources
5. Provide unified scene
```

## Quality Checklist

Before completing any Blender task:
- [ ] All source dimensions verified with ✓
- [ ] TBD parameters explicitly marked
- [ ] Validation report generated
- [ ] Collections organized logically
- [ ] Materials realistic and named properly
- [ ] Camera positioned optimally
- [ ] Screenshot taken
- [ ] Adjustment instructions provided

## Support & Updates

### Getting Help
1. Ask Claude: "How do I [specific Blender task]?"
2. Request: "Show me the Blender skill documentation"
3. Check: Project Knowledge for latest files

### Updating Skill
1. Upload new/modified files to Project Knowledge
2. Skill updates automatically
3. Verify with test query

## Version History

**v1.0** (2026-02-15)
- Initial release
- Parametric modeling
- Material library
- MCP integration
- AI generation support

---

**Maintained by**: OpenClaw Development Team  
**Compatible with**: Blender 5.0+, MCP Blender Server  
**Status**: Production Ready ✓
