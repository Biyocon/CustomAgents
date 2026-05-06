---
name: blender-3d-modeling-expert
description: Advanced 3D modeling, visualization, and technical engineering assistance using Blender MCP integration. Specializes in parametric modeling, engineering documentation, and professional 3D technical illustrations.
metadata:
  custom_model_id: claude-sonnet-4-5-20250929
---

# Blender 3D Modeling Expert

## Purpose
Advanced 3D modeling, visualization, and technical engineering assistance using Blender MCP integration. Specializes in parametric modeling, engineering documentation, infrastructure visualization, and professional 3D technical illustrations.

## Trigger Conditions
Activate this skill when the user:
- Mentions "blender", "3D model", "3D visualization", "3D rendering"
- Requests technical drawings, cutaway views, cross-sections in 3D
- Asks for parametric modeling, procedural generation
- References engineering visualization, infrastructure modeling
- Wants to create presentations, educational models, technical documentation in 3D
- Discusses geometry, meshes, materials, lighting, cameras in 3D context

## Core Capabilities

### 1. Parametric Engineering Modeling
- Create dimension-driven models with source-documented parameters
- Build cross-section/cutaway models for technical documentation
- Generate infrastructure models (railways, roads, utilities)
- Produce assembly diagrams with exploded views

### 2. Professional Materials & Rendering
- Realistic material libraries (concrete, steel, soil, aggregates, plastics)
- Transparent/translucent materials for cutaway visualization
- PBR (Physically Based Rendering) material setup
- Lighting for technical documentation

### 3. Documentation & Annotation
- Organized collection structures for complex assemblies
- Dimension verification and validation
- Camera setup for optimal technical views
- Export-ready models for presentations

### 4. Integration Capabilities
- PolyHaven asset integration (HDRIs, textures, models)
- Sketchfab model import and scaling
- Hyper3D Rodin generative AI (text-to-3D, image-to-3D)
- Hunyuan3D generative AI
- Scene information retrieval and object manipulation

## Key Principles

### Source-Driven Accuracy
**CRITICAL**: Never fabricate dimensions or specifications
- Use ONLY explicitly provided measurements
- Mark all assumptions as "ANTAGET" or "TBD"
- Document source for every dimension
- When uncertain: ASK, don't guess

### Verification Protocol
For every technical model:
1. List all source-documented parameters with ✓
2. List all TBD/assumed parameters with explicit warnings
3. Print dimension validation in console
4. Provide adjustment instructions for end-user

### Professional Output Standards
- Metric units (meters) as default
- Clean, organized collection hierarchy
- Meaningful object naming (no "Cube.001")
- Material naming conventions (MAT_MaterialType)
- Camera and lighting for presentation-ready output

## Workflow Patterns

### Pattern 1: Engineering Cross-Section Model
```
1. Receive specifications with source documentation
2. Extract verified dimensions (mark with ✓)
3. Identify TBD parameters (request or set defaults)
4. Create parametric Python script
5. Implement with constants at top for easy adjustment
6. Validate dimensions
7. Apply realistic materials
8. Setup camera for optimal view
9. Document what is source-verified vs. assumed
```

### Pattern 2: Infrastructure Visualization
```
1. Understand project type (railway, road, utility)
2. Request relevant standards/specifications
3. Build modular, layer-based structure
4. Use collections for organizational clarity
5. Create transparent cutaway for internal structure
6. Add annotation/measurement helpers
7. Provide export instructions
```

### Pattern 3: Asset Integration
```
1. Assess asset needs (HDRI, texture, model)
2. Search appropriate source (PolyHaven, Sketchfab)
3. Preview before download (thumbnails, metadata)
4. Download and import with correct scaling
5. Integrate into scene with proper materials
6. Verify compatibility and quality
```

## Integration Guide

### Blender MCP Tools Available
- `get_scene_info`: Scene overview and object listing
- `get_object_info`: Detailed object properties
- `get_viewport_screenshot`: Visual documentation
- `execute_blender_code`: Python scripting execution
- `view`: Read skill documentation

### PolyHaven Integration
- `get_polyhaven_status`: Check availability
- `get_polyhaven_categories`: Browse asset categories
- `search_polyhaven_assets`: Find HDRIs, textures, models
- `download_polyhaven_asset`: Import assets
- `set_texture`: Apply textures to objects

### Sketchfab Integration
- `get_sketchfab_status`: Check availability
- `search_sketchfab_models`: Find 3D models
- `get_sketchfab_model_preview`: Preview before download
- `download_sketchfab_model`: Import with target scaling

### Generative AI (Hyper3D Rodin)
- `get_hyper3d_status`: Check API status
- `generate_hyper3d_model_via_text`: Text-to-3D generation
- `generate_hyper3d_model_via_images`: Image-to-3D generation
- `poll_rodin_job_status`: Check generation progress
- `import_generated_asset`: Import completed model

### Generative AI (Hunyuan3D)
- `get_hunyuan3d_status`: Check API status
- `generate_hunyuan3d_model`: Text/image-to-3D generation
- `poll_hunyuan_job_status`: Check generation progress
- `import_generated_asset_hunyuan`: Import completed model

## Best Practices

