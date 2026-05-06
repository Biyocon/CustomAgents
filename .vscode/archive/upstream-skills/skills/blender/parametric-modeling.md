# Parametric Modeling Guide

## Overview
This guide covers best practices for creating dimension-driven, source-verified parametric models in Blender.

## Core Principles

### 1. Source-Driven Design
**NEVER fabricate dimensions**. Every measurement must come from:
- Engineering drawings
- Technical specifications
- Standards documents (e.g., Banedanmark, EN standards)
- User-provided measurements
- Published references

### 2. TBD (To Be Determined) Protocol
When dimensions are not provided:
1. List parameter as **TBD** in comments
2. Set reasonable default with **ANTAGET** marker
3. Place all TBD parameters in dedicated section
4. Document why assumption was made
5. Provide adjustment instructions

### 3. Verification Requirements
Every parametric model must include:
- Constants section with source references
- Validation function printing all dimensions
- Clear separation of verified vs. assumed values
- Adjustment instructions for end-user

## Script Template

```python
"""
[MODEL NAME]
Description: [Brief description]
Source: [Document reference]
Date: YYYY-MM-DD

VERIFIED PARAMETERS: [Count]
TBD PARAMETERS: [Count]
"""

import bpy
import bmesh
from mathutils import Vector

# ═══════════════════════════════════════════════════════════════
# SOURCE-VERIFIED PARAMETERS
# ═══════════════════════════════════════════════════════════════

# [SOURCE: Document XYZ, Drawing ABC-123]
PARAM_A = 1.500  # [m] Main dimension ✓
PARAM_B = 0.300  # [m] Secondary dimension ✓
PARAM_C = 0.750  # [m] Height ✓

# ═══════════════════════════════════════════════════════════════
# TBD PARAMETERS (ANTAGET - NOT SOURCE VERIFIED)
# ═══════════════════════════════════════════════════════════════

PARAM_D = 0.200  # [m] ANTAGET - No source data available
PARAM_E = 0.150  # [m] ANTAGET - Standard practice assumption

# Derived parameters (calculated from above)
TOTAL_WIDTH = PARAM_A + 2 * PARAM_B  # [m] Calculated

# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

def validate_dimensions():
    """Print dimension verification report"""
    print("\n" + "="*70)
    print("DIMENSION VERIFICATION REPORT")
    print("="*70)
    print("\nSOURCE-VERIFIED PARAMETERS:")
    print(f"  PARAM_A: {PARAM_A:.3f} m ✓")
    print(f"  PARAM_B: {PARAM_B:.3f} m ✓")
    print(f"  PARAM_C: {PARAM_C:.3f} m ✓")
    print("\nTBD PARAMETERS (ANTAGET):")
    print(f"  PARAM_D: {PARAM_D:.3f} m [No source]")
    print(f"  PARAM_E: {PARAM_E:.3f} m [Assumed standard]")
    print("\nDERIVED VALUES:")
    print(f"  TOTAL_WIDTH: {TOTAL_WIDTH:.3f} m [Calculated]")
    print("="*70 + "\n")

def setup_scene():
    """Initialize scene with proper settings"""
    # Clear existing objects
    for obj in bpy.data.objects:
        bpy.data.objects.remove(obj, do_unlink=True)
    
    # Set units
    bpy.context.scene.unit_settings.system = 'METRIC'
    bpy.context.scene.unit_settings.scale_length = 1.0
    
    print("✓ Scene initialized (METRIC units)")

def create_collections():
    """Create organized collection structure"""
    collections = {
        "01_Main": None,
        "02_Components": None,
        "03_Infrastructure": None,
        "99_Annotation": None
    }
    
    for name in collections:
        coll = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(coll)
        collections[name] = coll
    
    print(f"✓ Created {len(collections)} collections")
    return collections

# ═══════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════

def main():
    """Main modeling function"""
    print("\nStarting parametric model generation...")
    
    setup_scene()
    collections = create_collections()
    
    # Create geometry here
    # ...
    
    validate_dimensions()
    print("✓ Model generation complete\n")

if __name__ == "__main__":
    main()
```

