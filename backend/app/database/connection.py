from __future__ import annotations

import os
from pathlib import Path

import pyodbc
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[3]
ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)

DB_DRIVER = os.getenv("DB_DRIVER", "{ODBC Driver 18 for SQL Server}")
DB_SERVER = os.getenv("DB_SERVER", "localhost\\SQLEXPRESS")
DB_NAME = os.getenv("DB_NAME", "StudentRegistrationDB")
DB_USERNAME = os.getenv("DB_USERNAME", "")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_TRUSTED_CONNECTION = os.getenv("DB_TRUSTED_CONNECTION", "yes").strip().lower() in (
    "yes",
    "true",
    "1",
    "y",
)
DB_ENCRYPT = os.getenv("DB_ENCRYPT", "no").strip().lower() in ("yes", "true", "1", "y")
DB_TRUST_SERVER_CERTIFICATE = os.getenv("DB_TRUST_SERVER_CERTIFICATE", "yes").strip().lower() in (
    "yes",
    "true",
    "1",
    "y",
)


def _build_connection_string() -> str:
    if DB_USERNAME and DB_PASSWORD and not DB_TRUSTED_CONNECTION:
        auth_part = f"UID={DB_USERNAME};PWD={DB_PASSWORD};"
    else:
        auth_part = "Trusted_Connection=yes;"

    encrypt_part = "Encrypt=yes;" if DB_ENCRYPT else "Encrypt=no;"
    trust_cert_part = "TrustServerCertificate=yes;" if DB_TRUST_SERVER_CERTIFICATE else "TrustServerCertificate=no;"

    return (
        f"DRIVER={DB_DRIVER};"
        f"SERVER={DB_SERVER};"
        f"DATABASE={DB_NAME};"
        f"{auth_part}"
        f"{encrypt_part}"
        f"{trust_cert_part}"
    )


def get_connection(autocommit: bool = True) -> pyodbc.Connection:
    """Return a pyodbc connection to the SQL Server database."""
    connection_string = _build_connection_string()
    return pyodbc.connect(connection_string, autocommit=autocommit)
