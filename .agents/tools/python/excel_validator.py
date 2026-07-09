"""Validering af Excel-filer mod schemas."""
import pandas as pd

def validate_columns(file_path, required_columns):
    df = pd.read_excel(file_path)
    missing = [c for c in required_columns if c not in df.columns]
    return missing

def validate_non_empty(file_path, column):
    df = pd.read_excel(file_path)
    empty_count = df[column].isna().sum()
    return empty_count