## Dimension Documentation Standards

### Format
```python
# [Source reference]
VARIABLE_NAME = value  # [unit] Description ✓/ANTAGET
```

### Examples
```python
# Banedanmark Standard ABC-123, Table 5.2
TRACK_GAUGE = 1.435  # [m] Standard gauge ✓
BALLAST_DEPTH = 0.300  # [m] Minimum depth for V≤200km/h ✓

# EN 13848-1:2019, Section 4.3
CANT_MAX = 0.150  # [m] Maximum superelevation ✓

# Assumed based on common practice
SLEEPER_SPACING = 0.650  # [m] ANTAGET - Typical spacing
```

## Common Parameter Types

### Linear Dimensions
```python
LENGTH = 10.0    # [m]
WIDTH = 2.5      # [m]
HEIGHT = 1.8     # [m]
THICKNESS = 0.25 # [m]
DIAMETER = 0.160 # [m]
```

### Angles
```python
SLOPE_ANGLE = 1.5    # [ratio] 1:1.5 (1 vertical : 1.5 horizontal)
CANT = 0.040         # [ratio] 40‰ (40mm per meter)
ROTATION = 1.5708    # [rad] 90 degrees
```

### Counts
```python
NUM_ELEMENTS = 16    # [count]
SPACING = 0.65       # [m]
```

## Validation Best Practices

### Essential Checks
1. **Unit Consistency**: All in meters unless specified
2. **Calculation Verification**: Print derived values
3. **Range Checks**: Validate against realistic bounds
4. **Source Traceability**: Every verified dimension has source

### Validation Function Template
```python
def validate_dimensions():
    """Comprehensive validation with checks"""
    errors = []
    warnings = []
    
    # Check realistic bounds
    if PARAM_A < 0 or PARAM_A > 100:
        errors.append(f"PARAM_A out of realistic range: {PARAM_A}")
    
    # Check dependencies
    if PARAM_B > PARAM_A:
        warnings.append("PARAM_B exceeds PARAM_A - verify logic")
    
    # Print report
    print("\n" + "="*70)
    print("VALIDATION REPORT")
    print("="*70)
    
    if errors:
        print("\n❌ ERRORS:")
        for err in errors:
            print(f"  - {err}")
    
    if warnings:
        print("\n⚠️  WARNINGS:")
        for warn in warnings:
            print(f"  - {warn}")
    
    if not errors and not warnings:
        print("\n✓ All validations passed")
    
    print("="*70 + "\n")
    
    return len(errors) == 0
```

## Adjustment Instructions

### User Guidance Template
```python
def print_adjustment_guide():
    """Print instructions for parameter adjustment"""
    print("\n" + "╔" + "═"*68 + "╗")
    print("║" + " "*20 + "PARAMETER ADJUSTMENT GUIDE" + " "*22 + "║")
    print("╚" + "═"*68 + "╝\n")
    print("To adjust model dimensions:")
    print("─"*70)
    print("1. Locate PARAMETERS section at top of script")
    print("2. Modify desired values")
    print("3. Re-run script (Alt+P in Blender)")
    print("\nVERIFIED PARAMETERS (avoid changing without new source):")
    print(f"  - PARAM_A = {PARAM_A} m")
    print(f"  - PARAM_B = {PARAM_B} m")
    print("\nTBD PARAMETERS (safe to adjust):")
    print(f"  - PARAM_D = {PARAM_D} m")
    print(f"  - PARAM_E = {PARAM_E} m")
    print("─"*70 + "\n")
```

## Advanced Techniques

### Parametric Relationships
```python
# Primary parameters
BASE_WIDTH = 2.0   # [m] ✓
SCALE_FACTOR = 1.5 # [ratio] ✓

# Derived parameters
DERIVED_WIDTH = BASE_WIDTH * SCALE_FACTOR
DERIVED_AREA = BASE_WIDTH ** 2

# Conditional logic
if DERIVED_WIDTH > 3.0:
    SUPPORT_COUNT = 3
else:
    SUPPORT_COUNT = 2
```

