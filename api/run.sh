#!/bin/bash
set -e

export PYTHONPATH=$PYTHONPATH:$PWD/app
(cd app/db && python3 -m alembic upgrade head)
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --root-path /api