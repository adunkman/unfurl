output "ui_bucket_shared_secret" {
  value = data.sops_file.internal.data["ui_bucket_shared_secret"]
  sensitive = true
}
