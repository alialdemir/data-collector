export const STORAGE_KEY_ELEMENTS = 'SELECTED_ELEMENT';
export const SELECTABLE_DOMS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'img',
  'a',
  'li',
  'b',
  'i',
  'strong',
  'span',
  'cite',
  'div:not(:has(div, p))',
  'td:not(:has(td, img))',
  'th',
  'dd',
  'dt',
  'code',
];
export const DISALLOWED_CHILDREN = [
  "div",
  "p",
  "td",
  "img",
  "li"
];

export const RESERVED_CLASSNAMES = [
  "data-collector-intro-modal",
  "data-collector-sidebar",
  "data-collector-selected_dom",
  "hopscotch-bubble",
  "hopscotch-bubble-container",
  "hopscotch-bubble-number",
  "hopscotch-bubble-content",
  "hopscotch-title",
  "hopscotch-content"
];

export const RESERVED_CLASS_CHARACTERS = [
  "$",
  "(",
  ")",
  ":",
  ","
];

export const IGNORED_SIBLINGS = [
  "#text",
  "#comment",
  "SCRIPT"
];

export const IGNORED_DOMS = [
  "tbody",
  "thead"
];
