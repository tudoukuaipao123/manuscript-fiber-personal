import ReactElement from './ReactElement.js';
let nextFiberReconcileWork = null; // 下一个需要调度的的fiber节点
let wipRoot = null; // 渲染时的根fiber节点

// 处理fiber和children之间的关系,添加child和sibling的指向
function reconcileChildren(wipFiber, elements) {
  // 关于链表的处理流程
  let index = 0;
  let preSibling = null;

  while(index<elements.length) {
    const element = elements[index];
    let newFiber = {
      dom: null,
      props: element.props,
      type: element.type,
      return: wipFiber,
      effectTag: "PLACEMENT", // 因为这里只处理新增，就写死成PLACEMENT
    }

    // 若是第一个则直接设置父fiber的child，若是相邻的则通过sibling组成链表
    if (index == 0) {
      wipFiber.child = newFiber;
    } else {
      // element.sibling = preSibling;
      preSibling.sibling = newFiber;
    }
    preSibling = newFiber;
    // 注意 这里尽量不要再原来的element上修改，而是新建一个fiber，引用老的props和type
    // preSibling = element; <--所以左侧这种写法错误
    index++;
  }

}

// 处理当前节点，做两件事
function reconcile(fiber) {
  // 1.本fiber节点如果没有dom，则生成dom，挂在当前节点下
  if (!fiber.dom) {
    fiber.dom = ReactElement.createDom(fiber);
  }
  // 2.处理本fiber的children
  reconcileChildren(fiber, fiber.props.children);
}

// 该方法做了两个操作，1.处理当前节点 2.定位下一个节点
function performNextWork(fiber) {
  //1.处理当前节点
  reconcile(fiber);
  //2.定位下一个节点
  console.log('fiber', fiber);
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  // while是确保能一直找到没有sibling也没有父fiber为止，精妙的双层函数循环遍历！！！
  while(nextFiber) {
    // 如果是有兄弟值，则直接返回，下次外面的while方法会把兄弟值再赋进来，达到里外函数配合遍历链表
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 如果没有兄弟值，则返回上一层，如果还没有则继续往上，
    nextFiber = nextFiber.return;
  }

}

function wookloop(deadline) {
  let shouldYield = false; //是否允许暂定
  while(nextFiberReconcileWork && !shouldYield) {
    nextFiberReconcileWork =  performNextWork(nextFiberReconcileWork)// 获取下一个节点
    shouldYield = deadline.timeRemaining() < 1; //超时则停止循环
  }
  if (!nextFiberReconcileWork) {
    // 如果没有下一个节点，说明遍历完了，执行下一个操作commit
  
  }

  // 这里 didTimeout 是指是否超时，如果没有执行，算超时，变为true
  console.log('deadline', deadline,deadline.timeRemaining());
  // requestIdleCallback(wookloop);
}

requestIdleCallback(wookloop);


function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    }
  }
  nextFiberReconcileWork = wipRoot;
}

export default {
  createElement: ReactElement.createElement,
  render: render,
}