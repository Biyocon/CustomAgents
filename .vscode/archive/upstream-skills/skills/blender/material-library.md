# Material Library - Realistic Engineering Materials

## Overview
Pre-configured realistic materials for engineering and infrastructure visualization in Blender.

## Material Creation Template

```python
def create_material(name, base_color, roughness=0.5, metallic=0.0, alpha=1.0):
    """
    Create PBR material with standard setup
    
    Args:
        name: Material name (use MAT_ prefix)
        base_color: RGB tuple (0-1 range)
        roughness: 0=mirror, 1=completely diffuse
        metallic: 0=dielectric, 1=metal
        alpha: 1=opaque, 0=transparent
    """
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

## Construction Materials

### Concrete
```python
# New concrete (light gray)
MAT_Concrete_New = create_material(
    name="MAT_Concrete_New",
    base_color=(0.70, 0.70, 0.68),
    roughness=0.65,
    metallic=0.0,
    alpha=0.95
)

# Aged concrete (darker, weathered)
MAT_Concrete_Aged = create_material(
    name="MAT_Concrete_Aged",
    base_color=(0.50, 0.50, 0.48),
    roughness=0.75,
    metallic=0.0,
    alpha=0.95
)

# Railway sleepers (prestressed concrete)
MAT_Concrete_Sleeper = create_material(
    name="MAT_Concrete_Sleeper",
    base_color=(0.65, 0.65, 0.63),
    roughness=0.70,
    metallic=0.0,
    alpha=0.95
)
```

### Steel & Metals
```python
# Clean steel (polished)
MAT_Steel_Clean = create_material(
    name="MAT_Steel_Clean",
    base_color=(0.65, 0.65, 0.67),
    roughness=0.15,
    metallic=0.95,
    alpha=1.0
)

# Oxidized steel (weathered rails)
MAT_Steel_Oxidized = create_material(
    name="MAT_Steel_Oxidized",
    base_color=(0.35, 0.32, 0.30),
    roughness=0.40,
    metallic=0.70,
    alpha=1.0
)

# Galvanized steel
MAT_Steel_Galvanized = create_material(
    name="MAT_Steel_Galvanized",
    base_color=(0.75, 0.75, 0.78),
    roughness=0.25,
    metallic=0.85,
    alpha=1.0
)

# Rusty steel
MAT_Steel_Rusty = create_material(
    name="MAT_Steel_Rusty",
    base_color=(0.45, 0.25, 0.15),
    roughness=0.80,
    metallic=0.30,
    alpha=1.0
)
```

### Aggregates & Ballast
```python
# Granite ballast (gray-pink crushed stone)
MAT_Ballast_Granite = create_material(
    name="MAT_Ballast_Granite",
    base_color=(0.55, 0.50, 0.48),
    roughness=0.95,
    metallic=0.0,
    alpha=0.70  # Semi-transparent for cutaway
)

# Basalt ballast (dark gray)
MAT_Ballast_Basalt = create_material(
    name="MAT_Ballast_Basalt",
    base_color=(0.35, 0.35, 0.37),
    roughness=0.95,
    metallic=0.0,
    alpha=0.70
)

# Gravel (stabilized sub-base)
MAT_Gravel_Stabilized = create_material(
    name="MAT_Gravel_Stabilized",
    base_color=(0.52, 0.48, 0.38),
    roughness=0.90,
    metallic=0.0,
    alpha=0.70
)

# Sand (yellow-brown)
MAT_Sand = create_material(
    name="MAT_Sand",
    base_color=(0.70, 0.60, 0.45),
    roughness=0.95,
    metallic=0.0,
    alpha=0.70
)

# Concrete aggregate (0/8 for drainage)
MAT_Aggregate_Concrete = create_material(
    name="MAT_Aggregate_Concrete",
    base_color=(0.60, 0.60, 0.58),
    roughness=0.85,
    metallic=0.0,
    alpha=0.65
)
```

### Soil & Ground
```python
# Dark topsoil
MAT_Soil_Dark = create_material(
    name="MAT_Soil_Dark",
    base_color=(0.28, 0.22, 0.16),
    roughness=1.0,
    metallic=0.0,
    alpha=0.60
)

# Clay (yellowish-brown)
MAT_Soil_Clay = create_material(
    name="MAT_Soil_Clay",
    base_color=(0.45, 0.35, 0.25),
    roughness=0.95,
    metallic=0.0,
    alpha=0.60
)

