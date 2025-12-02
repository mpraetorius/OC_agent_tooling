# Memory Save Protocol

Whenever you need to save the project state, perform the following steps.

### 1. Update Logs

Your goal is to create a concise, scannable record of what was achieved, not how it was done.

1.  **Story Log (`memory_bank/logs/E##_S##_log.md`):** Create or append to the log for the specific story. The log should be a brief summary focusing on outcomes and deliverables. Use the following template:

    ```markdown
    # Story X: [Story Title]

    ## Story Summary
    - **Objective:** A one-sentence summary of the story's goal.
    - **Status:** ✅ Completed / 🚧 In Progress
    - **Date:** YYYY-MM-DD

    ## Key Outcomes & Decisions
    - A bulleted list of the most important decisions made or milestones reached.
    - *Example: Decided to use 'llms.txt URL' as the primary input for the tool.*
    - *Example: Refactored the data validation module to improve error handling.*

    ## Deliverables
    - A bulleted list of all files created or significantly modified.
    - Provide the file path only. **Do not** include the file's content or a summary of its content.
    - *Example: `documentation/docs_develop_llms_workflow_specification.md`*
    - *Example: `memory_bank/brief.md`*
    ```

2.  **Epic Log (`memory_bank/logs/E##_log.md`):** Add a one-line summary for the completed story, linking to the detailed log file.

3.  **Main Log (`memory_bank/log.md`):** Ensure the summary for the parent Epic reflects the latest progress.

**Note:** Only perform the following if the save is done at the completion of a Story:

### 2. Update Plan

1.  **Update Story Status:** In `plan.md`, update the story's status to "Completed" and note the user approval date.
2.  **Clean Up Completed Tasks:** Replace the list of completed tasks (T##) under that story with a single line linking to the detailed log file. For example: `*All tasks completed. See log E##_S##_log.md for details.*`
3.  **Define Next Story:** Collaborate with the user to define the tasks for the next story.
4.  **Add New Tasks:** Add the newly defined tasks under the next story in `plan.md`.

Once complete, announce that the save process is finished and you are ready for the next story.