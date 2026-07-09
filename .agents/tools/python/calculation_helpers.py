"""Matematiske beregningshjælpere."""
import math

def three_phase_current(power_kw, voltage_v, cos_phi=0.9, efficiency=0.95):
    """Beregnet strøm for trefaset belastning."""
    if not all([power_kw, voltage_v, cos_phi, efficiency]):
        return None
    return power_kw * 1000 / (math.sqrt(3) * voltage_v * cos_phi * efficiency)

def single_phase_current(power_kw, voltage_v, cos_phi=0.9, efficiency=0.95):
    """Beregnet strøm for enfaset belastning."""
    if not all([power_kw, voltage_v, cos_phi, efficiency]):
        return None
    return power_kw * 1000 / (voltage_v * cos_phi * efficiency)
