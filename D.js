/**
 * @fileoverview SimpleDiff.js - A highly simplified, illustrative JavaScript utility
 * for comparing two sets of lines (strings).
 *
 * THIS IS NOT A PRODUCTION-READY DIFF LIBRARY.
 * It serves purely as a conceptual demonstration of how a diff operation
 * might work at a very basic level for the "Hyper-Entangled Convergence Operator (HECO)" project.
 * For robust, efficient, and accurate diffing in a real application,
 * please use established libraries (e.g., jsdiff, google-diff-match-patch).
 */

class SimpleDiff {
    /**
     * Compares two arrays of strings (representing lines of text) and returns
     * a simplified array of changes. This method uses a very basic, greedy
     * comparison and is not optimized for complex text changes (e.g., reordering
     * of blocks, subtle word-level changes).
     *
     * @param {string[]} originalLines - The array of lines from the original content.
     * @param {string[]} modifiedLines - The array of lines from the modified content.
     * @returns {Array<Object>} An array of change objects. Each object has:
     * - `type`: 'equal', 'insert', 'delete'.
     * - `value`: The content of the line.
     * - `originalIndex` (optional): The index of the line in `originalLines` if applicable.
     * - `modifiedIndex` (optional): The index of the line in `modifiedLines` if applicable.
     */
    static compareLineByLine(originalLines, modifiedLines) {
        const changes = [];
        let i = 0; // Pointer for originalLines
        let j = 0; // Pointer for modifiedLines

        // This is a naive greedy approach. A real diff algorithm (like Myers')
        // would find the shortest edit script and handle moved blocks better.
        while (i < originalLines.length || j < modifiedLines.length) {
            const originalLine = originalLines[i];
            const modifiedLine = modifiedLines[j];

            if (originalLine === modifiedLine && i < originalLines.length && j < modifiedLines.length) {
                // Line is identical
                changes.push({ type: 'equal', value: originalLine, originalIndex: i, modifiedIndex: j });
                i++;
                j++;
            } else {
                // Look for potential deletions or insertions
                let originalFoundInModified = j < modifiedLines.length && originalLine !== undefined && modifiedLines.includes(originalLine, j);
                let modifiedFoundInOriginal = i < originalLines.length && modifiedLine !== undefined && originalLines.includes(modifiedLine, i);

                if (i < originalLines.length && !originalFoundInModified) {
                    // Line in original is not found in modified from current point, assume deletion
                    changes.push({ type: 'delete', value: originalLine, originalIndex: i });
                    i++;
                } else if (j < modifiedLines.length && !modifiedFoundInOriginal) {
                    // Line in modified is not found in original from current point, assume insertion
                    changes.push({ type: 'insert', value: modifiedLine, modifiedIndex: j });
                    j++;
                } else if (i < originalLines.length && j < modifiedLines.length) {
                    // If both exist but are different and can't be easily matched forward,
                    // assume a delete then an insert. This is still a simplification.
                    changes.push({ type: 'delete', value: originalLine, originalIndex: i });
                    changes.push({ type: 'insert', value: modifiedLine, modifiedIndex: j });
                    i++;
                    j++;
                } else {
                    // One array exhausted, add remaining from the other
                    while (i < originalLines.length) {
                        changes.push({ type: 'delete', value: originalLines[i], originalIndex: i });
                        i++;
                    }
                    while (j < modifiedLines.length) {
                        changes.push({ type: 'insert', value: modifiedLines[j], modifiedIndex: j });
                        j++;
                    }
                }
            }
        }
        return changes;
    }

    /**
     * Converts a multi-line string into an array of lines.
     * @param {string} text - The input text.
     * @returns {string[]} An array of lines.
     */
    static toLines(text) {
        return text.split('\n');
    }

    /**
     * Generates a basic HTML string representation of the diff.
     * This is a simple visual aid, not a comprehensive diff viewer.
     *
     * @param {Array<Object>} changes - The output from `compareLineByLine`.
     * @returns {string} An HTML string visualizing the diff.
     */
    static toHtml(changes) {
        let html = '<div style="font-family: monospace; white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 5px;">';
        changes.forEach(change => {
            let color = '';
            let prefix = '';
            switch (change.type) {
                case 'equal':
                    color = '#666'; // Grey for unchanged
                    prefix = '&nbsp;&nbsp;'; // Two spaces
                    break;
                case 'insert':
                    color = '#008000'; // Green for insertions
                    prefix = '+ ';
                    break;
                case 'delete':
                    color = '#FF0000'; // Red for deletions
                    prefix = '- ';
                    break;
                // 'change' type is typically represented as a delete + insert in real diffs
            }
            html += `<div style="color: ${color};">${prefix}${change.value || ''}</div>`;
        });
        html += '</div>';
        return html;
    }
}

// Optional: Export for Node.js environments if intended for backend JS use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleDiff;
}
