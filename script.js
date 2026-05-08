const menu = [
  { name: '招牌汉堡', desc: '牛肉饼 + 芝士 + 生菜' },
  { name: '香辣鸡腿堡', desc: '微辣酱汁，口感丰富' },
  { name: '培根薯条', desc: '脆薯搭配培根碎' },
  { name: '草莓奶昔', desc: '新鲜草莓，顺滑口感' },
  { name: '凯撒沙拉', desc: '清爽低负担' },
  { name: '番茄意面', desc: '酸甜开胃酱汁' }
];

const grid = document.getElementById('menuGrid');
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');

function render(items) {
  grid.innerHTML = items.map(item => `
    <article class="card">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
    </article>
  `).join('');
}

function filterMenu() {
  const q = input.value.trim();
  if (!q) return render(menu);
  const filtered = menu.filter(item =>
    item.name.includes(q) || item.desc.includes(q)
  );
  render(filtered);
}

btn.addEventListener('click', filterMenu);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') filterMenu();
});

render(menu);
