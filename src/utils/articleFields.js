export const FALLBACK_CATEGORY = "Uncategorized";

export function getArticleFields(article) {
  return {
    id: article.id,
    title: article.title,
    author: article.username,
    date: article.created_at,
    category: article.category || FALLBACK_CATEGORY,
  };
}