#!/bin/bash

export PYTHONPATH=$PYTHONPATH:$PWD/../

alembic upgrade head
