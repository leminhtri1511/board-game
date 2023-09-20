var listCustomerBlock = document.querySelector('#list-customers');

var customerApi = 'http://localhost:3000/customer';

function start() {
    getCustomers(renderCustomer)
}

start();


//function
function getCustomers(callback) {
    fetch(customerApi).then(function(reponse) {
            return reponse.json();
        })
        .then(callback);
}

function renderCustomer(customers) {
    var listCustomerBlock = document.querySelector('#list-customers');
    var htmls = customers.map(function(customers) {
        return `
        <tr>
            <th scope="col">${customers.id}</th>
            <td>${customers.username}</td>
            <td>${customers.name}</td>
            <td>${customers.email}</td>
            <td>${customers.address.street}, ${customers.address.city}</td>
            <td>${customers.phone}</td>
            <td>
                <div>
                    <span type="button" data-toggle="modal" class="fe fe-24 fe-unlock" data-target="#lockAccount" data-name="${customers.username}"></span>
                </div>
            </td>
        </tr>
        `;
    });
    listCustomerBlock.innerHTML = htmls.join('');


}