### Array-Based Parameters
```python
# Layer thicknesses from bottom to top
LAYER_THICKNESSES = [
    0.50,  # [m] Foundation ✓
    0.25,  # [m] Sub-base ✓
    0.30,  # [m] Base ✓
    0.15   # [m] Surface ✓
]

TOTAL_HEIGHT = sum(LAYER_THICKNESSES)
```

### Geometric Calculations
```python
import math

# Slope calculations
SLOPE_RATIO = 1.5  # 1:1.5
VERTICAL = 1.0
HORIZONTAL = VERTICAL * SLOPE_RATIO

# Angle from ratio
ANGLE_RAD = math.atan(VERTICAL / HORIZONTAL)
ANGLE_DEG = math.degrees(ANGLE_RAD)

# Cross-fall
CROSSFALL_PROMILLE = 40  # 40‰
CROSSFALL_RATIO = CROSSFALL_PROMILLE / 1000
WIDTH = 3.0  # [m]
HEIGHT_DROP = WIDTH * CROSSFALL_RATIO  # [m]
```

## Common Patterns

### Pattern 1: Layered Construction
```python
# Build from bottom up
layers = [
    {"name": "Foundation", "thickness": 0.50, "material": "Soil"},
    {"name": "Sub-base", "thickness": 0.25, "material": "Gravel"},
    {"name": "Base", "thickness": 0.30, "material": "Aggregate"},
]

z_current = 0.0
for layer in layers:
    # Create layer geometry
    create_layer(layer["name"], z_current, layer["thickness"])
    z_current += layer["thickness"]
```

### Pattern 2: Symmetric Components
```python
# Create on both sides of centerline
CENTERLINE = 0.0
OFFSET = 1.5  # [m]

for side in [-1, 1]:
    x_pos = CENTERLINE + (side * OFFSET)
    create_component(x_pos, 0, 0)
```

### Pattern 3: Repeated Elements
```python
# Evenly spaced elements
START_POS = -5.0   # [m]
END_POS = 5.0      # [m]
SPACING = 0.65     # [m]

count = int((END_POS - START_POS) / SPACING) + 1
for i in range(count):
    pos = START_POS + (i * SPACING)
    create_element(pos)
```

## Error Prevention

### Pre-Execution Checks
```python
def pre_execution_checks():
    """Validate before creating geometry"""
    checks_passed = True
    
    # Check Blender version
    if bpy.app.version < (5, 0, 0):
        print("⚠️  Warning: Blender version < 5.0")
        checks_passed = False
    
    # Check parameter logic
    if PARAM_B > PARAM_A:
        print("❌ Error: PARAM_B cannot exceed PARAM_A")
        checks_passed = False
    
    # Check units
    if bpy.context.scene.unit_settings.system != 'METRIC':
        print("⚠️  Warning: Scene not in METRIC units")
    
    return checks_passed
```

### Safe Defaults
```python
# Use safe defaults for TBD parameters
SAFETY_CLEARANCE = 0.50  # [m] ANTAGET - Conservative default
MINIMUM_THICKNESS = 0.10 # [m] ANTAGET - Below practical minimum

# Add warnings for edge cases
if SAFETY_CLEARANCE < 0.30:
    print("⚠️  Safety clearance below recommended 0.30m")
```

## Documentation Output

### Generate PDF-Ready Report
```python
def generate_report():
    """Generate markdown documentation"""
    report = f"""
# Model Documentation

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M')}

## Parameters

### Source-Verified
| Parameter | Value | Unit | Source |
|-----------|-------|------|--------|
| PARAM_A   | {PARAM_A} | m | Drawing ABC-123 |
| PARAM_B   | {PARAM_B} | m | Standard XYZ |

### TBD (Assumed)
| Parameter | Value | Unit | Assumption Basis |
|-----------|-------|------|------------------|
| PARAM_D   | {PARAM_D} | m | Typical practice |

## Validation
- Total elements: {count}
- Dimension check: ✓ Passed
- Unit system: METRIC
"""
    return report
```

---

**Best Practice**: Always start with source verification, explicitly mark assumptions, and provide clear adjustment paths for users.
