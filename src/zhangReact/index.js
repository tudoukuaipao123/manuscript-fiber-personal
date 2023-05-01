import ReactElement from './ReactElement.js';
let nextFiberReconcileWork = null; // 下一个需要调度的的fiber节点
let wipRoot = null; // 渲染时的根fiber节点

// 处理当前节点
function reconcile(fiber) {

}

// 该方法做了两个操作，1.处理当前节点 2.定位下一个节点
function performNextWork(fiber) {
  reconcile(fiber);
  if (fiber.child) {
    return fiber.child;
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