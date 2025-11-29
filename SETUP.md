# Setup Protocol

**Orchestrator:** Follow this sequence to initialize the project. Your goal is to transition from an empty state to a fully defined Specification and Implementation Plan.

## Phase 1: System Configuration
1.  **Remind:** Simply state: *"Please configure your symlink for `target_data/` now. Let me know when you are ready."*
2.  **Wait:** Pause. Do not guess paths or create dummy files. Wait for user confirmation.
3.  **Verify Tools:** Once confirmed, verify that `.opencode/tool/` contains the required JS definitions.
4.  **Configure Repository Path:** Automatically detect and store the repository's absolute path.
    *   **Action:** Instruct the Operator to execute the following command to get the current working directory:
        ```shell
        echo %CD%
        ```
    *   **Codify:** Instruct the Scribe to update `AGENTS.md` by replacing the placeholder in section `1.1 Repository Root` with the actual path.

## Phase 2: Strategic Planning (Spec-Driven Development)
*Goal: Co-author a robust Product Requirement Document (PRD) in `memory_bank/brief.md` and define the environment in `memory_bank/context.md`.*

1.  **The Interview:**
    *   **Role:** Act as a Senior Product Manager.
    *   **Objective:** Elicit the full scope.
    *   **Action:** Ask the user for the high-level goal. Then, ask clarifying questions regarding success criteria, edge cases, and domain-specific requirements.
    *   *Short-Circuit:* If the user indicates this is a trivial task, accept their summary and proceed.

2.  **The Specification (PRD):**
    *   Present a drafted **Specification**.
    *   **Iterate:** Refine this until the User approves.
    *   **Codify:** Instruct Scribe to write the finalized Spec into `memory_bank/brief.md`.

3.  **Contextual Grounding (The Environment Scan):**
    *   **Goal:** Define *where* and *how* the work will happen to prevent assumption-based errors.
    *   **Action:** Interview the user to establish:
        *   **OS & Shell:** (e.g., Windows/PowerShell, Linux/Bash, MacOS/Zsh).
        *   **Languages & Versions:** (e.g., Python 3.10, Node 20).
        *   **Key Frameworks/Libraries:** (e.g., React, Django, PyTorch).
        *   **Existing Standards:** (e.g., "We use PEP8", "We use 2-space tabs").
    *   **Codify:** Instruct Scribe to populate `memory_bank/context.md`.

4.  **The Implementation Plan (Epics & Stories):**
    *   *Prerequisite:* Review the Spec and Context.
    *   **Action:** Decompose the approved Specification into **Epics** (Milestones) and **Stories** (Testable Units).
    *   *Note:* Do not plan individual *Tasks* yet.
    *   **Codify:** Instruct Scribe to append this plan to `memory_bank/brief.md`.

## Phase 3: Finalize
1.  Confirm `brief.md` (Spec/Plan), `context.md` (Env), and `AGENTS.md` (Tools) are all populated.
2.  Move this `SETUP.md` file to `memory_bank/archive/SETUP_archived.md`.
3.  Report: **"System Initialized. Ready to begin Epic 1."**
