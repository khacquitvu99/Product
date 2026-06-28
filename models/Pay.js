import Action from "./Action.js"

const action = new Action();
function GetId(id) {return document.getElementById(id);}
function renderPaySingle() {
    // Chỉ lấy duy nhất sản phẩm vừa được bấm Thanh toán
    let product = JSON.parse(localStorage.getItem("CheckoutProduct"));

    if (!product) {
        document.getElementById("payment").innerHTML = `<tr><td colspan="5" class="text-center py-4">Chưa chọn sản phẩm thanh toán!</td></tr>`;
        return;
    }

    let quantity = product.sl ? product.sl : 1;
    let thanhTien = product.price * quantity;

    let contentPay = `
    <tr>
        <td class="py-4 px-6"><img src="./../image/${product.img}" class="w-16"></td>
        <td class="py-4 px-6">${product.name}</td>
        <td class="py-4 px-6 text-center">${quantity}</td>
        <td class="py-4 px-6">${product.price}</td>
        <td class="py-4 px-6 font-semibold text-red-500">${thanhTien} VNĐ</td>
    </tr>`;

    GetId("payment").innerHTML = contentPay;
    GetId("subtotalPrice").innerHTML=`${thanhTien} VNĐ`;
    GetId("totalPayPrice").innerHTML=`${thanhTien} VNĐ`;
   
}
document.addEventListener("DOMContentLoaded", renderPaySingle);

// Chờ HTML tải xong rồi mới gán sự kiện cho nút bấm để tránh lỗi null
document.addEventListener("DOMContentLoaded", function() {
    renderPaySingle();

    const buttonConfirm = GetId("confiPay");
    if (buttonConfirm) {
        buttonConfirm.onclick = function() {
            // Lấy thông tin sản phẩm đang thanh toán từ bộ nhớ tạm ra
            let currentProduct = JSON.parse(localStorage.getItem("CheckoutProduct"));
            
            if (!currentProduct) {
                alert("Không tìm thấy thông tin sản phẩm cần thanh toán!");
                return;
            }

            if (confirm("Chúc mừng thanh toán thành công!!")) {
                // 1. Lấy giỏ hàng tổng từ LocalStorage ra
                let cartProduct = JSON.parse(localStorage.getItem("ProductData")) || [];

                // 2. Nạp mảng vào class Action
                action.arrProduct = cartProduct;

                // 3. XỬ LÝ XÓA: Truyền id của sản phẩm đang mua vào để xóa khỏi giỏ hàng tổng
                action.DeleteProduct(currentProduct.id);

                // 4. Lưu lại mảng giỏ hàng mới vào LocalStorage
                localStorage.setItem("ProductData", JSON.stringify(action.arrProduct));

                // 5. Xóa bộ nhớ tạm CheckoutProduct
                localStorage.removeItem("CheckoutProduct");

                // 6. Quay lại giỏ hàng
                window.location.href = "./../view/Cart.html";
            }
        };
    }
});