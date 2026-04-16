function prodContentReadMore(content, button) {
    if (content && button) {
        content.classList.toggle('show');
        button.textContent = content.classList.contains('show') ? 'Rút gọn' : 'Xem thêm';
    }
}

// function readMoreFullContent(parentSelector) {
//     var content = document.querySelector(parentSelector);
//     if (!content) return;

//     // Tìm tất cả .content-read-more bên trong content
//     var readMoreBlocks = content.querySelectorAll('.content-read-more');
//     readMoreBlocks.forEach(elReadMore => {
//         elReadMore.innerHTML = '<button>Xem thêm</button>';
//     });

//     var buttons = content.querySelectorAll('.content-read-more button');
//     if (!buttons.length) return;

//     buttons.forEach(button => {
//         button.addEventListener('click', function () {
//             prodContentReadMore(content, button);
//         });
//         button.addEventListener('touchstart', function () {
//             prodContentReadMore(content, button);
//         }, { passive: true });
//     });

//     let contentHeight = content.offsetHeight;
//     let maxHeight = window.innerWidth <= 768 ? 300 : 488;

//     console.log('contentHeight =', contentHeight);
//     console.log('maxHeight =', maxHeight);

//     readMoreBlocks.forEach(block => {
//         if (contentHeight > maxHeight) {
//             buttons.forEach(btn => {
//                 btn.textContent = 'Xem thêm';
//             });
//             block.style.display = 'block';
//             content.classList.remove('show');
//         } else {
//             block.style.display = 'none';
//         }
//     });
// }

function readMoreFullContent(parentSelector) {
    const content = document.querySelector(parentSelector);
    if (!content) return;

    const readMoreBlocks = content.querySelectorAll('.content-read-more');
    if (!readMoreBlocks.length) return;

    const contentHeight = content.scrollHeight;
    const maxHeight = window.innerWidth <= 768 ? 300 : 488;

    //  REMOVE show ngay từ đầu
    content.classList.remove('show');

    readMoreBlocks.forEach(elReadMore => {
        const oldBtn = elReadMore.querySelector('button');

        // 1. Lưu attribute
        const savedAttrs = {};
        if (oldBtn) {
            [...oldBtn.attributes].forEach(attr => {
                savedAttrs[attr.name] = attr.value;
            });
        }

        // 2. Recreate button
        elReadMore.innerHTML = '';
        const newBtn = document.createElement('button');

        Object.keys(savedAttrs).forEach(name => {
            newBtn.setAttribute(name, savedAttrs[name]);
        });

        newBtn.textContent = 'Xem thêm';

        // 3. Click = TOGGLE DUY NHẤT
        newBtn.addEventListener('click', function () {
            prodContentReadMore(content, newBtn);
        });

        elReadMore.appendChild(newBtn);

        // 4. Chỉ quyết định có hiện nút hay không
        elReadMore.style.display =
            contentHeight > maxHeight ? 'block' : 'none';
    });
}

function enableStickyColLeft($parent) {
  const colLeft = document.querySelector($parent + ' .col-left');
  const colRight = document.querySelector($parent + ' .col-right');
  const wrapper = document.querySelector($parent + ' .wrap-content');
  const header = document.querySelector('header');
  const extraTopOffset = 15;
  if (!colLeft || !colRight || !wrapper) return;

  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    colLeft.classList.remove('scoll');
    colLeft.style.position = '';
    colLeft.style.bottom = '';
    colLeft.style.top = '';
    return;
  }
const isTablet = window.innerWidth < 992;

  const scrollY = window.pageYOffset;
  let headerHeight = header ? header.offsetHeight : 0;
  if(isTablet){
    headerHeight = headerHeight + 32;
  }
  const wrapTop = wrapper.offsetTop;
  const wrapHeight = wrapper.offsetHeight;
  const wrapBottom = wrapTop + wrapHeight;
  const colLeftHeight = colLeft.offsetHeight;
  const scrollBottom = scrollY + headerHeight + colLeftHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  

  if (scrollY >= wrapTop - headerHeight && scrollBottom < wrapBottom) {
    // Đang trong vùng "fixed"
    colLeft.classList.add('scoll');
    colLeft.style.top = (headerHeight+ scrollTop - wrapTop  + extraTopOffset) + 'px';
    colLeft.style.bottom = '';
  } else if (scrollBottom >= wrapBottom) {
    // Đã cuộn vượt quá đáy wrapper
    colLeft.classList.remove('scoll');
    colLeft.style.top = 'auto';
    colLeft.style.bottom = '0';
  } else {
    // Chưa đến vùng sticky
    colLeft.classList.remove('scoll');
    colLeft.style.top = '';
    colLeft.style.bottom = '';
  }
}

