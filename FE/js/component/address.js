import modal from "../utils/modal.js"
import payment from "../payment.js"
import utils from "../utils/utils.js";

import addressAPI from "../api/addressAPI.js"
import api from "../api/api.js";

let addressProvince;
let addressDistrict;
let addressWard;
let addressFullname;
let addressPhone;
let addressAddressDetail;

let id = 4;

const address = {
    provinces: [],
    provinceSelected: {},
    districtSelected: {},
    wardSelected: {},
    fullname: "",
    phone: "",
    addressDetail: "",
    isDefault: false,
    isUpdate: false,
    addressId: "",
    renderHtml() {
        if (document.querySelector(".address")) {
            const addressModal = document.querySelector(".address").closest(".modal");
            addressModal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-body">
                    <div class="address">
                        ${this.isUpdate ? `
                            <span class="address-header">Sửa địa chỉ</span>
                        ` : `
                            <span class="address-header">Địa chỉ mới</span>
                        `}
                        <form class="address-form">
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Họ và tên</label>
                                <input type="text" class="address-form-control" name="addressFullname" value="${this.fullname}">
                                <span class="address-form-message primary-text"></span>
                            </div>
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Số điện thoại</label>
                                <input type="text" class="address-form-control" placeholder="(+84)" name="addressPhone" value="${this.phone}">
                                <span class="address-form-message primary-text"></span>
                            </div>
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Tỉnh/Thành phố</label>
                                <select name="addressProvince" id="" class="address-form-control address-province">
                                    ${this.provinces.map(province => {
                                        return `
                                            <option value="${province.code}" 
                                                ${province.code === this.provinceSelected.code ? "selected" : ""}
                                            >
                                                ${province.name}
                                            </option>
                                        `
                                    }).join("")}
                                </select>
                            </div>
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Quận/Huyện</label>
                                <select name="addressDistrict" id="" class="address-form-control address-district">
                                    ${this.provinces.find(item => {
                                        return item.code === this.provinceSelected.code
                                    }).districts.map(district => {
                                        return `
                                            <option value="${district.code}"
                                                ${district.code === this.districtSelected.code ? "selected" : ""}
                                            >
                                                ${district.name}
                                            </option>
                                        `
                                    }).join("")}
                                </select>
                            </div>
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Phường/Xã</label>
                                <select name="addressWard" id="" class="address-form-control address-ward">
                                    ${this.provinces.find(item => {
                                        return item.code === this.provinceSelected.code
                                    }).districts.find(item => {
                                        return item.code === this.districtSelected.code
                                    }).wards.map(ward => {
                                        return `
                                            <option value="${ward.code}"
                                                ${ward.code === this.wardSelected.code ? "selected" : ""}
                                            >
                                                ${ward.name}
                                            </option>
                                        `
                                    }).join("")}
                                </select>
                            </div>
                            <div class="address-form-group">
                                <label for="" class="address-form-label">Địa chỉ cụ thể</label>
                                <input type="text" class="address-form-control" name="addressAddress" value="${this.addressDetail}">
                                <span class="address-form-message primary-text"></span>
                            </div>
                            ${!this.isUpdate ? `
                                <div class="address-form-group checkbox">
                                    <input type="checkbox" class="address-checkbox" id="address-checkbox" name="addressDefault" ${this.isDefault ? "checked" : ""}>
                                    <label for="address-checkbox">Đặt làm mặc định</label>
                                </div>
                            ` : ``} 
                            <div class="address-form-footer">
                                <span class="btn btn-transparent btn-long modal-close-btn">Trở lại</span>
                                <button class="btn btn-primary btn-long">Hoàn thành</button>
                            </div>
                        </form>
                    </div>
                </div>
            `

            modal.init();
            this.removeEvents();
    
            addressProvince = document.querySelector(".address-province");
            addressDistrict = document.querySelector(".address-district");
            addressWard = document.querySelector(".address-ward");
            addressFullname = document.querySelector("input[name='addressFullname']");
            addressPhone = document.querySelector("input[name='addressPhone']");
            addressAddressDetail = document.querySelector("input[name='addressAddress']");
    
            this.handleEvents();

            Validator({
                form: ".address-form",
                formGroupSelector: ".address-form-group",
                errorSelector: ".address-form-message",
                rules: [
                    Validator.isRequired('input[name="addressFullname"]',"Vui lòng nhập họ và tên"),
                    Validator.isRequired('input[name="addressPhone"]', "Vui lòng nhập email"),
                    Validator.isOnlyNumber('input[name="addressPhone"]', "Vui lòng chỉ nhập số"),
                    Validator.minLength('input[name="addressPhone"]', 10),
                    Validator.maxLength('input[name="addressPhone"]', 11),
                    Validator.isRequired('input[name="addressAddress"]', "Vui lòng nhập địa chỉ"),
                    Validator.minLength('input[name="addressAddress"]', 5),
                ],
                onSubmit: function (data) {
                    address.submitAddressHandler(data);
                }
            })
        }
    },
    async submitAddressHandler(data) {
        const token = utils.getCookie("token");

        let req = {
            userId: utils.getSession("user").Id,
            fullName: data.addressFullname, 
            phone: data.addressPhone, 
            address: utils.attachAddress(address.provinceSelected.name, address.districtSelected.name, address.wardSelected.name, data.addressAddress), 
            isDefault: data.addressDefault ? 1 : 0
        }
        if (address.isUpdate) {
            req = {
                ...req,
                addressId: address.addressId,
                isDefault: null
            }
            await addressAPI.updateAddress(req, token, (res) => {
                if (res.success) {
                    if (req.isDefault) {
                        payment.addressList.forEach(item => {
                            if (item.IsDefault)
                                item.IsDefault = false;
                        })
                    }

                    let oldAddress = payment.addressList.find(item => item.Id == address.addressId);
                    payment.addressList[payment.addressList.indexOf(oldAddress)] = {
                        ...oldAddress,
                        Fullname: req.fullName,
                        Phone: req.phone,
                        Address: req.address,
                        IsDefault: req.isDefault
                    }

                    const modals = Array.from(document.querySelectorAll(".modal"));
                    const addressModal = document.querySelector(".modal .address").closest(".modal");
                    const index = modals.indexOf(addressModal);
                    payment.renderHtml();
                    modal.hiddenModal(index);
                } else {
                    api.errHandler();
                }
            })
        } else {
            await addressAPI.addAddress(req, token, (res) => {
                if (res.success) {
                    const newAddress = {
                        Id: res.data.id,
                        UserId: req.userId,
                        Fullname: req.fullName,
                        Phone: req.phone,
                        Address: req.address,
                        IsDefault: req.isDefault
                    }

                    if (req.isDefault) {
                        payment.addressList.forEach(item => {
                            if (item.IsDefault)
                                item.IsDefault = false;
                        })
                    }
                    payment.addressList.push(newAddress);

                    const modals = Array.from(document.querySelectorAll(".modal"));
                    const addressModal = document.querySelector(".modal .address").closest(".modal");
                    const index = modals.indexOf(addressModal);
                    modal.hiddenModal(index, () => {
                        payment.renderHtml();
                    });
                } else {
                    api.errHandler();
                }
            })
        }
    },
    addressProvinceHandler(e) {
        address.provinceSelected = {...address.provinces.find(item => item.code == e.target.value)};
        address.districtSelected = {...address.provinceSelected.districts[0]}
        address.wardSelected = {...address.districtSelected.wards[0]};
        address.renderHtml();
    },
    addressDistrictHandler(e) {
        address.districtSelected = {...address.provinceSelected.districts.find(item => item.code == e.target.value)};
        address.wardSelected = {...address.districtSelected.wards[0]};
        address.renderHtml();
    },
    infoChangeHandler(e) {
        const input = e.target.closest("input");
        switch (input.name) {
            case "addressFullname":
                address.fullname = input.value;
                break;
            case "addressPhone":
                address.phone = input.value;
                break;
            case "addressAddress":
                address.addressDetail = input.value;
                break;
        }
    },
    removeEvents() {
        if (addressProvince)
            addressProvince.removeEventListener("change", this.addressProvinceHandler);
        if (addressDistrict) 
            addressDistrict.addEventListener("change", this.addressDistrictHandler);
         if (addressFullname) 
            addressFullname.removeEventListener("change", this.infoChangeHandler);
        if (addressPhone) 
            addressPhone.removeEventListener("change", this.infoChangeHandler);
        if (addressAddressDetail) 
            addressAddressDetail.removeEventListener("change", this.infoChangeHandler);
    },
    handleEvents() {
        if (addressProvince) 
            addressProvince.addEventListener("change", this.addressProvinceHandler);
        if (addressDistrict) 
            addressDistrict.addEventListener("change", this.addressDistrictHandler);
        if (addressFullname) 
            addressFullname.addEventListener("change", this.infoChangeHandler);
        if (addressPhone) 
            addressPhone.addEventListener("change", this.infoChangeHandler);
        if (addressAddressDetail) 
            addressAddressDetail.addEventListener("change", this.infoChangeHandler);
    },
    async init(addressId = "", fullname = "", phone = "", addressDetail = "", isDefault = false) {  
        if (this.provinces.length === 0) {
            await addressAPI.getProvine((res) => {
                this.provinces = [...res];
                this.provinceSelected = {...this.provinces[0]};
                this.districtSelected = {...this.provinceSelected.districts[0]}
                this.wardSelected = {...this.districtSelected.wards[0]};
            })
        }
        this.fullname = fullname;
        this.phone = phone;
        if (addressDetail) {
            const detachedAddress = utils.detachAddress(addressDetail);
            const tmpProvince = this.provinces.find(item => item.name === detachedAddress.province);
            if (tmpProvince) {
                this.provinceSelected = {...tmpProvince};
                const tmpDistrict = tmpProvince.districts.find(item => item.name === detachedAddress.district);
                if (tmpDistrict) {
                    this.districtSelected = {...tmpDistrict};
                    const tmpWard = tmpDistrict.wards.find(item => item.name === detachedAddress.ward);
                    if (tmpWard) {
                        this.wardSelected = {...tmpWard};
                    } else {
                        this.wardSelected = {...this.districtSelected.ward[0]};
                    }
                } else {
                    this.districtSelected = {...tmpProvince.districts[0]};
                    this.wardSelected = {...this.districtSelected.wards[0]};
                }
            }
            this.addressDetail = detachedAddress.addressDetail;
            this.isDefault = isDefault;
            this.isUpdate = true;
            this.addressId = addressId;
        } else {
            this.addressDetail = "";
            this.provinceSelected = {...this.provinces[0]};
            this.districtSelected = {...this.provinceSelected.districts[0]}
            this.wardSelected = {...this.districtSelected.wards[0]};
        }
        this.renderHtml();
    }
}

export default address;