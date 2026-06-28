import ProductService from "./../service/api.js";
import validation from "./Validation.js";

const productService = new ProductService();
const Validation = new validation();
let globalProducts = [];

function GetID(id) { return document.getElementById(id); }

function renderUI(data) {
    let contentHTML = "";
    for (let i = 0; i < data.length; i++) {
        const product = data[i];
        contentHTML += `
        <tr class="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">${product.id}</td>
            <td class="py-4 px-6">
                <img src="./../image/${product.image}" class="w-16 h-auto object-contain rounded-xl border p-1 bg-gray-50 dark:bg-gray-800"
                alt="${product.name}">
            </td>
            <td class="py-4 px-6 font-medium text-slate-900 dark:text-white">${product.name}</td>           
            <td class="py-4 px-6 font-mono">${product.Screen}</td>
            <td class="py-4 px-6 font-mono">${product.frontCamera}</td>
            <td class="py-4 px-6 font-mono">${product.backCamera}</td>
            <td class="py-4 px-6 font-mono">${product.type}</td>
            <td class="py-4 px-6 font-mono">${product.price}</td>
            <td class="py-4 px-6 font-mono">${product.desc}</td>
            <td>
                <button
                data-modal-target="crud-modal"
                data-modal-toggle="crud-modal"
                class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer" onclick="dialogEdit('${product.id}')">Edit</button>
            </td>
            <td>
                <button class="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer" onclick="DeleteProduct('${product.id}')">Delete</button>
            </td>
        </tr>`;
    }

    const contentDiv = GetID("manadisplay");
    if (contentDiv) contentDiv.innerHTML = contentHTML;

    if (typeof initModals === 'function') {
        initModals();
    }
}

function ListProduct() {
    const promise = productService.getListProduct();

    promise.then(function (result) {
        globalProducts = result.data;
        renderUI(result.data);
    });

    promise.catch(function (error) {
        console.error("Lỗi lấy dữ liệu API:", error);
    });
}
ListProduct();
function getInfoProduct() {
    let lst = {
        name: GetID("txt_name").value,
        image: GetID("txt_img").value,
        Screen: GetID("txt_screen").value,
        frontCamera: GetID("txt_frcamera").value,
        backCamera: GetID("txt_bacamera").value,
        type: GetID("txt_type").value,
        price: GetID("txt_price").value,
        desc: GetID("txt_desc").value,
    }
    return lst;
}
function testValidation() {
    const infoProduct = getInfoProduct();
    if (!Validation.testEmpty(("tb_name"), (GetID("txt_name").value), "Không được để trống!!")) return false;
    if (!Validation.testEmpty(("tb_anh"), (GetID("txt_img").value), "Không được để trống!!")) return false;
    if (!Validation.testEmpty(("tb_manhinh"), (GetID("txt_screen").value), "Không được để trống!!")) return false;
    if (!Validation.testEmpty(("tb_camtruoc"), (GetID("txt_frcamera").value), "Không được để trống!!")) return false;
    if (!Validation.testEmpty(("tb_camsau"), (GetID("txt_bacamera").value), "Không được để trống!!")) return false;
    if (!Validation.testEmpty(("tb_gia"), (GetID("txt_price").value), "Không được để trống!!")) return false;
    if (GetID("txt_type").value == "all") {
       GetID("tb_type").innerHTML = "Chưa chọn Hãng SX";
        GetID("tb_type").style.display = "block";
        return false;
    }
    else {GetID("tb_type").style.display = "none";
        return true;
    }

    if (!Validation.testLength(("tb_desc"), (GetID("txt_desc").value), "Không được để trống!!", 0, 50)) return false;


    return true;
};

function AddProduct() {
    if (testValidation()) {
        const productData = getInfoProduct();
        const promise = productService.addProduct(productData);
        promise.then(function (result) {
            ListProduct();

            alert(`Sản Phẩm ${productData.name} được thêm thành công!!`);
            GetID("xclose").click();
        }).catch(function (error) {
            console.error("Error adding product:", error);
        });
    };
}

const dialogAdd = GetID("btn__addnew");
dialogAdd.onclick = function () {
    const btnAdd = "<button type = 'button' onclick = 'AddProduct()' class='text-white text-sm font-medium bg-blue-700  hover:bg-blue-800 rounded-lg px-5 py-2.5'>Add Product</button>";

    GetID("footbutton").innerHTML = btnAdd;
    GetID("title").innerHTML = "Create new product";
    GetID("formproduct").reset();
}

function EditProduct(_id) {
    const promise = productService.editProduct({
        id: _id,
        name: GetID("txt_name").value,
        image: GetID("txt_img").value,
        Screen: GetID("txt_screen").value,
        frontCamera: GetID("txt_frcamera").value,
        backCamera: GetID("txt_bacamera").value,
        type: GetID("txt_type").value,
        price: GetID("txt_price").value,
        desc: GetID("txt_desc").value
    });

    promise.then(function (result) {

        ListProduct();
        GetID("xclose").click();
        alert(`Sản Phẩm ${result.data.name} cập nhật thành công!!`);
    }).catch(function (error) {
        console.error("Error editing product:", error);
    });
};
function dialogEdit(_id) {
    const btnEdit = `<button type = 'button' onclick="EditProduct('${_id}')" class='text-white text-sm font-medium bg-blue-700  hover:bg-blue-800 rounded-lg px-5 py-2.5'>Upadte</button>`;

    GetID("footbutton").innerHTML = btnEdit;
    GetID("title").innerHTML = "Update Product";

    const promise = productService.getListProduct();
    promise.then(function (result) {
        const product = result.data.find(p => p.id === _id);
        
        GetID("txt_name").value = product.name;
        GetID("txt_img").value = product.image;
        GetID("txt_screen").value = product.Screen;
        GetID("txt_frcamera").value = product.frontCamera;
        GetID("txt_bacamera").value = product.backCamera;
        GetID("txt_type").value = product.type;
        GetID("txt_price").value = product.price;
        GetID("txt_desc").value = product.desc;
    }).catch(function (error) {
        console.error("Error product details:", error);
    });
};

function DeleteProduct(id) {
    const promise = productService.deleteProduct(id);

    promise.then(function (result) {
        ListProduct();
        alert("Sản phẩm đang được xóa!!");
    }).catch(function (error) {
        console.error("Error deleting product:", error);
    });
};

function Search(data) {
    let drop_fill = GetID("search").value;

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
// Chạy khởi tạo sự kiện cho Hàm Fillter
document.addEventListener("DOMContentLoaded", function () {
    ListProduct();

    const filterSelect = GetID("search");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            Search(globalProducts);
        });
    }
});

window.AddProduct = AddProduct;
window.EditProduct = EditProduct;
window.dialogAdd = dialogAdd;
window.dialogEdit = dialogEdit;
window.DeleteProduct = DeleteProduct;
