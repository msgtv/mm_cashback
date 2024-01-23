javascript: (function() {RewardCashback
  const overlay = document.createElement('div');
  const form = document.createElement('form');

  const RewardDicount = 'DISCOUNT';
  const RewardCashback = 'CASHBACK';

  const whatFind = 'bc-id-what-find';
  const percentId = 'bc-id-min-percent';
  const delayId = 'bc-id-delay';
  const pageId = 'bc-id-max-page';
  const submitBtn = 'bc-id-submit';

  const hostname = 'megamarket.ru';
  const itemsCatalogExample = 'https://megamarket.ru/catalog/';

  let style = document.createElement('style');

  function isItemsExists() {
    if (getItems().length) return true;
    return false;
  }
  
  function isFormOpen() {
    return window.bestCashFormOpen;
  }
  
  function formIsOpen() {
    window.bestCashFormOpen = true;	
  }
  
  function formIsClose() {
      window.bestCashFormOpen = false;
  }

  function getInput() {
  	console.log(`Form is open? Answer: ${window.bestCashFormOpen }`)

  	if (isFormOpen()) return;

    style.innerHTML = `
      label[for="${whatFind}"], label[for="${percentId}"], label[for="${delayId}"], label[for="${pageId}"] {
        display: block;
        margin-bottom: 5px;
        font-size: 12px;
        color: #333;
      }

      #${whatFind}, #${percentId}, #${delayId}, #${pageId} {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        font-size: 16px;
        border: 2px solid #3498db;
        border-radius: 5px;
        transition: border-color 0.3s;
      }

      #${whatFind}:focus, #${percentId}:focus, #${delayId}:focus, #${pageId}:focus {
        outline: none;
        border-color: #2ecc71;
      }

      #${whatFind}:hover, #${percentId}:hover, #${delayId}:hover, #${pageId}:hover {
        border-color: #2ecc71;
      }

      #${submitBtn} {
        display: block;
        margin: 0 auto;
        padding: 5px 20px;
        font-size: 16px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        border: 2px solid #3498db;
        border-radius: 5px;
        color: #ffffff;
        background-color: #3498db;
        transition: background-color 0.3s, color 0.3s, border-color 0.3s;
      }

      #${submitBtn}:hover {
        background-color: #ffffff;
        color: #3498db;
      }
    `;

    overlay.id = "bc-id-overlay";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998";

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.padding = "20px";
    form.style.background = "#fff";
    form.style.border = "1px solid; #ccc";
    form.style.boxShadow = "rgb(255 255 255) 0px 0px 10px";
    form.style.zIndex = "9999";
    form.style.borderRadius = "3px";

    let formHtml = `<label for="${whatFind}">
                    Что ищем?
                    </label>
                    <select name="select" id="${whatFind}">
                      <option value="${RewardCashback}" selected>Кэшбэк</option>
                      <option value="${RewardDicount}">Скидку</option>
                    </select>
                    <label for="${percentId}"">
                    Минимальный процент:
                    </label>
                    <input type="number" id="${percentId}" name="min-percent" value="" required">
                    <label for="${delayId}"">Задержка (оптимальное - 3 сек.):</label>
                    <input type="number" id="${delayId}" name="delay" value="3" required">
                    <label for="${pageId}">Страниц:</label>
                    <input type="number" id="${pageId}" name="max-page"">
                    <input id="${submitBtn}" type="submit" value="СТАРТ">`
    
    if (getHostname() != hostname) {
        form.tagName = 'DIV';
        formHtml = `<div><h4>Сначала перейдите на сайт Мегамаркет (<a href="${itemsCatalogExample}">${hostname}</a>)</h4></div>`;
    } else if (!isItemsExists()) {
      form.tagName = 'DIV';
      formHtml = `<div><h4>Сначала выберите любую категорию товаров из каталога <a style='font-weight: bold;' href="${itemsCatalogExample}">${hostname}</a></h4></div>`;
    } else {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const percent = parseInt(document.getElementById(percentId).value);
        const delay = parseInt(document.getElementById(delayId).value);
        const page = parseInt(document.getElementById(pageId).value);
        const rewardType = document.getElementById(whatFind).value;
  
        console.log([percent, delay, page]);
        removeBookmarlet();
  
        start(percent, delay, page, rewardType);
  
        formIsClose()
      });
    }

    form.insertAdjacentHTML(
      'beforeend',
      formHtml
    );

    addBookmarlet();

		

		overlay.addEventListener('click', removeBookmarlet, { once: true });
  }

  function addBookmarlet() {
    document.body.insertAdjacentElement('beforeend', overlay);
    document.body.insertAdjacentElement('beforeend', form);
    document.head.insertAdjacentElement('beforeend', style);

    formIsOpen();
  }

  function removeBookmarlet() {
    form.parentNode.removeChild(form);
		overlay.parentNode.removeChild(overlay);
    style.parentNode.removeChild(style);

    formIsClose();
  }

  const itemsSelectors = [
    '.cnc-catalog-listing__items .catalog-item-mobile',
    '.catalog-listing__items .ddl_product',
    '.catalog-items-list .catalog-item-mobile',
    '.catalog-items-list .ddl_product',
  ]

  const priceSelector = '.item-money .item-price span';
  const bonusSelector = '.item-money .item-bonus span.bonus-amount';
  const discountSelector = 'span[class*="old-price-discount"][class$="price"]'

  const rootSelectors = [
    'div.catalog-listing__items.catalog-listing__items_divider',
    '.cnc-catalog-listing__items.cnc-catalog-listing__items_divider',
    '.catalog-items-list'
  ]

  const showMoreBtnSelectors = [
      '.cnc-catalog-listing__show-more',
      'button.catalog-listing__show-more',
      '.catalog-items-list__show-more',
  ]

  const outOfStockSelector = '.catalog-listing__out-of-stock_items'

  window.IntervalNum = 0;

  function getRoot() {
      let root;
      for (let sel of rootSelectors) {
          root = document.querySelector(sel);
          if (root) break;
      }
      return root;
  }

  function getMoreBtn() {
      let btn;
      for (let sel of showMoreBtnSelectors) {
          btn = document.querySelector(sel);
          if (btn) break;
      }
      
      return btn;
  }

  function getPrice(pt) {
      return parseInt(pt.replace(' ', ''));
  }

  function getItems() {
      let items = [];
      for (let sel of itemsSelectors) {
          items = document.querySelectorAll(sel)
          if (items.length) break;
      }
      return Array.from(items);
  }

  function removeItemFromPage(item) {
      item.parentNode.removeChild(item);
  }

  function removeItemsFromPage(items) {
      items.forEach(function(el, i) {
          removeItemFromPage(el);
      })
  }

  function removeOutOfStock() {
      let div = document.querySelector(outOfStockSelector);
      if (div) {
          removeItemFromPage(div);
      }
  }

  function getItemPriceBonusPercents(itemDiv, rewardType) {
    let rewardSelector;
    if (rewardType == RewardCashback) {
      rewardSelector = bonusSelector;
    } else {
      rewardSelector = discountSelector;
    }

    let p = itemDiv.querySelector(priceSelector).textContent;
    let b = itemDiv.querySelector(rewardSelector).textContent;

    pp = getPrice(p);
    bp = getPrice(b);
    if (rewardType == RewardCashback) {
      ps = Math.round(bp / pp * 100);
    } else {
      ps = 100 - Math.round(pp / bp * 100);
    }

    return [pp, bp, ps];

  }

  function parsing(percents, root, rewardType, items=[]) {
      if (!items.length) {
          items = getItems();
      }
      console.log('start parsing');
      let newItems = [];

      for (let item of items) {
          try {
              [p, b, ps] = getItemPriceBonusPercents(item, rewardType);
              if (ps < percents) {
              } else {
                  newItems.push(item);
              }
              
              let bSpan = item.querySelector(bonusSelector);
              if (bSpan.textContent.includes('%')) continue;
              if (rewardType == RewardCashback) bSpan.textContent += ` [${ps}%]`;
              bSpan.dataset['percents'] = ps;
          } catch {
              continue;
          }
      }

      root.innerHTML = '';
      newItems.sort(sortingByPercent);
      newItems.forEach((el, index) => root.appendChild(el));

      console.log('end parsing');
      console.log(`elements - ${newItems.length}`);

      return {items: items, newItems: newItems};
  }

  function sortingByPercent(a, b) {
      aPer = parseInt(a.querySelector(bonusSelector).dataset['percents']);
      bPer = parseInt(b.querySelector(bonusSelector).dataset['percents']);
      if (aPer > bPer) return -1;
      if (aPer == bPer) return 0;
      if (aPer < bPer) return 1;
  }

  function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function paginate(ms, maxPage, curPage=0) {
      let btn = getMoreBtn();
      
      curPage += 1;
      console.log(`page - ${curPage}`);
      
      removeOutOfStock();

      if (maxPage && curPage == maxPage) {
          removeItemFromPage(btn);
          return;
      }
      
      if (btn) {
          btn.click();
          await delay(ms);
          await paginate(ms, maxPage, curPage);
      } else {
          console.log('no btn');
      }
  }

  async function paginateWithCollectItems(ms, maxPage, curPage=0, items=[]) {    
      let btn = getMoreBtn();
      
      curPage += 1;
      console.log(`page - ${curPage}`);
      
      removeOutOfStock();
      
      let newItems;
      while (true) {
          newItems = getItems();
          if (newItems.length) break;
          console.log('page loading waiting...')
          await delay(1000);
      }
      
      removeItemsFromPage(newItems);
      
      items = items.concat(Array.from(newItems));

      if (maxPage && curPage == maxPage || maxPage < 1) {
          removeItemFromPage(btn);
          return items;
      }
      
      if (btn) {
          btn.click();
          await delay(ms);
          return await paginateWithCollectItems(ms, maxPage, curPage, items);
      } else {
          console.log('no btn');
          return items;
      }
  }

  async function startParsing(pCount, ms, maxPage, rewardType, curPage=0) {
    ms *= 1000;
    items = await paginateWithCollectItems(
        ms,
        maxPage,
        curPage
    )

    let root = getRoot();
    data = parsing(pCount, root, rewardType, items);
    return data;
  }

  function getHostname() {
    return window.location.hostname;
  }

  function start(pCount, ms, maxPage, rewardType) {
    // pCount: минимальный процент кэшбэка, например 73
    // ms: задержка для пагинации в с (оптимальное - 3)
    // maxPage: максимальное количество страниц пагинации
    if (pCount < 0) pCount = 0;
    data = startParsing(pCount, ms, maxPage, rewardType, 0);
    return data;
  }

  // для запуска вызови финкцию start с аргументами:
  // 1. минимальный процент кэшбэка
  // 2. ожидание/задержка (в мс)
  // перед переходом  на следующую страницу
  // 3. максимальное количество страницу
  // Пример:
  //        start(50, 3, 10);


  getInput();
})();
