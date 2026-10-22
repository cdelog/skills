<a id="readme-top"></a>

<!-- Structure adapted from othneildrew/Best-README-Template, credited in Acknowledgments. -->

[![Agent Skills][skills-shield]][skills-url]
[![Kiro][kiro-shield]][kiro-url]
[![License][license-shield]][license-url]

<br />
<div align="center">
  <h3 align="center">skills</h3>

  <p align="center">
    Agent skills I use every day, cleaned up so they work on their own.
    <br />
    <a href="skills/qior/SKILL.md"><strong>Start with qior</strong></a>
    <br />
    <br />
    <a href="https://github.com/cdelog/skills/issues/new?labels=bug">Report a bug</a>
    &middot;
    <a href="https://github.com/cdelog/skills/issues/new?labels=enhancement">Request a skill</a>
  </p>
</div>

<details>
  <summary>Table of contents</summary>
  <ol>
    <li><a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#status">Status</a></li>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#the-skills">The skills</a>
      <ul>
        <li><a href="#qior">qior</a></li>
      </ul>
    </li>
    <li><a href="#repository-layout">Repository layout</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About the project

A skill is a folder with a `SKILL.md` that teaches an AI agent one way of working. The agent reads each skill's name and description at the start of a chat, and loads the rest only when the job comes up.

I run a fleet of coding agents on my own projects. They ask me for decisions all day, mostly from my phone, and they need my answers quickly. These skills started as fixes for what slowed that down, and they've been in daily use since. Each one here stands alone: it doesn't need another skill, a project or a particular agent.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Status

- [x] `qior` in Kiro 1.4, where it's run my decision stacks every day since October 2026. The copy here is a cleaned-up version that no longer depends on my other skills.
- [ ] `qior` in Claude Code, Codex and other Agent Skills clients. The format is the open standard, so it should load as-is. Nobody has checked yet.

If you're the first to try one of the unchecked lines, an issue saying how it went is a big help.

### Built with

- Markdown, in the [Agent Skills](https://agentskills.io/specification) format. There's no code, nothing to build and nothing to run.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Prerequisites

- An agent that reads Agent Skills, such as Kiro or Claude Code.

### Installation

Ask your agent, in a chat:

```
Install the qior skill from https://github.com/cdelog/skills into my user skills folder.
```

Or copy the folder yourself. Each skill is one folder, so take only the ones you want:

| Agent       | For every project         | For one project                 |
| ----------- | ------------------------- | ------------------------------- |
| Kiro        | `~/.kiro/skills/qior/`    | `<project>/.kiro/skills/qior/`  |
| Claude Code | `~/.claude/skills/qior/`  | `<project>/.claude/skills/qior/` |

For any other agent, check where its documentation says skills go. Start a new chat after you install, so the agent sees the skill.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## The skills

### qior

**QIOR**, pronounced "choir": Question, Implications, Options, Recommendation. It's how an agent puts decisions to you so you can answer a whole stack at once, as "1a 2a 3b", and then act on your answers without asking again.

Each question gives you:

- **the facts that decide it,** with each one marked as checked, reported or estimated, so you can tell a measurement from a guess;
- **the strongest fact against** the agent's recommendation, when there is one;
- **two to four options,** with (a) always the recommendation, so "all a" works when you trust it.

The skill also covers when not to ask (anything the agent can decide itself), writing to be read once on a phone, stacking up to 20 questions, and responding efficiently to your answers.

It turns on when an agent needs a decision from you, or when you say "QIOR", "ask me" or "stack the questions". A question looks like this:

```
1. Should the site description drop its last clause to fit in search results?
- The sentence is 189 characters (checked), and search results cut
  descriptions at about 155 (reported by most SEO guides).
- It's copy only, and one deploy reverts it.
  - (a) Use the 148-character version, plus a test that keeps it under 155.
  - (b) Keep the long sentence and accept the cut.
Recommend (a): the range is the fact the sentence exists to carry.

Reply like: 1a.
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository layout

| Path                    | What it is                                                         |
| ----------------------- | ------------------------------------------------------------------ |
| `skills/<name>/`        | One skill. Copy the folder to install it                           |
| `skills/<name>/SKILL.md` | The skill: frontmatter the agent reads first, then the instructions |
| `AGENTS.md`             | Rules for an agent installing or changing a skill here             |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Issues and pull requests are welcome. A skill in this repository:

- works on its own, without another skill, a project or a particular agent;
- follows the [Agent Skills specification](https://agentskills.io/specification): a lowercase `name` that matches its folder, and a `description` under 1,024 characters that says what it does and when to use it;
- keeps its `SKILL.md` under about 500 lines;
- is written plainly enough to read once on a phone.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

MIT. See [`LICENSE`](LICENSE). This repository isn't affiliated with Kiro, AWS, Anthropic or the Agent Skills project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Agent Skills](https://agentskills.io), the open format these follow.
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) by othneildrew, for this README's structure.
- [Shields.io](https://shields.io) for the badges.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[skills-shield]: https://img.shields.io/badge/agent_skills-SKILL.md-0A66C2?style=for-the-badge
[skills-url]: https://agentskills.io/specification
[kiro-shield]: https://img.shields.io/badge/kiro-1.4-7B61FF?style=for-the-badge
[kiro-url]: https://kiro.dev
[license-shield]: https://img.shields.io/badge/license-MIT-green?style=for-the-badge
[license-url]: LICENSE
