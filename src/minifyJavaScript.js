/**
 * Minify JavaScript with a real parser so strings, regular expressions and URLs
 * are never altered by regular-expression-based whitespace stripping.
 */
export async function minifyJavaScript(source, options = {}) {
  const {
    removeComments = true,
    removeWhitespace = true,
    dropConsole = false,
    mangle = false,
  } = options;
  const { minify } = await import('terser');

  const compress = removeWhitespace || dropConsole
    ? {
        ...(removeWhitespace ? { passes: 2 } : {}),
        ...(dropConsole ? { drop_console: true } : {}),
      }
    : false;

  const result = await minify(source, {
    compress,
    mangle: mangle ? { toplevel: false } : false,
    format: {
      comments: removeComments ? false : 'all',
      beautify: !removeWhitespace,
    },
  });

  return result.code ?? '';
}
