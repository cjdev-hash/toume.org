// Keep metadata and form values plain; style only visible HTML copy.
window.toumeBrand = function toumeBrand(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.includes('toumé') &&
        !node.parentElement.closest('script,style,title,textarea,option,svg,.brand-name')) {
      nodes.push(node);
    }
  }
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    const parts = node.textContent.split('toumé');
    parts.forEach((part, index) => {
      if (index) {
        const word = document.createElement('span');
        word.className = 'brand-name';
        word.append('toum');
        const e = document.createElement('span');
        e.className = 'brand-e';
        e.textContent = 'é';
        word.append(e);
        fragment.append(word);
      }
      fragment.append(part);
    });
    node.replaceWith(fragment);
  }
};
