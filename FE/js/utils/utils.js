const utils = {
    formatMoney(money) {
        if (money) {
            let formatMoney = "";
            const moneyStr = money.toString();
            for (let i = 0; i < moneyStr.length; i++) {
                if (i !== 0 && (moneyStr.length - i) % 3 === 0) {
                    formatMoney += ".";
                }
                formatMoney += moneyStr[i];
            }
            return formatMoney;
        }
        return 0;
    },
    inputFormatDate(datetime) {
        const index = datetime.indexOf("T");
        if (index !== -1) {
            const str = datetime.slice(0, index);
            return str;
        }
        return datetime;
    },
    formatDate(datetime) {
        const index = datetime.indexOf("T");
        if (index !== -1) {
            const str = datetime.slice(0, index);
            const arr = str.split("-");
            let dateStr = "";
            for (let i = arr.length - 1; i >= 0; i--) {
                dateStr += arr[i];
                if (i !== 0) {
                    dateStr += "-";
                }
            }
            return dateStr;
        } 
        return datetime;
    },
    getFormattedDate(date) {
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return day + '/' + month;
    },
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    },
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    removeCookie(cname) {
        this.setCookie(cname, "", -1);
    },
    setSession(name, value) {
        window.sessionStorage[name] = JSON.stringify(value);
    },
    getSession(name) {
        if (window.sessionStorage[name]) {
            return JSON.parse(window.sessionStorage[name]);
        } else 
            return null;
    },
    removeItemSession(name) {
        window.sessionStorage.removeItem(name);
    },
    calculationPrice(productList, voucher) {
        let totalPrice = 0;
        productList.forEach((item) => {
            totalPrice += (item.Price ? item.Price : 0) * item.Amount;
        });
        return {
            totalPrice: totalPrice,
            savingPrice: Math.floor((totalPrice * voucher) / 100),
            lastPrice: Math.floor(totalPrice * (1 - voucher / 100)),
        };
    },
    detachAddress(address) {
        const item = address.split(", ");
        return {
            province: item[3],
            district: item[2],
            ward: item[1],
            addressDetail: item[0],
        }
    },
    attachAddress(province, district, ward, addressDetail) {
        return `${addressDetail}, ${ward}, ${district}, ${province}`;
    }
}

export default utils