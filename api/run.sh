#!/bin/bash

(cd app/db && alembic upgrade head)
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --root-path /api