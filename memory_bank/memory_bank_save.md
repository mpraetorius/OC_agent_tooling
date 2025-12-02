# Memory Save Protocol

Whenever you need to save the project state, perform the following steps.

### 1. Update Logs
1.  **Story Log:** Create/Append to `memory_bank/logs/E##_S##_log.md`. Add a detailed, timestamped summary of all tasks completed, tools used, and outputs generated for the story.
2.  **Epic Log:** Create/Append to `memory_bank/logs/E##_log.md`. Add a one-line summary for the completed story, linking to the detailed log file.
3.  **Main Log:** Update `memory_bank/log.md`. Ensure the summary for the parent Epic reflects the latest progress.

**Note:** Only perform the following if the save is done at the completion of a Story:

### 2. Update Plan
1.  **Update Story Status:** In `plan.md`, update the story's status to "Completed" and note the user approval date.
2.  **Clean Up Completed Tasks:** Replace the list of completed tasks (T##) under that story with a single line linking to the detailed log file. For example: `*All tasks completed. See log E##_S##_log.md for details.*`
2.  **Define Next Story:** Collaborate with the user to define the tasks for the next story.
3.  **Add New Tasks:** Add the newly defined tasks under the next story in `plan.md`.

Once complete, announce that the save process is finished and you are ready for the next story.
