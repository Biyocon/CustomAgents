"""Generelle valideringshjælpere for agent-harnesset."""

def is_non_empty(value):
    return value is not None and str(value).strip() != ""

def is_positive_number(value):
    try:
        return float(value) > 0
    except (ValueError, TypeError):
        return False

def validate_required_keys(data, required_keys):
    missing = [k for k in required_keys if k not in data or not is_non_empty(data[k])]
    return missing
