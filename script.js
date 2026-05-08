const MOCK_RESTAURANTS = [
  { name: '招牌汉堡店', cuisine: '美式快餐', lat: 39.914, lng: 116.404, eta: '25分钟', address: '建国路88号' },
  { name: '川味小馆', cuisine: '川菜', lat: 39.924, lng: 116.414, eta: '30分钟', address: '朝阳路18号' },
  { name: '轻食沙拉吧', cuisine: '轻食', lat: 39.904, lng: 116.384, eta: '20分钟', address: '东三环中路9号' },
  { name: '意面工坊', cuisine: '意式', lat: 39.934, lng: 116.394, eta: '35分钟', address: '工体北路27号' },
  { name: '日式拉面屋', cuisine: '日料', lat: 39.944, lng: 116.424, eta: '40分钟', address: '亮马桥路66号' }
];

const MOCK_GEOCODE = {
  '北京国贸': { lat: 39.908, lng: 116.459 },
  '望京': { lat: 39.998, lng: 116.470 },
  '三里屯': { lat: 39.936, lng: 116.455 },
  '天安门': { lat: 39.908, lng: 116.397 }
};

const grid = document.getElementById('menuGrid');
const addressInput = document.getElementById('addressInput');
const keywordInput = document.getElementById('keywordInput');
const searchBtn = document.getElementById('searchBtn');
const nearbyBtn = document.getElementById('nearbyBtn');
const addressBtn = document.getElementById('addressBtn');
const statusText = document.getElementById('status');

let currentList = [...MOCK_RESTAURANTS];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function render(items) {
  grid.innerHTML = items.map(item => `
    <article class="card">
      <h3>${item.name}</h3>
      <p>类型：${item.cuisine}</p>
      <p>地址：${item.address}</p>
      <p>预计送达：${item.eta}</p>
      <p>距离：${item.distance != null ? item.distance.toFixed(1) + ' km' : '未知'}</p>
      ${item.distance != null && item.distance <= 3 ? '<span class="tag">附近热门</span>' : ''}
    </article>
  `).join('');
}

function sortByDistance(center) {
  return MOCK_RESTAURANTS
    .map(r => ({ ...r, distance: haversine(center.lat, center.lng, r.lat, r.lng) }))
    .sort((a, b) => a.distance - b.distance);
}

function geocodeByAddressMock(address) {
  const key = address.trim();
  return MOCK_GEOCODE[key] || null;
}

function findByAddress() {
  const address = addressInput.value.trim();
  if (!address) {
    statusText.textContent = '请先输入地址。';
    return;
  }

  statusText.textContent = '正在根据地址定位（mock 模式）...';
  const center = geocodeByAddressMock(address);
  if (!center) {
    statusText.textContent = '未命中 mock 地址。可试：北京国贸 / 望京 / 三里屯 / 天安门';
    return;
  }

  currentList = sortByDistance(center);
  render(currentList);
  statusText.textContent = `已按“${address}”附近距离排序（mock 地理编码）。`;
}

function searchByKeyword() {
  const q = keywordInput.value.trim();
  if (!q) return render(currentList);
  render(currentList.filter(r => r.name.includes(q) || r.cuisine.includes(q) || r.address.includes(q)));
}

function findNearbyByBrowser() {
  if (!navigator.geolocation) {
    statusText.textContent = '当前浏览器不支持定位。';
    return;
  }

  statusText.textContent = '正在读取你的定位...';
  navigator.geolocation.getCurrentPosition((pos) => {
    const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    currentList = sortByDistance(center);
    render(currentList);
    statusText.textContent = `已按你的定位排序：${center.lat.toFixed(3)}, ${center.lng.toFixed(3)}`;
  }, () => {
    statusText.textContent = '定位失败：请允许浏览器定位权限。';
  });
}

addressBtn.addEventListener('click', findByAddress);
searchBtn.addEventListener('click', searchByKeyword);
nearbyBtn.addEventListener('click', findNearbyByBrowser);
addressInput.addEventListener('keydown', (e) => e.key === 'Enter' && findByAddress());
keywordInput.addEventListener('keydown', (e) => e.key === 'Enter' && searchByKeyword());

render(currentList);
