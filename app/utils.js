/**
 * Validates an HTML element by its ID
 * @param {string} id
 */
export function validateHtmlElementId(id) {
  if (typeof id === "string") {
    return document.querySelector(`#${id}`) || null;
  }
  return null;
}
