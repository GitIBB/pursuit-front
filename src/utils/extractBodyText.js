import extractPlainText from './extractPlainText.jsx';

// Extracts body text from an article object
/**
 * Extracts the introduction, main body, and conclusion text from an article object.
 * @param {Object} article - The article object containing body content.
 * @returns {Object} An object containing the introduction, main body, and conclusion text.
 * does not preserve formatting, only plain text.
 */

export default function extractBodyText(article) {
  const intro = article.body?.content?.introduction
    ? extractPlainText(article.body.content.introduction)
    : '';
  const main = article.body?.content?.mainBody
    ? extractPlainText(article.body.content.mainBody)
    : '';
  const conclusion = article.body?.content?.conclusion
    ? extractPlainText(article.body.content.conclusion)
    : '';

  return {
    introduction: intro,
    mainBody: main,
    conclusion: conclusion,
  };
}