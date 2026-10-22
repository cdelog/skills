# For AI agents

- **To install a skill for a user,** copy its folder from `skills/` into the user's skills folder for your agent. For Kiro, that's `~/.kiro/skills/<name>/`. For Claude Code, it's `~/.claude/skills/<name>/`. Copy only the skills they asked for, and tell them to start a new chat so the skill loads.
- **To change or add a skill,** keep it standalone and within the [Agent Skills specification](https://agentskills.io/specification): `name` matches the folder, the `description` is under 1,024 characters, and `SKILL.md` stays under about 500 lines. Write plainly, with no dashes for punctuation, and keep each skill's own writing rules.
