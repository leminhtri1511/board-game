function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.matches(selector)) return element;
      else element = element.parentElement;
    }
  }

  var selectorRules = {};

  // Hàm validate
  function validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    // Lấy ra các rule của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule và kiểm tra, nếu có lỗi thì break
    for (var i = 0; i < rules.length; i++) {
      var errorMessage;
      switch (inputElement.type) {
        case "checkbox":
        case "radio":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  //Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  var submitButton = formElement.querySelector("button");

  if (formElement) {
    // Khi submit form
    submitButton.onclick = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //Lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Trường hợp submit với js
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                if (input.matches(":checked")) {
                  values[input.name] = input.value;
                }
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          },
          {});
          options.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    // Lặp qua mỗi rule và xử lí (sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {
      //Lưu các rule vào selectorRules
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        //Xử lí trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //Xử lí mỗi khi người dùng nhập
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return value.length === 0 || regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

Validator.minLength = function (selector, length, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length === 0 || value.length >= length
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${length} kí tự`;
    },
  };
};

Validator.maxLength = function (selector, length, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length <= length
        ? undefined
        : message || `Vui lòng nhập tối đa ${length} kí tự`;
    },
  };
};

Validator.fixedLength = function (selector, length, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length == length
        ? undefined
        : message || `Vui lòng nhập ${length} kí tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmedValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmedValue()
        ? undefined
        : message || "Mật khẩu không trùng khớp";
    },
  };
};

Validator.isOnlyNumber = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\d+$/;
      return !value || regex.test(value)
        ? undefined
        : message || "Trường này chỉ được chứa số";
    },
  };
};