# Sandy soil (lighter)
MAT_Soil_Sandy = create_material(
    name="MAT_Soil_Sandy",
    base_color=(0.55, 0.45, 0.35),
    roughness=0.95,
    metallic=0.0,
    alpha=0.60
)
```

### Plastics
```python
# Orange PVC drainage pipe
MAT_PVC_Orange = create_material(
    name="MAT_PVC_Orange",
    base_color=(0.85, 0.35, 0.05),
    roughness=0.30,
    metallic=0.0,
    alpha=0.90
)

# Black PE/HDPE pipe
MAT_PE_Black = create_material(
    name="MAT_PE_Black",
    base_color=(0.08, 0.08, 0.08),
    roughness=0.35,
    metallic=0.0,
    alpha=0.90
)

# Gray PVC conduit
MAT_PVC_Gray = create_material(
    name="MAT_PVC_Gray",
    base_color=(0.50, 0.50, 0.52),
    roughness=0.30,
    metallic=0.0,
    alpha=0.90
)
```

### Asphalt & Road Materials
```python
# New asphalt (dark black)
MAT_Asphalt_New = create_material(
    name="MAT_Asphalt_New",
    base_color=(0.12, 0.12, 0.12),
    roughness=0.85,
    metallic=0.0,
    alpha=1.0
)

# Aged asphalt (lighter gray)
MAT_Asphalt_Aged = create_material(
    name="MAT_Asphalt_Aged",
    base_color=(0.25, 0.25, 0.25),
    roughness=0.90,
    metallic=0.0,
    alpha=1.0
)

# Road marking paint (white)
MAT_Paint_White = create_material(
    name="MAT_Paint_White",
    base_color=(0.95, 0.95, 0.95),
    roughness=0.40,
    metallic=0.0,
    alpha=1.0
)

# Road marking paint (yellow)
MAT_Paint_Yellow = create_material(
    name="MAT_Paint_Yellow",
    base_color=(0.95, 0.85, 0.10),
    roughness=0.40,
    metallic=0.0,
    alpha=1.0
)
```

### Glass & Transparent
```python
# Clear glass
MAT_Glass_Clear = create_material(
    name="MAT_Glass_Clear",
    base_color=(0.95, 0.95, 0.95),
    roughness=0.05,
    metallic=0.0,
    alpha=0.15
)

# Frosted glass
MAT_Glass_Frosted = create_material(
    name="MAT_Glass_Frosted",
    base_color=(0.90, 0.90, 0.90),
    roughness=0.30,
    metallic=0.0,
    alpha=0.40
)
```

### Wood
```python
# Treated timber (light brown)
MAT_Wood_Treated = create_material(
    name="MAT_Wood_Treated",
    base_color=(0.55, 0.45, 0.30),
    roughness=0.70,
    metallic=0.0,
    alpha=1.0
)

# Weathered wood (gray)
MAT_Wood_Weathered = create_material(
    name="MAT_Wood_Weathered",
    base_color=(0.45, 0.45, 0.42),
    roughness=0.85,
    metallic=0.0,
    alpha=1.0
)
```

## Material Library Setup Function

```python
def setup_material_library():
    """Create complete material library for engineering visualization"""
    
    materials = {}
    
    # Concrete variants
    materials["Concrete_New"] = create_material("MAT_Concrete_New", (0.70, 0.70, 0.68), 0.65)
    materials["Concrete_Aged"] = create_material("MAT_Concrete_Aged", (0.50, 0.50, 0.48), 0.75)
    materials["Concrete_Sleeper"] = create_material("MAT_Concrete_Sleeper", (0.65, 0.65, 0.63), 0.70, alpha=0.95)
    
    # Steel variants
    materials["Steel_Clean"] = create_material("MAT_Steel_Clean", (0.65, 0.65, 0.67), 0.15, 0.95)
    materials["Steel_Oxidized"] = create_material("MAT_Steel_Oxidized", (0.35, 0.32, 0.30), 0.40, 0.70)
    materials["Steel_Galvanized"] = create_material("MAT_Steel_Galvanized", (0.75, 0.75, 0.78), 0.25, 0.85)
    
    # Aggregates
    materials["Ballast_Granite"] = create_material("MAT_Ballast_Granite", (0.55, 0.50, 0.48), 0.95, alpha=0.70)
    materials["Gravel"] = create_material("MAT_Gravel_Stabilized", (0.52, 0.48, 0.38), 0.90, alpha=0.70)
    materials["Aggregate_Concrete"] = create_material("MAT_Aggregate_Concrete", (0.60, 0.60, 0.58), 0.85, alpha=0.65)
    
    # Soil
    materials["Soil_Dark"] = create_material("MAT_Soil_Dark", (0.28, 0.22, 0.16), 1.0, alpha=0.60)
    materials["Soil_Clay"] = create_material("MAT_Soil_Clay", (0.45, 0.35, 0.25), 0.95, alpha=0.60)
    
    # Plastics
    materials["PVC_Orange"] = create_material("MAT_PVC_Orange", (0.85, 0.35, 0.05), 0.30, alpha=0.90)
    materials["PE_Black"] = create_material("MAT_PE_Black", (0.08, 0.08, 0.08), 0.35, alpha=0.90)
    
    # Asphalt
    materials["Asphalt_New"] = create_material("MAT_Asphalt_New", (0.12, 0.12, 0.12), 0.85)
    materials["Asphalt_Aged"] = create_material("MAT_Asphalt_Aged", (0.25, 0.25, 0.25), 0.90)
    
    print(f"✓ Material library created: {len(materials)} materials")
    return materials
