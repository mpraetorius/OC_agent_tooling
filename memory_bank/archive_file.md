# File Archiving Protocol

To archive a file, follow these steps precisely.

1.  **Identify File:** Confirm the full path of the file to be archived and the reason for archiving with the user.
2.  **Move File:** Move the file to the `memory_bank/archive/` directory.
3.  **Record in Log:** Append a standardized entry to the **end** of the main `memory_bank/log.md` file using this exact format:

    ```
    - [YYYY-MM-DD] ARCHIVED: Moved `{original_path}` to `memory_bank/archive/`. Reason: {user-provided reason}.
    ```

Confirm that the file has been moved and the log has been updated.