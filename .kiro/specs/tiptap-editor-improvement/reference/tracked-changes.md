# Track changes in your editor

The Tracked Changes extension enables suggestion mode for collaborative editing workflows. When enabled, all edits appear as proposals that can be accepted or rejected, similar to change tracking in word processors.

## [](#features)Features

The extension tracks four types of changes:

-   **Insertions** (`add`) — New content added to the document
-   **Deletions** (`delete`) — Existing content marked for removal
-   **Replacements** (`replace`) — Content that was simultaneously deleted and replaced with new content
-   **Mark changes** (`markChange`) — Formatting or other mark-level changes applied to existing text

Each suggestion carries metadata including who created it, when it was created, and a unique identifier.

## [](#key-capabilities)Key capabilities

-   **Suggestion mode** — Toggle tracking on and off per user
-   **Accept and reject** — Review suggestions individually, in bulk, by range, or by user
-   **Suggestion grouping** — Continuous edits are automatically merged into single suggestions
-   **Collaboration ready** — Works with Yjs-based real-time collaboration
-   **Comments integration** — Link suggestions to comment threads for review workflows
-   **Atom node support** — Tracks changes to images, horizontal rules, and other non-text content
-   **Full query API** — Find, filter, and inspect suggestions programmatically

## [](#next-steps)Next steps

-   [Install the extension](/docs/tracked-changes/getting-started/install) to get started
-   Learn about [basic usage](/docs/tracked-changes/usage/basic-usage) patterns
-   Explore the [commands](/docs/tracked-changes/api-reference/commands) and [utilities](/docs/tracked-changes/api-reference/utilities) API