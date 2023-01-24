function matchCase(text, pattern) {
  var result = '';

  for (var i = 0; i < text.length; i++) {
    var c = text.charAt(i);
    var p = pattern.charCodeAt(i);

    if (p >= 65 && p < 65 + 26) {
      result += c.toUpperCase();
    } else {
      result += c.toLowerCase();
    }
  }

  return result;
}

const matchAnalysus = (match) => {
  return matchCase('analysus', match);
};

const replaceOnDocument = (() => {
  const replacer = {
    [Node.TEXT_NODE](node, pattern) {
      node.textContent = node.textContent.replace(pattern, matchAnalysus);
    },
    [Node.ELEMENT_NODE](node, pattern, { attrs, props } = {}) {
      attrs.forEach((attr) => {
        if (typeof node[attr] !== 'function' && node.hasAttribute(attr)) {
          node.setAttribute(
            attr,
            node.getAttribute(attr).replace(pattern, matchAnalysus)
          );
        }
      });
      props.forEach((prop) => {
        if (typeof node[prop] === 'string' && node.hasAttribute(prop)) {
          node[prop] = node[prop].replace(pattern, matchAnalysus);
        }
      });
    },
  };

  return (
    pattern,
    {
      target = document.body,
      attrs: [...attrs] = [],
      props: [...props] = [],
    } = {}
  ) => {
    // Handle `string` — see the last section
    [
      target,
      ...[
        target,
        ...target.querySelectorAll('*:not(script):not(noscript):not(style)'),
      ].flatMap(({ childNodes: [...nodes] }) => nodes),
    ]
      .filter(({ nodeType }) => replacer.hasOwnProperty(nodeType))
      .forEach((node) =>
        replacer[node.nodeType](node, pattern, {
          attrs,
          props,
        })
      );
  };
})();

const replaceAnalysisText = (mutations) => {
  replaceOnDocument(/analysis/gi, {
    attrs: [
      'title',
      'alt',
      'onerror', // This will be ignored
    ],
    props: [
      'value', // Changing an `<input>`’s `value` attribute won’t change its current value, so the property needs to be accessed here
    ],
  });
};

replaceAnalysisText();
