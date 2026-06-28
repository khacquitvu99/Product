class Action {
    constructor() {
        this.arrProduct = [];
    }
    AddProduct(_product) {
        this.arrProduct.push(_product);
    }
    findIndexProduct(_id) {
        let index = -1;
        for (let i = 0; i < this.arrProduct.length; i++) {
            const product = this.arrProduct[i];
            if (product.id === _id) {
                index = i;
                break;
            }
        }
        return index;
    }
    DeleteProduct(_id) {
        const index = this.findIndexProduct(_id);
        if (index !== -1) {
            this.arrProduct.splice(index, 1);
        }
    }
    EditProduct(_id, _product) {
        const index = this.findIndexProduct(_id);
        if (index !== -1) {
            this.arrProduct[index] = _product;
        }
    }
}
export default Action;