#!/usr/bin/env bash
set -exo pipefail
MB_KEY=$(cat .MB_KEY)
docker run -p 8080:8080 -e "MB_KEY=$MB_KEY" machinebox/fakebox
