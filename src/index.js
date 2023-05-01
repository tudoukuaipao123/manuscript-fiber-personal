
import Zhang from './zhangReact/index.js';
console.log('Zhang', Zhang);

const data = {
  item1: 'bb',
  item2: 'cc',
}

const jsxEle = (
  <ul className="list">
      <li className="item" style={{ background: 'blue', color: 'pink' }} onClick={() => alert(2)}>aa</li>
      <li className="item">{data.item1}<i>xxx</i>yyyy</li>
      <li className="item">{data.item2}</li>
  </ul>
);
console.log('result jsx', jsxEle);
Zhang.render(jsxEle, document.getElementById('app'));
