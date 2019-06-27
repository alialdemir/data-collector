import {
  STORAGE_KEY_ELEMENTS
} from './constants';


export const getElements = () => {
  return parseInt(localStorage.getItem(STORAGE_KEY_ELEMENTS), 10) || 0;
};

export const setElements = ElementId => {
  localStorage.setItem(STORAGE_KEY_ELEMENTS, ElementId);
};
