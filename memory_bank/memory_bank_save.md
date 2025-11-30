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