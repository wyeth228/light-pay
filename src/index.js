import "@/less/index.less";

import amountFormat from "../src/js/amountFormat";
import validateEmail from "../src/js/validateEmail";

import IMask from "imask";

class App {
  constructor() {
    this.currencies = ["₽", "$", "€", "₴"];

    this.data = {
      amount: 0,
      currency: "₽",
      methodId: false,
      phoneNumber: "",
      phoneMask: false,
      email: "",
      phoneChars: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+"],
      payStateActive: false,
    };

    this.imgData = {
      path: "./assets/icons/",
      methods: {
        1: "qiwi.svg",
        2: "umoney.svg",
        3: "master-card.png",
        4: "master-card.png",
      },
    };

    this.title = document.getElementById("pay-form__title");
    this.payBody = document.getElementsByClassName("pay-form__body")[0];

    this.defaultState = document.getElementsByClassName("pay-form__default")[0];
    this.methods = Array.from(
      document.getElementsByClassName("pay-form__method")
    );
    this.actions = document.getElementById("pay-form__actions");
    this.amountInput = document.getElementById("amount-input__input");
    this.currencyBtn = document.getElementById("currency-btn");
    this.selectedCurrency = document.getElementById("selected-currency");
    this.currencyDrop = document.getElementById("currency-drop");
    this.currencyElems = Array.from(
      document.getElementsByClassName("amount-input__currency-item")
    );
    this.nextBtn = document.getElementById("next-btn");

    this.payState = document.getElementsByClassName("pay-form__pay")[0];
    this.payLogo = document.getElementById("pay-form__pay-logo");
    this.totalAmount = document.getElementById("pay-form__total-amount");
    this.totalCurrency = document.getElementById("pay-form__total-currency");
    this.phoneInput = document.getElementById("pay-form__phone-input");
    this.phoneBtn = document.getElementById("phone-input__btn");
    this.phoneMessage = document.getElementById("phone-input__message");
    this.emailInput = document.getElementById("base-input__email-input");
    this.emailBtn = document.getElementById("email-input__btn");
    this.emailMessage = document.getElementById("email-input__message");
    this.sendBtn = document.getElementById("send-btn");

    this.initEvents();
  }

  initEvents() {
    this.methods.forEach((method) => {
      method.addEventListener("click", this.selectMethod.bind(this, method));
    });
    this.amountInput.addEventListener(
      "input",
      this.amountInputActive.bind(this)
    );
    this.currencyBtn.addEventListener(
      "click",
      this.toggleCurrencyDrop.bind(this)
    );
    this.currencyElems.forEach((elem) => {
      elem.addEventListener("click", this.changeCurrency.bind(this));
    });
    this.nextBtn.addEventListener("click", this.nextState.bind(this));

    this.phoneBtn.addEventListener("click", this.togglePhoneMessage.bind(this));
    this.emailBtn.addEventListener("click", this.toggleEmailMessage.bind(this));

    this.phoneInput.addEventListener("input", this.phoneInputActive.bind(this));

    this.emailInput.addEventListener("input", this.emailInputActive.bind(this));

    this.sendBtn.addEventListener("click", this.send.bind(this));
  }

  setPayState() {
    this.title.innerHTML = "Введите данные";

    this.defaultState.classList.remove("pay-form__default_active");

    setTimeout(() => {
      this.payBody.classList.add("pay-form__body_minheight2");

      this.defaultState.style.display = "none";

      this.payState.classList.add("pay-form__pay_active");

      this.payState.style.overflow = "visible";
      this.data.payStateActive = true;
    }, 200);

    this.payLogo.src =
      this.imgData.path + this.imgData.methods[this.data.methodId];

    this.totalAmount.innerHTML = this.data.amount;
    this.totalCurrency.innerHTML = this.data.currency;
  }

  toggleCurrencyDrop(e) {
    if (e) e.stopPropagation();

    const CURRENCY_ACTIVE_CLASS = "amount-input__currency-drop_active";

    if (this.currencyDrop.classList.contains(CURRENCY_ACTIVE_CLASS)) {
      this.currencyDrop.classList.remove(CURRENCY_ACTIVE_CLASS);
    } else {
      this.currencyDrop.classList.add(CURRENCY_ACTIVE_CLASS);
    }
  }

  selectMethod(method, e) {
    const methodId = Object.assign({}, e.target.dataset).id;

    this.methods.forEach((method) => {
      method.classList.remove("pay-form__method_active");
    });
    method.classList.add("pay-form__method_active");

    this.data.methodId = methodId;

    this.activateActions();
  }

