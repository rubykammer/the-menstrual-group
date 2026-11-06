export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint, so a saved choice never flashes the
 * other theme. With nothing saved, CSS follows the OS setting on its own.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
