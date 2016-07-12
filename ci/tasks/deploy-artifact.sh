#!/usr/bin/env bash
set -e

cf api $CF_API

echo "Login....."
cf auth $CF_USER $CF_PASS

echo "Create and Space"
cf target -o $CF_ORG -s $CF_SPACE

cf push -f git-repo/manifest.yml -n $CF_ROUTE -p {{ARTIFACT_PATH}}
