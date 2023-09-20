var productsApi = "http://localhost:3000/api/v1/products?page=1&pageSize=20";

async function start() {
  await getProductions(renderProducts);
  
  // handleAddForm();
  // handCreateProducts();
}

let itemId;

start();
//function
async function getProductions(callback) {
  console.log(1);
  var option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6Im5ndW9pZHVuZyIsImVtYWlsIjoiZW1haWxAZ21haWwuY29tIiwicm9sZSI6dHJ1ZX0sImlhdCI6MTY1Mjg3MTg0OCwiZXhwIjoxNjUyODc1NDQ4fQ.IgSru5VH-BgvLgcnQQ2ES0NSvt8JeAdkQcWQKb2tIW0"
    },
  };
  fetch(productsApi, option)
    .then(async function (response) {
      return await response.json();
    })
    // .then((data) => {
    //   console.log(data);
    //   callback(data);
    // })
    .then(callback)
    .catch(err => {
      console.log(err);
    })
}

function renderProducts(res) {
  const products = res.data.products
  console.log(products);
  var listProductsBlock = document.querySelector("#list-products");
  var htmls = products
    .map(function (product) {
      return `
        <tr class="product-item-${product.Id}">
        <td> ${product.Name} </td>
        <td></td>
        <td>${product.Origin}</td>
        <td>${product.Price}</td>
        <td>${product.Amount}</td>
                          <td>
                            <div>
                             <a href="./Production-editing.html"> 
                              <span class="fe fe-24 fe-edit"></span>
                              </a>
                              <a href="" data-toggle="modal" data-target="#deleteproduction">
                                <span class="fe fe-24 fe-trash-2" onclick="setId(${product.Id})"></span>
                              </a>
                            </div>  
                          </td>
                        </tr> 
        `;
    })
    .join("");
  htmls += `
                              <div class="modal fade" id="deleteproduction" tabindex="-1" role="dialog" aria-labelledby="deleteproductionlabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h5 class="modal-title" id="deleteproductionlabel">Xóa sản phẩm</h5>
                                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                    <div class="modal-body"> Bạn có chắc chắn muốn xóa sản phẩm này không </div>
                                    <div class="modal-footer">
                                      <button type="button" class="btn mb-2 btn-secondary" data-dismiss="modal">Không</button>
                                      <button type="button" class="btn mb-2 btn-primary" onclick="handleDeleteProducts()">Đồng ý</button>
                                    </div>
                                  </div>
                                </div>
                              </div> 
    `;
  listProductsBlock.innerHTML = htmls;
}

// newArray = array.filter(item => item.Id != id)

function setId(id) {
  itemId = id;
}

function handleDeleteProducts() {
  console.log(itemId)
  var option = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(productsApi + "/" + itemId, option)
    .then(function (response) {
      response.json();
    })
    .then(function () {
      // var productsItem = document.querySelector('.product-item' + id)
      // if(productsItem){
      //   productsItem.remove();
      // }
      location.reload();
    });
}



function handleCreateProducts() {
  var createBtn = document.querySelector("#create");
  createBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]').value;
    var category = document.querySelector('input[category="category"]').value;
    var formData = {
      name: name,
      category: category,
    };
    createProduct(formData, function () {
      getProductions(renderProducts);
    });
  };
}

function createProduct(data, callback) {
  var option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(productsApi, option)
    .then(function (response) {
      response.json();
    })
    .then(callback);
}

function handleAddForm() {
  var addCateBtn = document.querySelector("#addCategory");

  addCateBtn.onclick = function() {
      var categoryname = document.querySelector(
          'input[name="categoryname"]'
      ).value;
      // console.log(categoryname);
      // alert()
      var FormData = {
          category_name: categoryname,
          category_count: 0,
          isDelete: false,
      };
      addCategories(FormData, function() {
          getCategories(renderCategory);
      });
  };
}

