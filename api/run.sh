#!/bin/bash

(cd app && alembic upgrade head)
uvicorn app.main:app --host 0.0.0.0 --port 80 --root-path /api