# For AI agents

- **To install a skill for a user,** copy its folder from `skills/` into the user's skills folder for your agent. For Kiro, that's `~/.kiro/skills/<name>/`. For Claude Code, it's `~/.claude/skills/<name>/`. Copy only the skills they asked for, and tell them to start a new chat so the skill loads.
- **To change or add a skill,** keep it standalone and within the [Agent Skills specification](https://agentskills.io/specification): `name` matches the folder, the `description` is under 1,024 characters, and `SKILL.md` stays under about 500 lines. Write plainly, with no dashes for punctuation, and keep each skill's own writing rules.

- **QIOR generation** uses Node.js 22 or later and only built-in modules. Keep its renderer and assets inside `skills/qior/` so copying that folder installs a working skill. Agents supply question JSON instead of writing HTML for each report. The independent text version is `steering/qior.md`.
- **Before handing back changes,** run `npm test`, generate the demo and viewer, and run browser checks when changing the interface. Check the copied-skill workflow from a different directory. Browser dependencies are for development only.
- **Publication hygiene:** use synthetic examples. Keep real packets, reports, credentials, local configuration, and personal screenshots out of Git. Inspect new files and scan working files plus Git history for secrets before publishing. Generated reports belong under ignored `output/`.