  activateActions() {
    const ACTIVE_CLASS = "pay-form__actions_active";

    setTimeout(() => {
      this.payBody.classList.add("pay-form__body_minheight1");
    }, 1000);

    if (!this.actions.classList.contains(ACTIVE_CLASS)) {
      this.actions.classList.add(ACTIVE_CLASS);
    }
  }

  changeCurrency(e) {
    this.toggleCurrencyDrop();

    const newCurrency = e.target.innerHTML;
    const newCurrencies = this.currencies.filter(
      (currency) => currency !== newCurrency
    );

    let i = 0;
    this.currencyElems.forEach((elem) => {
      elem.innerHTML = newCurrencies[i];

      i++;
    });

    this.selectedCurrency.innerText = newCurrency;

    this.data.currency = newCurrency;
  }

  amountInputActive(e) {
    if (this.amountInput.classList.contains("amount-input__input_error")) {
      this.amountInput.classList.remove("amount-input__input_error");
    }

    let inputValue = e.target.value;

    if (
      isNaN(Number(inputValue[inputValue.length - 1])) ||
      inputValue.length >= 9
    ) {
      // Если последний введенный символ это не цифра
      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
    } else {
      e.target.value = amountFormat(inputValue);
    }

    this.data.amount = e.target.value;
  }

  phoneInputActive(e) {
    if (this.phoneInput.classList.contains("base-input__input_error")) {
      this.phoneInput.classList.remove("base-input__input_error");
    }

    const chars = this.data.phoneChars;
    const value = e.target.value;
    const mask = this.getMaskOfCode(value);

    if (value[0] !== "+") {
      if (!this.data.phoneMask) {
        e.target.value = "+" + e.target.value;
      }
    }

    if (!chars.some((char) => char == value[value.length - 1])) {
      if (!this.data.phoneMask) {
        e.target.value = e.target.value.slice(0, value.length - 1);
      }
    }

    if ((value.length === 1 || value === "") && this.data.phoneMask) {
      this.data.phoneMask.destroy();

      this.data.phoneMask = false;

      this.data.phoneNumber = "";
    }

    if (mask && !this.data.phoneMask)
      this.data.phoneMask = IMask(this.phoneInput, { mask });

    if (this.data.phoneMask) {
      this.data.phoneNumber = this.data.phoneMask.value;
    }
  }

  getMaskOfCode(code) {
    if (code[0] !== "+") code = "+" + code;

    switch (code) {
      case "+7":
        return "+{7} 000 000 00 00";
      case "+8":
        return "+{8} 000 000 00 00";
      case "+380":
        return "+{380} 00 0000000";
      case "+371":
        return "+{371} 0000 0000";
      case "+374":
        return "+{374} 000 000 00 00";
      case "+375":
        return "+{375} 00 000 00 00";
      case "+996":
        return "+{996} 000 000000";
      case "+373":
        return "+{373} 000 00 000";
      case "+992":
        return "+{992} 00 000 0000";
      case "+998":
        return "+{998} 00 000 0000";
      default:
        return "";
    }
  }

  emailInputActive(e) {
    if (this.emailInput.classList.contains("base-input__input_error")) {
      this.emailInput.classList.remove("base-input__input_error");
    }

    this.data.email = e.target.value;
  }

  nextState(e) {
    if (!this.data.methodId) {
      return;
    }

    if (this.data.amount === "" || this.data.amount === 0) {
      this.amountInput.classList.add("amount-input__input_error");

      return;
    }

    this.setPayState();
  }

  togglePhoneMessage(e) {
    if (!this.data.payStateActive) return;

    const CURRENCY_ACTIVE_CLASS = "base-input__message_active";

    if (this.phoneMessage.classList.contains(CURRENCY_ACTIVE_CLASS)) {
      this.phoneMessage.classList.remove(CURRENCY_ACTIVE_CLASS);
    } else {
      this.phoneMessage.classList.add(CURRENCY_ACTIVE_CLASS);
    }
  }

  toggleEmailMessage(e) {
    if (!this.data.payStateActive) return;

    const CURRENCY_ACTIVE_CLASS = "base-input__message_active";

    if (this.emailMessage.classList.contains(CURRENCY_ACTIVE_CLASS)) {
      this.emailMessage.classList.remove(CURRENCY_ACTIVE_CLASS);
    } else {
      this.emailMessage.classList.add(CURRENCY_ACTIVE_CLASS);
    }
  }

  send(e) {
    if (this.data.phoneNumber.length < 12) {
      this.phoneInput.classList.add("base-input__input_error");

      return;
    }

    if (!validateEmail(this.data.email)) {
      this.emailInput.classList.add("base-input__input_error");

      return;
    }
  }
}

const app = new App();
