# High-Level Plan: Memory Bank System Upgrade

This plan outlines the steps required to upgrade the repository's memory system to a more robust, token-efficient, and standardized format.

**1. Restructure the `memory_bank` Directory**
*   Create a new subdirectory: `memory_bank/logs/`. This will house all the detailed log files.
*   Ensure the `memory_bank/archive/` directory exists.

**2. Create Core Protocol Files & Content Templates**
*   **`memory_bank/plan.md`**: Create this new file for the project roadmap.

    *   **Template: `memory_bank/plan.md`**
        ````markdown
        # Project Plan

        ## 1.0 Planning Protocol
        This document outlines the project's Epics, Stories, and Tasks.
        - **Epics (E##):** High-level features or goals.
        - **Stories (S##):** Milestones required to complete an Epic. User approval is required upon completion of each story.
        - **Tasks (T##):** Granular steps for the **current story only**. Tasks for future stories are defined just before the story begins.

        ## 2.0 Active Plan

        ### E01: Memory Bank System Upgrade
        - **Goal:** Overhaul the memory system for better efficiency and standardization.

        #### S01: Restructure and Create Core Files
        - **Status:** Completed
        - **Approval:** User approved on [YYYY-MM-DD]
        - [x] T01: Create `memory_bank/logs/` directory.
        - [x] T02: Create `plan.md` with this template.
        - [x] T03: Create protocol files (`retrieve`, `save`, `archive`).

        #### S02: Migrate Existing Data
        - **Status:** In Progress
        - [ ] T01: Extract plan from `brief.md` and populate this file.
        - [ ] T02: Refactor `log.md` into the new hierarchical structure.
        - [ ] T03: Move old log entries to new files in `memory_bank/logs/`.

        #### S03: Update Agent Prompts and Test
        - **Status:** Pending
        - Tasks to be defined upon completion of S02.
        ````

*   **`memory_bank/memory_bank_retrieve.md`**: Create this file to instruct an agent on how to load project context.

    *   **Template: `memory_bank/memory_bank_retrieve.md`**
        ````markdown
        # Memory Retrieval Protocol

        To gain full context of this project, you must read the following files in order.

        1.  **`memory_bank/brief.md`**: Understand the high-level mission (The "Why").
        2.  **`memory_bank/context.md`**: Understand the technical environment and constraints (The "How").
        3.  **`memory_bank/plan.md`**: Understand the project roadmap and current progress (The "What").
        4.  **`memory_bank/log.md`**: Understand the history of completed work (The "What Was Done").

        After reading these files, confirm you have all the necessary context to proceed with the user's request.
        ````

*   **`memory_bank/memory_bank_save.md`**: Create this file to instruct an agent on how to persist the project state.

    *   **Template: `memory_bank/memory_bank_save.md`**
        ````markdown
        # Memory Save Protocol

        Upon user approval of a completed Story, you must perform the following steps to save the project state.

        ### 1. Update Logs
        1.  **Story Log:** Create/Append to `memory_bank/logs/E##_S##_log.md`. Add a detailed, timestamped summary of all tasks completed, tools used, and outputs generated for the story.
        2.  **Epic Log:** Create/Append to `memory_bank/logs/E##_log.md`. Add a one-line summary for the completed story, linking to the detailed log file.
        3.  **Main Log:** Update `memory_bank/log.md`. Ensure the summary for the parent Epic reflects the latest progress.

        ### 2. Update Plan
        1.  **Mark Story Complete:** In `plan.md`, mark all tasks (T##) for the completed story as complete (`[x]`). Update the story's status to "Completed" and note the user approval date.
        2.  **Define Next Story:** Collaborate with the user to define the tasks for the next story.
        3.  **Add New Tasks:** Add the newly defined tasks under the next story in `plan.md`.

        Once complete, announce that the save process is finished and you are ready for the next story.
        ````

*   **`memory_bank/archive_file.md`**: Create this file to instruct an agent on how to archive a file.

    *   **Template: `memory_bank/archive_file.md`**
        ````markdown
        # File Archiving Protocol

        To archive a file, follow these steps precisely.

        1.  **Identify File:** Confirm the full path of the file to be archived and the reason for archiving with the user.
        2.  **Move File:** Move the file to the `memory_bank/archive/` directory.
        3.  **Record in Log:** Append a standardized entry to the **end** of the main `memory_bank/log.md` file using this exact format:

            ```
            - [YYYY-MM-DD] ARCHIVED: Moved `{original_path}` to `memory_bank/archive/`. Reason: {user-provided reason}.
            ```

        Confirm that the file has been moved and the log has been updated.
        ````

**3. Migrate Existing Data to the New Structure**
*   **Deconstruct `brief.md`**: Review the existing `brief.md`, extract the implementation plan, and move it into the new `plan.md`, converting it to the `E##_S##` format. The `brief.md` should be left with only the high-level mission.
*   **Refactor `log.md`**: Review the existing `log.md`, create new granular log files in `memory_bank/logs/` for each completed Epic/Story, and move the detailed entries. Rewrite the main `log.md` to be a high-level summary with links to the detailed logs.

**4. Define the New Operational Workflow**
*   Update core agent instructions to ensure they use the new protocol files for retrieving context, saving progress, and archiving files as part of their standard operational loop.
