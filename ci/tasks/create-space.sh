#!/usr/bin/env bash
set -e

cf api $CF_API

echo "Login....."
cf auth $CF_USER $CF_PASS

echo "Create and Space"
cf target -o $CF_ORG

cf create-space $CF_SPACE
