# Project Directory Structure

This document outlines the structure of the repository.

## 1.0 File Tree

/
├── .gitattributes
├── .gitignore
├── AGENTS.md
├── SETUP.md
├── STRUCTURE.md
├── governing_principles.md
├── opencode.json
├── .cache/
│   └── .gitkeep
├── agent/
│   ├── Maintainer.md
│   │─   Operator.md
│   ├── Orchestrator.md
│   └── Scribe.md
├── documentation/
│   └── ...
├── maintenance/
│   └── ...
├── memory_bank/
│   ├── archive/
│   │   └── .gitkeep
│   ├── brief.md
│   ├── context.md
│   └── log.md
├── prompts/
│   └── ...
├── target_data/
│   └── .gitignore
├── .opencode/
│   ├── .gitkeep
│   ├── command/
│   │   └── .gitkeep
│   ├── scripts/
│   │   └── .gitkeep
│   └── tool/
│       └── .gitkeep

## 2.0 Directory Functions

| Directory       | Purpose                                                                          |
| :-------------- | :------------------------------------------------------------------------------- |
| `agent/`        | Contains the core instruction files (prompts) for each specialized agent.        |
| `documentation/`| Stores supplementary documentation for project history, architecture, and usage. |
| `maintenance/`  | Holds audit findings, improvement plans, and other repository health artifacts.  |
| `memory_bank/`  | Manages the persistent state and memory of the agent system across sessions.     |
| `prompts/`      | Stores reusable prompts for agents, organized by the agent that uses them.       |
| `target_data/`  | The designated workspace for file staging and final output.                      |
| `tools/`        | Contains scripts and utilities that can be executed by the Operator agent.       |
| `.opencode/`     | Historical and current tooling layout for open code operations.                   |

- New subdirectories under .opencode:
  - .opencode/command: Holds command definitions and executable entry points for tooling workflows.
  - .opencode/scripts: Contains script utilities used by tooling tasks.
  - .opencode/tool: Encapsulates individual tooling components and wrappers.
