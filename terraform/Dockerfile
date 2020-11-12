FROM hashicorp/terraform:0.13.5
RUN wget https://github.com/mozilla/sops/releases/download/v3.6.1/sops-v3.6.1.linux -O /bin/sops
RUN chmod +x /bin/sops

WORKDIR /terraform
CMD ["terraform"]
