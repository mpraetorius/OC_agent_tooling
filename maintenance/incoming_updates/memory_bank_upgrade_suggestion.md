# Memory bank upgrade proposal

## Goal
I want to upgrade the current memory bank system. This document defines my thinking but it's not the final word. Rather, I want you to interactively brainstorm with me to produce the best outcome possible.

## Proposed process
1. This document defines my initial "brief" and ideas.
2. After brainstorming, you will develop an upgrade plan, explaining all the main changes that will be required. Note that this plan may be used in multiple repos using the same folder structure, so has to be "high-level" and generic.
3. The Maintainer agent will then use this plan to implement the changes, taking into account the specific state of the repo.

## Analysis of current situation

### What currently works well
1. The brief.md is a good source of truth for the overarching goal of the project.
2. The context.md is likewise useful in defining other information necessary for the project.
3. Agents appear to be able to continue from one session to another with the current format of the memory bank, although initial token use is higher than it should be.

### What could be improved
1. There is no standardised process for retrieving memories from the memory bank. The user must write a custom prompt every time.
2. There is no standardised process for saving memories to memory bank.
3. There is no clear plan - it seems to be spread across a combination of the brief.md and log.md files.
4. The log is a mess. While I appreciate the level of detail, it is difficult to find what one needs and, as mentioned above, it is not token efficient for the Orchestrator to read in the whole log at the beginning of a session.
5. There is no strategy for archiving.

## Suggestions for starting brainstorming

### Retrieving memories
1. Create a memory_bank_retrieve.md file in the memory_bank folder and have the user call that whenever he wants to give an agent context.
2. Include in that file instructions on how to retrieve memories; e.g. which files to read, what level to read them at (see below for more information on this).

### Saving memories
1. Create a memory_bank_save.md file which the user calls whenever he wants an update.
2. Specify within that file what file to update, how, and with what information.

### Planning
1. Create a new plan.md document exclusively for plans. Start by explaining the planning PROCESS, then show the plan itself.
2. Make the plan hierachical, and only provide granular detail for the current Story. E.g.
- Epic 1 - create a tool
  - Story 1 - create the specification
    - Task 1 - do this.
    - Task 2 - do that.
    - Task 3 - run tests.
    - Task 4 - seek user approval (NOTE, IT IS IMPERATIVE THAT USER APPROVAL IS PLACED AT THE END OF EACH STORY, AND THE PROJECT DOESN'T PROCEED TO THE NEXT STAGE UNTIL THIS HAS BEEN GIVEN)
  - Story 2 - implement the specification
  - Story 3 - full functional test
- Epic 2 - create another tool
- Epic 3 - create a third tool

### Logging
1. Similar to the planning tool, logging should be hierarchical. However, to enable agents to only take in the context they need, I suggest we need multiple "levels" of logging, e.g.:
- log.md (high level summary of past Epics)
  - Epic_1_log.md (summary of stories in Epic 1)
  - Epic_2_log.md (summary of stories in Epic 2)
  - etc.
    - Epic_1_Story_1_log.md (contains details of every task completed in that story)
    - Epic_1_Story_2_log.md (contains details of every task completed in that story)
    - Epic_2_Story_1_log.md (contains details of every task completed in that story)
    - Epic_2_Story_2_log.md (contains details of every task completed in that story)
2. In the top-level and Epic logs, they contain a brief summary of what was done and a reference to the log the next level down.
3. In the story log the agent can save as much detail as it chooses.
4. This way, when memory_bank_retrive.md is run, the agent only looks in the log.md file. Later, if it needs to get more detail, it can recursively dig down to the story level.

## Archiving
1. Currently, archiving is a bit "random", both in terms of when archiving happens and where the files are stored.
2. My suggestion that any file that is "consumed" (e.g. this document serves no purpose after our brainstorming session) should be archived by:
- Being moved into a single archive folder, and
- A reference being made in the log so it can be found again if ever needed.
3. I suggest creating an archive_file.md in memory_bank that the user can call to initiate the archive and create the log entry which contains all the relevant instructions.

## Folder structure
1. Rather than have a recursive set of folders that will get complicated to manage, I suggest having a flat structure:
- memory_bank
  - logs (keep all Epic and Story level logs here)
  - archive
