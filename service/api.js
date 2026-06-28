class ProductService {
    
    getListProduct() {
        const URL = "https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product";

        //pending
        const promise = axios({
            url: URL,
            method: "GET"
        });
        return promise;
    }
    addProduct(product) {
        const URL = "https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product";

        const promise = axios({
            url: URL,
            method: "POST",
            data: product
        });

        return promise;
    }
    editProduct(product) {
        const URL = `https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product/${product.id}`;

        const promise = axios({
            url: URL,
            method: "PUT",
            data: product
        });
        
        return promise;
    }
    deleteProduct(id) {
        const URL = `https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product/${id}`;

        const promise = axios({
            url: URL,
            method: "DELETE"
        });

        return promise;
    }
    searchProduct(keyword) {
        const URL = `https://6a183ccc1878294b597ca2c1.mockapi.io/phone-product?name=${keyword}`;
        const promise = axios({
            url: URL,
            method: "GET"
        });
        return promise;
    }
}
export default ProductService;