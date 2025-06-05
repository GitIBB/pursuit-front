// Extracts plain text from a JSON string, parses it, and recursively extracts all plain text from the JSON.

export default function extractPlainText (jsonString) {
  try {
    if (!jsonString) {
      return '';
    }
    const { root: jsonRoot } = JSON.parse(jsonString);

    const extractText = (node) => {
      if (node.type === 'text') {
        return node.text || '';
      }
      if (node.children) {
        return node.children.map(extractText).join(' ');
      }
      return '';
    };

    return extractText(jsonRoot);
  } catch (error) {
    console.error('Failed to parse editor state:', error);
    return '';
  }
};