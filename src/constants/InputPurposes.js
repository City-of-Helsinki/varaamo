// On this (ref1) page you can find a list of "content purposes" that
// should be included within the taxonomy of the web page. The actual
// content of the link is convoluted, but the above mostly just means
// that assistive and autofill technologies treat these strings as
// special cases. In this project, they were set up to add support for
// autofill.

// ref1: https://www.w3.org/TR/WCAG21/#input-purposes

export const INPUT_PURPOSES = Object.freeze({
  NAME: 'name', // Full name
  GIVEN_NAME: 'given-name', // Given name (in some Western cultures, also known as the first name)
  FAMILY_NAME: 'family-name', // Family name (in some Western cultures, also known as the last name or surname)
  STREET_ADDRESS: 'street-address', // Street address (multiple lines, newlines preserved)
  // The second administrative level, in addresses with two or more
  // administrative levels; in the countries with two administrative
  // levels, this would typically be the city, town, village, or other
  // locality within which the relevant street address is found
  ADDRESS_LEVEL_2: 'address-level2',
  // Postal code, post code, ZIP code, CEDEX code (if CEDEX, append
  // "CEDEX", and the dissement, if relevant, to the address-level2
  // field)
  POSTAL_CODE: 'postal-code',
  TEL: 'tel', // Full telephone number, including country code
  EMAIL: 'email', // E-mail address
});
