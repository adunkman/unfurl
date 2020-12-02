#!/bin/sh
set -e

sops exec-env variables.enc.yml "terraform $*"
