terraform {
  required_providers {
    sops = {
      source = "carlpett/sops"
      version = "0.5.2"
    }
  }
}

provider "sops" {}
