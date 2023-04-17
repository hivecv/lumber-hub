#!/bin/bash

export PYTHONPATH=$PYTHONPATH:$PWD/../

alembic revision --autogenerate