```

## Material Application

### Apply to Object
```python
def apply_material(obj, material):
    """Apply material to object"""
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)
```

### Apply to Collection
```python
def apply_material_to_collection(collection_name, material):
    """Apply material to all objects in collection"""
    coll = bpy.data.collections.get(collection_name)
    if coll:
        for obj in coll.objects:
            if obj.type == 'MESH':
                apply_material(obj, material)
```

### Material by Name Pattern
```python
def apply_material_by_pattern(pattern, material):
    """Apply material to objects matching name pattern"""
    for obj in bpy.data.objects:
        if pattern.lower() in obj.name.lower() and obj.type == 'MESH':
            apply_material(obj, material)
```

## Color Reference Guide

### RGB Value Meanings
- **R, G, B range**: 0.0 (black) to 1.0 (white)
- **Roughness**: 0.0 (mirror) to 1.0 (matte)
- **Metallic**: 0.0 (plastic/stone) to 1.0 (pure metal)
- **Alpha**: 0.0 (invisible) to 1.0 (opaque)

### Common Infrastructure Colors
```
Concrete:       RGB(0.65-0.70, 0.65-0.70, 0.63-0.68)
Steel (clean):  RGB(0.65, 0.65, 0.67)
Steel (rust):   RGB(0.35, 0.32, 0.30)
Ballast:        RGB(0.55, 0.50, 0.48)
Dark soil:      RGB(0.28, 0.22, 0.16)
PVC orange:     RGB(0.85, 0.35, 0.05)
Asphalt:        RGB(0.12, 0.12, 0.12)
```

## Advanced Material Techniques

### Procedural Noise (Optional)
```python
def add_noise_texture(material, scale=5.0, strength=0.1):
    """Add subtle noise to material (requires node manipulation)"""
    mat = material
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Add noise texture
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs["Scale"].default_value = scale
    
    # Add color ramp
    ramp = nodes.new('ShaderNodeValToRGB')
    
    # Mix with base color
    mix = nodes.new('ShaderNodeMix')
    mix.data_type = 'RGBA'
    mix.inputs["Factor"].default_value = strength
    
    # Connect
    bsdf = nodes["Principled BSDF"]
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], mix.inputs["B"])
    # ... (requires more complex setup)
```

### Semi-Transparent Cutaway
```python
# For technical drawings showing internal structure
materials_cutaway = {
    "Ballast": create_material("MAT_Ballast", (0.55, 0.50, 0.48), 0.95, alpha=0.60),
    "Underballast": create_material("MAT_Underballast", (0.52, 0.48, 0.38), 0.90, alpha=0.60),
    "Planum": create_material("MAT_Planum", (0.28, 0.22, 0.16), 1.0, alpha=0.50),
}
```

## Viewport Display Settings

### Enable Material Preview
```python
# Set viewport shading to Material Preview
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.shading.type = 'MATERIAL'
```

### Enable Transparency in Viewport
```python
# Ensure alpha blend is visible
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.shading.type = 'MATERIAL'
                space.shading.use_scene_world = True
```

## Material Validation

```python
def validate_materials():
    """Check material setup"""
    issues = []
    
    for mat in bpy.data.materials:
        if not mat.use_nodes:
            issues.append(f"{mat.name}: Not using nodes")
        
        nodes = mat.node_tree.nodes
        if "Principled BSDF" not in nodes:
            issues.append(f"{mat.name}: Missing Principled BSDF")
    
    if issues:
        print("\n⚠️  Material Issues:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✓ All materials validated")
    
    return len(issues) == 0
```

---

**Best Practice**: Use realistic colors based on actual material photos, apply appropriate roughness values, and use semi-transparency for cutaway technical illustrations.
