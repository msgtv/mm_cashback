javascript: (function() {
    const overlay = document.createElement('div');
    const form = document.createElement('form');
  
    const RewardDicount = 'DST';
    const RewardCashback = 'CHK';
  
    const SortDesc = 'DSC';
    const SortTotalCost = 'TTC';
  
    const whatFind = 'bc-id-w-f';
    const percentId = 'bc-id-min-per';
    const howSort = 'bc-id-sort';
    const pageId = 'bc-id-max-page';
    const submitBtn = 'bc-id-smt';
  
    const hostname = 'megamarket.ru';
    const itemsCatalogExample = 'https://megamarket.ru/catalog/';
  
    let style = document.createElement('style');
  
    const cashBackSortType = `<div id="div-${howSort}">
                                <label for="${howSort}">
                                  Сорт-ка:
                                </label>
                                <select id="${howSort}">
                                  <option value="${SortDesc}" selected>По убыв. %</option>
                                  <option value="${SortTotalCost}">Цена-кэшбэк</option>
                                </select>
                              </div>`;
  
    document.addEventListener('change', function(event){
      var target = event.target;
      if (target.id == whatFind) {
        var howSortHTML = document.getElementById(howSort);
        if (target.value == RewardCashback) {
          if (!howSortHTML) {
            var sBtn = document.getElementById(submitBtn);
            sBtn.insertAdjacentHTML('beforebegin', cashBackSortType);
          }
        } else {
          if (howSortHTML) {
            var divSortType = document.getElementById(`div-${howSort}`);
            if (divSortType) divSortType.parentNode.removeChild(divSortType);
          }
        }
      }
    });
  
    function isItemsExists() {
      if (getItems().length) return true;
      return false;
    }
    
    function isFormOpen() {
      return window.bestCashFormOpen;
    }
    
    function formIsOpen() {howSort
      window.bestCashFormOpen = true;	
    }
    
    function formIsClose() {
        window.bestCashFormOpen = false;
    }
  
    function getInput() {
        console.log(`Form is open? Answer: ${window.bestCashFormOpen }`)
  
        if (isFormOpen()) return;
  
      style.innerHTML = `
        label[for="${whatFind}"], label[for="${percentId}"], label[for="${howSort}"], label[for="${pageId}"] {
          display: block;
          margin-bottom: 5px;
        }
  
        #${whatFind}, #${percentId}, #${howSort}, #${pageId} {
          display: block;
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          font-size: 16px;
          border: 2px solid #3498db;
        }
  
        #${submitBtn} {
          display: block;
          margin: 0 auto;
          padding: 5px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          color: #ffffff;
          background-color: #3498db;
        }`;
  
      overlay.id = "bc-id-overlay";
  
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "#0009";
      overlay.style.zIndex = "9998";
  
      form.style.position = "fixed";
      form.style.top = "50%";
      form.style.left = "50%";
      form.style.transform = "translate(-50%, -50%)";
      form.style.padding = "20px";
      form.style.background = "#fff";
      form.style.border = "1px solid; #ccc";
      form.style.zIndex = "9999";
      form.style.borderRadius = "3px";
  
      const formHtml = `<label for="${whatFind}">
                      Что ищем?
                      </label>
                      <select id="${whatFind}">
                        <option value="${RewardCashback}">Кэшбэк</option>
                        <option value="${RewardDicount}" selected>Скидку</option>
                      </select>
                      <label for="${percentId}"">
                      Мин. %:
                      </label>
                      <input type="number" id="${percentId}" name="min-percent" value="" required">
                      <label for="${pageId}">Страниц:</label>
                      <input type="number" id="${pageId}" name="max-page"">
                      <input id="${submitBtn}" type="submit" value="СТАРТ">`
      
      if (getHostname() != hostname) {
          form.tagName = 'DIV';
          formHtml = `<div><h4>Перейдите на <a href="${itemsCatalogExample}">${hostname}</a></h4></div>`;
      } else if (!isItemsExists()) {
        form.tagName = 'DIV';
        formHtml = `<div><h4>Товары не обнаружены</h4></div>`;
      } else {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const percent = parseInt(document.getElementById(percentId).value);
          const page = parseInt(document.getElementById(pageId).value);
          const rewardType = document.getElementById(whatFind).value;
          const sortType = rewardType == RewardCashback ? document.getElementById(howSort).value : undefined;
    
          console.log([percent, delay, page]);
          removeBookmarlet();
    
          start(percent, page, rewardType, sortType);
    
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
      'div.catalog-item-mobile',
      'div.catalog-item',
    ]
  
    const priceSelector = '.item-money .item-price span';
    const bonusSelector = '.item-money .item-bonus span.bonus-amount';
    const discountSelector = 'span[class*="old-price-discount"][class$="price"]'
  
    const rootSelectors = [
      '.catalog-items-list',
    ]
  
    const showMoreBtnSelectors = [
      '.catalog-items-list__show-more',
      '.cnc-catalog-listing__show-more',
      'button.catalog-listing__show-more',
    ]
  
    const outOfStockSelector = '.catalog-listing__out-of-stock_items'
    const outOfStockSelectors = ['.catalog-items-list__out-of-stock-heading']
  
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
  
    function isOutOfStockExists() {
      for (var sel of outOfStockSelectors) {
        if (document.querySelectorAll(sel).length) return true;
      }
      return false;
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
  
    function parsing(percents, root, rewardType, sortType, items=[]) {
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
              if (rewardType == RewardCashback) {
                bSpan.textContent += ` [${ps}%]`
                var totalCost = p - b;
                bSpan.dataset['totalCost'] = totalCost;
                item.querySelector(priceSelector).insertAdjacentHTML('beforebegin',
                `<span style="color:green;">${totalCost} ₽</span><br>`)
              };
              bSpan.dataset['percents'] = ps;
          } catch {
              continue;
          }
      }
  
      root.innerHTML = '';
      var sortingFunc = sortType == SortTotalCost ? sortingByTotalCost : sortingByPercentDesc;
      newItems.sort(sortingFunc);
      newItems.forEach((el, index) => root.appendChild(el));
  
      console.log('end parsing');
      console.log(`elements - ${newItems.length}`);
  
      return {items: items, newItems: newItems};
    }
  
    function getDataPercents(tag, datasetName) {
      return parseInt(tag.querySelector(bonusSelector).dataset[datasetName]);
    }
  
    function sortingByPercentDesc(a, b) {
      // Сортировка по убыванию %
      var aPer = getDataPercents(a, 'percents');
      var bPer = getDataPercents(b, 'percents');
      if (aPer > bPer) return -1;
      if (aPer == bPer) return 0;
      if (aPer < bPer) return 1;
    }
  
    function sortingByTotalCost(a, b) {
      var aTotalCost = getDataPercents(a, 'totalCost');
      var bTotalCost = getDataPercents(b, 'totalCost');
  
      if (aTotalCost > bTotalCost) return 1;
      if (aTotalCost == bTotalCost) return 0;
      if (aTotalCost < bTotalCost) return -1;
    }
    function delay() {
      return new Promise(resolve => setTimeout(resolve, 3000));
    }
  
    async function paginateWithCollectItems(maxPage, curPage=0, items=[]) {    
        let btn = getMoreBtn();
        
        curPage += 1;
        console.log(`page - ${curPage}`);
        
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
  
        if (isOutOfStockExists()) {
          removeOutOfStock();
          removeItemFromPage(btn);
          return items;
        }
        
        if (btn) {
            btn.click();
            await delay();
            return await paginateWithCollectItems(maxPage, curPage, items);
        } else {
            console.log('no btn');
            return items;
        }
    }
  
    async function startParsing(pCount, maxPage, rewardType, sortType, curPage=0) {
      // старт парсинга
      items = await paginateWithCollectItems(
          maxPage,
          curPage
      )
  
      let root = getRoot();
      data = parsing(pCount, root, rewardType, sortType, items);
      return data;
    }
  
    function getHostname() {
      // получить текущий адрес сайта
      return window.location.hostname;
    }
  
    function start(pCount, maxPage, rewardType, sortType) {
      // pCount: минимальный процент кэшбэка, например 73
      // maxPage: максимальное количество страниц пагинации
      if (pCount < 0) pCount = 0;
      data = startParsing(pCount, maxPage, rewardType, sortType,  0);
      
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
  