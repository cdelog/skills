# Security and data handling

The QIOR renderer reads the question file and explicitly supplied local
pictures, then writes an HTML file. It makes no network requests and needs
no credentials. The generated page uses a network-blocking Content Security
Policy, system fonts, and embedded raster pictures. Question text is escaped
before it is embedded in the fixed template.

Question files, generated HTML, exported answers, and saved progress can
contain private project information. Use synthetic examples in this repository.
Put local outputs under `output/`, which Git ignores. Do not add credentials,
personal screenshots, session histories, environment files, or local agent
configuration. Base64 pictures are data, not encryption.

Before publishing changes, inspect the complete file list and run a secret
scanner over both the working files and Git history. For example, with
[Gitleaks](https://github.com/gitleaks/gitleaks) installed:

```sh
gitleaks dir . --redact --no-banner
gitleaks git . --redact --no-banner --log-opts="--all"
```

The repository config excludes dependency folders and Git internals from the
directory scan. The Git history scan remains separate.
CI scans the full Git history with a pinned, checksum-verified Gitleaks binary.
A clean scan reduces risk but does not establish that arbitrary submitted
content is safe. Review new pictures and text before publishing them.

Report security issues through GitHub's private vulnerability reporting when
available. Do not include credentials or private question content in a public
issue. If a credential is ever committed, revoke it before addressing the
repository copy or history.
