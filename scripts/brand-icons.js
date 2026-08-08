'use strict';

window.OMAR_BRANDS = {
  render(item) {
    if (!item.iconImage) return null;

    const wrapper = document.createElement('span');
    wrapper.className = 'brand-icon';

    const img = document.createElement('img');
    img.src = item.iconImage;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';

    wrapper.appendChild(img);

    return wrapper;
  }
};
