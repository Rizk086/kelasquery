/**
 * Check if Tiptap JSON content is empty or contains only whitespace/empty elements
 * @param {Object} content - Tiptap JSON content
 * @returns {boolean} - true if content is empty, false otherwise
 */
export function isTiptapContentEmpty(content) {
  // Handle null, undefined, or non-object content
  if (!content || typeof content !== 'object') {
    return true;
  }

  // Check if content has the expected Tiptap structure
  if (!content.type || !Array.isArray(content.content)) {
    return true;
  }

  // If no content array or empty content array
  if (content.content.length === 0) {
    return true;
  }

  // Recursively check each content item
  function isNodeEmpty(node) {
    // Handle text nodes
    if (node.type === 'text') {
      return !node.text || node.text.trim() === '';
    }

    // Handle nodes without content (like hard breaks, images, etc.)
    if (!node.content || !Array.isArray(node.content)) {
      // Some nodes like hardBreak, image, etc. are considered non-empty
      // You can customize this list based on your needs
      const nonEmptyNodeTypes = ['hardBreak', 'image', 'customImage', 'video', 'audio', 'embed'];
      return !nonEmptyNodeTypes.includes(node.type);
    }

    // If node has no content items, it's empty
    if (node.content.length === 0) {
      return true;
    }

    // Check if all child nodes are empty
    return node.content.every(childNode => isNodeEmpty(childNode));
  }

  // Check if all top-level content nodes are empty
  return content.content.every(node => isNodeEmpty(node));
}
