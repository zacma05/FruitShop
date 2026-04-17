const API_BASE = "http://127.0.0.1:5000";

// ================== RENDER ==================
function renderProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>Không tìm thấy sản phẩm</h4>
            </div>`;
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="col-md-6 col-lg-6 col-xl-4 mb-4">
            <div class="rounded position-relative fruite-item border border-secondary h-100 d-flex flex-column shadow-sm">

                <div class="fruite-img">
                    <img src="/static/img/products/${p.ProductImage || 'default.jpg'}"
                        class="img-fluid w-100 rounded-top"
                        style="height:250px; object-fit:cover;">
                </div>

                <div class="p-4 flex-grow-1 d-flex flex-column">
                    <h4 class="text-primary">${p.ProductName}</h4>

                    <p class="flex-grow-1 text-muted">
                        ${p.Descript || 'Trái cây sạch, tươi ngon mỗi ngày...'}
                    </p>

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <p class="text-dark fs-5 fw-bold mb-0">
                            ${formatVND(p.Price)}
                        </p>

                        <button onclick="addToCart(${p.ProductID})"
                            class="btn border border-secondary rounded-pill px-3 text-primary">
                            <i class="fa fa-shopping-bag me-2"></i> Add
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `).join('');
}
// ================== LOAD DATA ==================
function shopLoadProducts(param = "") {
    let url = "";
    if (!param || param === "All") {
        url = `${API_BASE}/product/getAllProduct`;
    }
    else if (param.startsWith("http")) {
        url = param;
    }
    else {
        url = `${API_BASE}/product/search?keyword=${encodeURIComponent(param)}`;
    }
    fetch(url)
        .then(res => res.json())
        .then(data => renderProducts(data))
        .catch(err => {
            console.error("Lỗi API:", err);
            document.getElementById('product-container').innerHTML =
                `<p class="text-center text-danger">Lỗi kết nối server!</p>`;
        });
}
// ================== FILTER CATEGORY ==================
function filterCategory(categoryName) {
    if (categoryName === "All") {
        shopLoadProducts();
    } else {
        shopLoadProducts(`${API_BASE}/product/category/${encodeURIComponent(categoryName)}`);
    }
}
function loadCategoryCounts() {
    $.ajax({
        url: `${API_BASE}/product/getAllProduct`,
        type: "GET",
        success: function (data) {

            let counts = {
                all: data.length,
                rau: 0,
                fruit: 0,
                bread: 0,
                meat: 0
            };

            data.forEach(p => {
                switch (p.Category) {
                    case "Rau củ":
                        counts.rau++;
                        break;
                    case "Trái cây":
                        counts.fruit++;
                        break;
                    case "Bánh mì":
                        counts.bread++;
                        break;
                    case "Thịt":
                        counts.meat++;
                        break;
                }
            });

            // 👉 Update HTML
            $("#count-all").text(`(${counts.all})`);
            $("#count-rau").text(`(${counts.rau})`);
            $("#count-fruit").text(`(${counts.fruit})`);
            $("#count-bread").text(`(${counts.bread})`);
            $("#count-meat").text(`(${counts.meat})`);
        },
        error: function (err) {
            console.error("Lỗi load count:", err);
        }
    });
}
// ================== SEARCH ==================
function setupSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    if (!input || !btn) return;

    const doSearch = () => {
        const keyword = input.value.trim();
        shopLoadProducts(keyword);
    };

    btn.addEventListener('click', doSearch);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doSearch();
    });

    // debounce (mượt hơn)
    let timer;
    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(doSearch, 400);
    });
}

// ================== ADD TO CART ==================
function addToCart(productId) {
    const userId = localStorage.getItem("accountID");

    if (!userId) {
        alert("Vui lòng đăng nhập!");
        window.location.href = "login.html";
        return;
    }

    fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            account_id: userId,
            product_id: productId
        })
    })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(() => alert("Đã thêm vào giỏ hàng!"))
        .catch(() => alert("Không thể thêm vào giỏ hàng!"));
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {

    shopLoadProducts();
    setupSearch();
    loadCategoryCounts();

});