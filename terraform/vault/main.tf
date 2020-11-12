terraform {
  required_providers {
    sops = {
      source = "carlpett/sops"
      version = "0.5.2"
    }
  }
}

provider "sops" {}

data "sops_file" "internal" {
  source_file = "vault/internal.enc.yml"
}
