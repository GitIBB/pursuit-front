// formats dates to a user-friendly format
// ex: Converts "2023-10-01T12:00:00Z"
// to "October 1, 2023"
// to be used in article listings, comments, etc.
// Uses the browser's locale settings for formatting

export function dateFormatter(date) {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
  });
}