# Template Improvement Ingestion

**Context:** The user has placed an improved version of a system file into `maintenance/incoming_updates/`.
**Goal:** Compare the new version against the current Master Template version, understand the intent, and merge the improvements.

## Procedure

1.  **Scan:** Check `maintenance/incoming_updates/` for files.
    *   *If empty:* Report "No files found to process." and exit.

2.  **Locate Target:** For each file found in `incoming_updates/`:
    *   Search the repository to find the corresponding "Master" file (e.g., if `Scribe.md` is found, locate `agent/Scribe.md`).
    *   *If not found:* Ask the user where this file belongs.

3.  **Analyze & Verify (The "PR Review"):**
    *   **Read** both the "Incoming" version and the "Master" version.
    *   **Identify Differences:** specific changes in instructions, logic, or structure.
    *   **Assess Intent:** Why is the new version better? Does it fix a bug? Add a feature?
    *   **Prompt the User:**
        *   "I detected changes in **[Filename]**."
        *   "**Change Summary:** [Brief explanation of the diff]."
        *   "**My Assessment:** [Is this safe? Does it contradict governing principles?]"
        *   "**Question:** What was the specific reason for this change? (Or type 'Proceed' if my assessment is correct)."

4.  **Merge:**
    *   Upon User confirmation, **overwrite** the Master file with the content of the Incoming file.
    *   Update version date in AGENTS.md (Section 0.0).
    *   Provide a brief description of change in AGENTS.md (Section 0.0).

5.  **Cleanup:**
    *   Delete the file from `maintenance/incoming_updates/`.
    *   Report: "**[Filename]** updated successfully. Ready for Git Commit."
