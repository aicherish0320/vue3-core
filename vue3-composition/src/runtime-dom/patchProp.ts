function patchClass(el, value) {
  if (!value) {
    value = ''
  }
  el.className = value
}

function patchStyle(el, prev, next) {
  const style = el.style
  if (!next) {
    el.removeAttribute('style')
  } else {
    for (const key in next) {
      style[key] = next[key]
    }
    if (prev) {
      for (const key in prev) {
        if (!next[key]) {
          style[key] = ''
        }
      }
    }
  }
  // el.setAttribute('style', style)
}

function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}

export function patchProp(el, key, prevVal, nextVal) {
  switch (key) {
    case 'class':
      patchClass(el, nextVal)
      break
    case 'style':
      patchStyle(el, prevVal, nextVal)
      break
    default:
      patchAttr(el, key, nextVal)
      break
  }
}