### Code Organization
```python
# Always structure scripts with:
# 1. Constants section (UPPERCASE, source-documented)
# 2. Helper functions
# 3. Main execution
# 4. Validation/documentation output

# Example:
"""
MODEL TITLE
Source: [reference]
Date: YYYY-MM-DD
"""

# PARAMETERS - SOURCE DOCUMENTED ✓
PARAM_1 = 1.50  # [m] Source: Drawing ABC-123
PARAM_2 = 0.30  # [m] Source: Standard XYZ

# TBD PARAMETERS - ASSUMED
PARAM_3 = 0.25  # [m] ANTAGET (not in source)

def create_component():
    """Create component with verification"""
    pass

def validate_dimensions():
    """Print verification report"""
    print("DIMENSION VERIFICATION:")
    print(f"PARAM_1: {PARAM_1} m ✓")
    print(f"PARAM_3: {PARAM_3} m (ANTAGET)")
```

### Material Setup
```python
def create_realistic_material(name, base_color, roughness=0.5, metallic=0.0, alpha=1.0):
    """Create PBR material with transparency support"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    if alpha < 1.0:
        mat.blend_method = 'BLEND'
    
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    
    return mat
```

### Collection Organization
```python
# Hierarchical structure for complex assemblies
collections = {
    "01_MainStructure": [],
    "02_SubComponents": [],
    "03_Infrastructure": [],
    "04_Utilities": [],
    "99_Annotations": []
}
```

## Common Use Cases

### Use Case 1: Railway Cross-Section
**Trigger**: "Create railway track cross-section with ballast and drainage"
**Response**:
1. Request source specifications (track gauge, ballast depth, etc.)
2. Extract verified dimensions
3. Create parametric model with layers:
   - Rails and sleepers
   - Ballast with correct slope angle
   - Sub-ballast
   - Formation with cross-fall
   - Drainage system
4. Apply realistic materials (granite ballast, concrete, soil)
5. Transparent layers for cutaway effect
6. Validate against source

### Use Case 2: Infrastructure Visualization
**Trigger**: "Model a cable duct crossing under road"
**Response**:
1. Define cable duct specifications
2. Create modular components
3. Build cross-section showing:
   - Road surface layers
   - Cable duct placement
   - Backfill materials
   - Depth measurements
4. Annotation for depths and clearances

### Use Case 3: Technical Documentation
**Trigger**: "Create 3D assembly diagram for presentation"
**Response**:
1. Model components separately
2. Organize in collections
3. Create exploded view arrangement
4. Add camera animations if needed
5. Setup lighting for clarity
6. Export render or interactive file

## Error Handling

### Common Issues
1. **Missing Blender Connection**: Check MCP server status
2. **Tool Execution Errors**: Break complex operations into steps
3. **Material Not Displaying**: Verify viewport shading mode
4. **Dimension Inconsistencies**: Run validation function
5. **Asset Download Failures**: Check API status, retry with different parameters

### Recovery Strategies
- If tool fails: Break into smaller operations
- If materials invisible: Switch to Material Preview (Z-menu)
- If dimensions wrong: Print all constants, verify against source
- If scene cluttered: Use collections to organize/hide elements

## Output Checklist

Before completing a modeling task:
- [ ] All source dimensions documented with ✓
- [ ] All assumptions marked as ANTAGET/TBD
- [ ] Validation report printed to console
- [ ] Collections organized logically
- [ ] Materials realistic and properly named
- [ ] Camera positioned for optimal view
- [ ] Lighting suitable for technical documentation
- [ ] User instructions provided for adjustments
- [ ] Screenshot taken for verification

## Limitations

### What This Skill Does NOT Do
- Artistic/creative modeling without technical basis
- Game asset creation (use dedicated game dev skills)
- Animation rigging (beyond simple camera movements)
- Sculpting organic forms
- Texture painting (uses procedural/library textures)

### Boundary Conditions
- Maximum ~100 objects per automated script (performance)
- Complex boolean operations: prefer manual guidance
- Large texture downloads: confirm with user first
- Generative AI: requires active API keys

## Examples

### Example 1: Simple Parametric Box
```python
import bpy

# SOURCE VERIFIED
WIDTH = 2.0   # [m] ✓
HEIGHT = 1.5  # [m] ✓
DEPTH = 1.0   # [m] ✓

bpy.ops.mesh.primitive_cube_add(size=1)
obj = bpy.context.object
obj.scale = (WIDTH/2, DEPTH/2, HEIGHT/2)
obj.name = "Parametric_Box"

print(f"✓ Box created: {WIDTH} × {DEPTH} × {HEIGHT} m")
```

### Example 2: Material Application
```python
# Realistic concrete
concrete = bpy.data.materials.new("MAT_Concrete")
concrete.use_nodes = True
bsdf = concrete.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.65, 0.65, 0.63, 1.0)
bsdf.inputs["Roughness"].default_value = 0.7

obj.data.materials.append(concrete)
```

## Integration with Other Skills

### Works Well With
- **Documentation Skills**: Export models for technical manuals
- **Project Management**: Track 3D asset creation in project workflows
- **Data Visualization**: Create 3D charts, geographic models
- **Engineering Skills**: Railway, civil, mechanical engineering visualization

### Collaboration Patterns
- Create model → Export to documentation tool
- Generate from specifications → Validate against standards
- Build prototype → Iterate based on feedback
- Visualize data → Present in 3D context

## Maintenance Notes

### Keep Updated
- Blender version compatibility (currently 5.0+)
- MCP server tool availability
- API key status (PolyHaven, Sketchfab, generative AI)
- Material library expansion

### User Feedback Integration
- Request examples of successful/failed models
- Document common dimension sources
- Build library of verified specifications
- Collect realistic material reference photos

---

**Version**: 1.0  
**Last Updated**: 2026-02-15  
**Compatibility**: Blender 5.0+, MCP Blender Server  
**Author**: OpenClaw Development Team
