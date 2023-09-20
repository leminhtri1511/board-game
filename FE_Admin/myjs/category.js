// import { json } from "body-parser";
// import { data } from "../../api_nodejs/src/utils/logger";

var listCategoryBlock = document.querySelector("#list-categories");
const cateNameValue = document.getElementById('catename-value');

var categorieApi = "http://localhost:3000/api/v1/categories";

let cateId;

function start() {
    getCategories(renderCategory);

    handleAddForm();
    // handleEditForm();
}

start();

//function
function getCategories(callback) {
    fetch(categorieApi)
        .then(async function(reponse) {
            // console.log(await reponse.json())
            return await reponse.json();
        })
        .then(callback);
}

function addCategories(data, callback) {
    var options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InR1YW4xMjM0NTYiLCJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJyb2xlIjp0cnVlfSwiaWF0IjoxNjUyODcxNjA5LCJleHAiOjE2NTI4NzUyMDl9.Sj-ZiOtHdeym8TYFcH5mQOPJJe3WhkeLuRLq3cCxamM"
        },
        body: JSON.stringify(data),
    };
    fetch(categorieApi, options)
        .then(function(reponse) {
            reponse.json();
        })
        .then(function() {
            location.reload();
        });
}



function renderCategory(res) {
    const categories = res.data.categories;
    console.log(categories);
    var listCategoryBlock = document.querySelector("#list-categories");
    var htmls = categories.map(function(categories, index) {
        return `
        <tr class="category-item-${categories.Id}">
            <th scope="col">${index + 1}</th>
            <td id="catename-value">${categories.Name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <div>
                    <span type="button" onclick="setId(${categories.Id})" data-toggle="modal" class="fe fe-24 fe-edit " data-target="#editCategoryModal" ></span>
                    
                    <span type="button" onclick="setId(${categories.Id})" data-toggle="modal" class="fe fe-24 fe-trash-2" data-target="#removeCategoryModal" ></span>
                    
                </div>
            </td>
        </tr>
        `
    }).join("");
    htmls += `
    <div class="modal fade" id="editCategoryModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editCategoryModalLabel">Sửa tên loại</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="category-name" class="col-form-label">Tên loại:</label>
                            <input type="text" class="form-control" name="newcategoryname" >
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" id="editCate" onclick="editForm()">Cập nhật</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="removeCategoryModal" tabindex="- 1 " role="dialog " aria-labelledby="exampleModalLabel " aria-hidden="true ">
        <div class="modal-dialog modal-sm modal-dialog-centered " role="document ">
            <div class="modal-content ">
                <div class="modal-header border-bottom-0 ">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body text-center ">
                    <h5>Bạn có chắc là muốn xóa "<span id="name">
        </span>"?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary right" data-dismiss="modal">Không</button>
                    <button type="button" class="btn btn-danger" onclick="handleDeleteCategory()">Có</button>
                </div>
            </div>
        </div>
    </div>

    `
    listCategoryBlock.innerHTML = htmls;
}

function setId(id) {
    cateId = id;
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
            name: categoryname,
        };
        addCategories(FormData, function() {
            getCategories(renderCategory);
        });
    };
}

async function handleEditCategory(data, callback) {
    var option = {
        method: 'PATCH',
        headers: {
            'Content-Type': "application/json",
            'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InR1YW4xMjM0NTYiLCJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJyb2xlIjp0cnVlfSwiaWF0IjoxNjUyODcxNjA5LCJleHAiOjE2NTI4NzUyMDl9.Sj-ZiOtHdeym8TYFcH5mQOPJJe3WhkeLuRLq3cCxamM"
        },
        body: JSON.stringify(data),
    };
    await fetch(categorieApi + '/' + cateId, option)
        .then(function(response) {
            response.json();
        })
        .then(function() {
            // var categoryItem = document.querySelector('.category-item-' + id)
            // if (categoryItem) {
            //     categoryItem.remove();
            // }
            location.reload();
        });
}

function editForm() {
    var editCateBtn = document.querySelector("#editCate");

    editCateBtn.onclick = function(e) {
        e.preventDefault();
        var newcategoryname = document.querySelector(
            'input[name="newcategoryname"]'
        ).value;
        console.log(newcategoryname);
        // alert()
        var FormData = {
            name: newcategoryname,
        };
        handleEditCategory(FormData, function() {
            getCategories(renderCategory);
        });
    };
}

function handleDeleteCategory() {
    //console.log(1, id)
    var option = {
        method: 'DELETE',
        headers: {
            'Content-Type': "application/json",
            'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InR1YW4xMjM0NTYiLCJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJyb2xlIjp0cnVlfSwiaWF0IjoxNjUyODcxNjA5LCJleHAiOjE2NTI4NzUyMDl9.Sj-ZiOtHdeym8TYFcH5mQOPJJe3WhkeLuRLq3cCxamM"
        },

    };
    fetch(categorieApi + '/' + cateId, option)
        .then(function(response) {
            response.json();
        })
        .then(function() {
            // var categoryItem = document.querySelector('.category-item-' + id)
            // if (categoryItem) {
            //     categoryItem.remove();
            // }
            location.reload();
        });
}