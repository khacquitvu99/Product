import Action from "./Action.js";

const action = new Action();

function GetID(id) {
    return document.getElementById(id);
}

function renderCart() {
    // Luôn lấy dữ liệu mới nhất từ localStorage mỗi khi render lại
    let cartProduct = JSON.parse(localStorage.getItem("ProductData")) || [];
    let contentCart = "";

    if (cartProduct.length === 0) {
        GetID("displayCart").innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-500">Giỏ hàng trống rỗng!</td></tr>`;
        return;
    }

    for (let i = 0; i < cartProduct.length; i++) {
        let product = cartProduct[i];
        // Đảm bảo số lượng mặc định ít nhất là 1 nếu data chưa có sl
        let quantity = product.sl ? product.sl : 1;
        let thanhTien = product.price * quantity;

        contentCart += `
        <tr class="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
            <td class="py-4 px-6">
                <img src="./../image/${product.img}" class="w-16 h-auto object-contain rounded-xl border p-1 bg-gray-50 dark:bg-gray-800"
                alt="${product.name}">
            </td>
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">${product.name}</td>
            <td class="py-4 px-6 text-center">
                <input type="number" data-id ="${product.id}" class="w-16 border rounded p-1 text-center cart-qty-input" min="1" value="${quantity}"/>
            </td>
            <td class="py-4 px-6 font-mono">$${product.price}</td>
            <td class="py-4 px-6 font-mono font-semibold text-slate-900 dark:text-white td-thanhtien">${thanhTien}</td>
            <td class="py-4 px-6 text-center">
                <button class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer"
                onclick="Delete('${product.id}')">Delete</button>
            </td>
            <td>
                <button class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer" onclick="goPay('${product.id}')">Payment</button>
            </td>
        </tr>`;
    }

    const displayCartElement = GetID("displayCart");
    if (displayCartElement) {
        displayCartElement.innerHTML = contentCart;
    }
}

function Delete(productId) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        // Lấy dữ liệu mới nhất từ LocalStorage
        let cartProduct = JSON.parse(localStorage.getItem("ProductData")) || [];

        // Đồng bộ nạp mảng vào class Action của bạn
        action.arrProduct = cartProduct;

        // Gọi hàm xóa của class Action
        action.DeleteProduct(productId);

        // Lưu lại mảng sau khi đã xóa vào LocalStorage
        localStorage.setItem("ProductData", JSON.stringify(action.arrProduct));

        //Render lại giao diện
        renderCart();
    }
}
window.Delete = Delete;

// Hàm xử lý Lưu thông tin sản phẩm đơn lẻ và chuyển hướng sang trang Pay
function goPay(id) {
    let cartProduct = JSON.parse(localStorage.getItem("ProductData")) || [];
    
    // Đồng bộ dữ liệu hiện tại vào class Action để tìm vị trí
    action.arrProduct = cartProduct;
    const index = action.findIndexProduct(id);

    if (index !== -1) {
        const selectedProduct = action.arrProduct[index];
        
        // Lưu riêng sản phẩm này vào một key tạm gọi là "CheckoutProduct"
        localStorage.setItem("CheckoutProduct", JSON.stringify(selectedProduct));
        
        // Chuyển hướng sang trang thanh toán bằng JavaScript
        window.location.href = "./../view/Pay.html";
    } else {
        alert("Lỗi: Không tìm thấy thông tin sản phẩm để tiến hành thanh toán!");
    }
    console.log(index);
}
window.goPay = goPay;

document.addEventListener("DOMContentLoaded", function () {
    // Gọi hàm hiển thị giỏ hàng lần đầu tiên
    renderCart();

    const displayCart = GetID("displayCart");
    if (displayCart) {
        // Lắng nghe sự kiện 'input' (chạy liên tục khi bấm nút tăng giảm hoặc gõ số)
        displayCart.addEventListener("input", function (event) {
            // Kiểm tra xem phần tử vừa thay đổi có phải là ô nhập số lượng không
            if (event.target.classList.contains("cart-qty-input")) {
                const inputElement = event.target;
                const productId = inputElement.getAttribute("data-id");
                let newQuantity = parseInt(inputElement.value);

                // Phòng hờ người dùng xóa sạch số hoặc nhập số âm
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                    inputElement.value = 1;
                }

                // 1. Lấy giỏ hàng từ LocalStorage ra
                let cartProduct = JSON.parse(localStorage.getItem("ProductData")) || [];

                // 2. Tìm đúng sản phẩm đang được thay đổi số lượng
                const productIndex = cartProduct.findIndex(item => item.id === productId);

                if (productIndex !== -1) {
                    // Cập nhật lại số lượng mới vào mảng
                    cartProduct[productIndex].sl = newQuantity;

                    // Tính toán lại thành tiền mới cho dòng này
                    let updatedThanhTien = cartProduct[productIndex].price * newQuantity;

                    // 3. Cập nhật số tiền mới lên giao diện mà không cần load lại toàn bộ bảng
                    // Tìm đến hàng (tr) chứa ô input này, rồi tìm cột thành tiền (.td-thanhtien) của hàng đó
                    const currentItemRow = inputElement.closest("tr");
                    const thanhTienElement = currentItemRow.querySelector(".td-thanhtien");
                    if (thanhTienElement) {
                        thanhTienElement.innerHTML = `$${updatedThanhTien}`;
                    }

                    // 4. Lưu mảng giỏ hàng mới đã cập nhật số lượng vào LocalStorage
                    localStorage.setItem("ProductData", JSON.stringify(cartProduct));
                }
            }
        });
    }
});
// Chạy ngay khi trang Giỏ hàng tải xong
document.addEventListener("DOMContentLoaded", function () {
    renderCart();
});
