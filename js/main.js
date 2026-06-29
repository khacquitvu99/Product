const URL = "https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product";
let globalProducts = [];

function GetID(id) { return document.getElementById(id); }

function ListProduct() {
    const promise = axios({
        url: URL,
        method: "GET",
    });

    promise.then(function (result) {
        globalProducts = result.data;
        renderUI(result.data);
    });

    promise.catch(function (error) {
        console.error("Lỗi lấy dữ liệu API:", error);
    });
}

function renderUI(data) {
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
        <div class="card cardPhone group relative flex flex-col justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5">
            <div class="absolute top-4 left-4 z-10">
                <span class="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">Hot</span>
            </div>
            <div class="overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 min-h-[220px]">
                <img src="./image/${product.image}" class="card-img-top w-full max-w-[160px] h-auto object-contain group-hover:scale-105 transition-transform duration-300" alt="${product.name}">
            </div>
            <div class="card-body flex flex-col flex-grow pt-4">
                <div class="flex justify-between items-start gap-2 mb-2">
                    <div>
                        <h3 class="cardPhone__title text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">${product.name}</h3>
                        <p class="cardPhone__text text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">Màn hình: ${product.Screen}</p>
                        <p class="cardPhone__text text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">Camera Chính: ${product.backCamera}</p>
                    </div>
                    <div class="text-right">
                        <h3 class="cardPhone__title text-xl font-extrabold text-blue-600 dark:text-blue-400">${product.price} vnđ</h3>
                    </div>
                </div>
                <div class="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50 flex justify-between items-center gap-2">
                    <div class="cardPhone__rating flex items-center space-x-0.5 text-amber-400 text-sm">
                        <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
                    </div>
                    <div>
                        <button onclick="addToCart('${product.id}')" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all duration-200">
                            <i class="fa fa-shopping-cart"></i> <span>Buy Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    const contentDiv = GetID("productGrid");
    if (contentDiv) contentDiv.innerHTML = contentHTML;
}

function Search(data) {
    let drop_fill = GetID("fillter").value;

    if (drop_fill === "all" || drop_fill == "") {
        renderUI(globalProducts);
        return;
    }

    const arrNew = [];
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        if (product.type.toLowerCase().includes(drop_fill.toLowerCase())) {
            arrNew.push(product);
        }
    }
    renderUI(arrNew);
}
// Hàm thêm sản phẩm vào LocalStorage khi bấm "Buy Now"
function addToCart(productId) {
    // Tìm sản phẩm được click trong mảng dữ liệu lấy từ API về
    const productTarget = globalProducts.find(item => item.id == productId);
    if (!productTarget) return;

    // Lấy giỏ hàng hiện tại từ localStorage về
    let cartList = JSON.parse(localStorage.getItem("ProductData")) || [];

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const index = cartList.findIndex(item => item.id === productTarget.id);

    if (index === -1) {
        // Nếu chưa có, thêm thuộc tính số lượng (sl) bằng 1
        cartList.push({
            id: productTarget.id,
            name: productTarget.name,
            price: productTarget.price,
            img: productTarget.image,
            sl: 1
        });
    } else {
        // Nếu có rồi, tăng số lượng lên 1
        cartList[index].sl += 1;
    }
    const totalCount = cartList.reduce((sum, item) => sum + item.sl, 0);
    GetID("cartCount").innerHTML = totalCount;

    // Lưu lại vào LocalStorage
    localStorage.setItem("ProductData", JSON.stringify(cartList));
    alert(`Đã thêm sản phẩm ${cartList[index].name} vào giỏ hàng thành công!`);
}
window.addToCart = addToCart;

// Chạy khởi tạo sự kiện cho Hàm Fillter
document.addEventListener("DOMContentLoaded", function () {
    ListProduct();

    const filterSelect = GetID("fillter");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            Search(globalProducts);
        });
    }
});