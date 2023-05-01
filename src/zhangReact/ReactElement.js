function createTxtElement(text) {
  return {
    type: 'TXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

/**
 * 这里这个createElement 就叫做 render function 渲染方法！
 * 为什么jsx不直接渲染成vdom？因为render function可以加入一些动态的逻辑，加入state，props，也可以包装一下实现组件
 * @param {节点名称 ul/li/div/input……} type 
 * @param {属性 style/onClick/className……} props 
 * @param  {...any} args 之后的属性全为子节点，依次往后排 
 */
const createElement = function(type, props, ...args) {
  /**
   * 这里渲染成这种格式
   * const vdomNode = {
   *  type: type, 某种类型 ul li
   *  props: {
   *    className: xxx,
   *    onClick: xxx,
   *    children: vdomNode(子节点) || 文本节点
   *    nodeValue: 'aaa'
   *  }
   * }
   */
  return {
    type: type,
    props: {
      ...props,
      children: args.map(child => {
        if (typeof child === 'object') {
          return child; //这里不是不处理，是createElement方法会递归调取这个节点，传到这里也变成上方这种格式。
        } else {
          return createTxtElement(child); // 当判断这个子元素不是节点，那么就是文本
        }
      })
    }
  }
}

function setAttribute(dom, key, value) {
  if (key === 'nodeValue') {
    dom.textContent = value;
  }
  if ((key === 'style') && typeof value === 'object') {
    Object.assign(dom.style, value);
  } else if (key.startsWith('on') && typeof value === 'function') {
    const event = key.slice(2).toLowerCase();
    dom.addEventListener(event, value);
  } else if (typeof value !== 'object' && typeof value !== 'object') {
    dom.setAttribute(key, value);
  }
}

// 根据fiber生成dom
function createDom(fiber) {
  let dom = null;
  if (fiber.type == 'TEXT_ELEMENT'){
    dom = document.createTextNode('');
  } else {
    dom = document.createElement(fiber.type);
  }
  const props = fiber.props;
  for(const prop in props ) {
    setAttribute(dom, prop, props[prop]);
  }
  return dom;
}

export default {
  createElement,
  createDom
}