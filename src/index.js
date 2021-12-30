import "@/less/index.less";

import amountFormat from "../src/js/amountFormat";
import validateEmail from "../src/js/validateEmail";

import IMask from 'imask';

import masterCard from "../src/assets/icons/master-card.png";
import qiwi from "../src/assets/icons/qiwi.svg";
import umoney from "../src/assets/icons/umoney.svg";

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
    };

    this.imgData = {
      path: "../src/assets/icons/",
      methods: {
        1: "qiwi.svg",
        2: "umoney.svg",
        3: "master-card.png",
        4: "master-card.png"
      }
    };

    this.title   = document.getElementById("pay-form__title");
    this.payBody = document.getElementsByClassName("pay-form__body")[0];

    this.defaultState = document.getElementsByClassName("pay-form__default")[0];
      this.methods = Array.from(document.getElementsByClassName("pay-form__method"));
      this.actions = document.getElementById("pay-form__actions");
      this.amountInput = document.getElementById("amount-input__input");
      this.currencyBtn = document.getElementById("currency-btn");
      this.selectedCurrency = document.getElementById("selected-currency");
      this.currencyDrop = document.getElementById("currency-drop");
      this.currencyElems = Array.from(document.getElementsByClassName("amount-input__currency-item"));
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
    this.amountInput.addEventListener("input", this.amountInputActive.bind(this));
    this.currencyBtn.addEventListener("click", this.toggleCurrencyDrop.bind(this));
    this.currencyElems.forEach((elem) => {
      elem.addEventListener("click", this.changeCurrency.bind(this));
    });
    this.nextBtn.addEventListener("click", this.nextState.bind(this));

    this.phoneBtn.addEventListener("click", this.togglePhoneMessage.bind(this));
    this.emailBtn.addEventListener("click", this.toggleEmailMessage.bind(this));

    this.phoneInput.addEventListener("input", this.phoneInputActive.bind(this));

    this.data.phoneMask = IMask(this.phoneInput, {
      mask: '+{7}0000000000'
    });

    this.emailInput.addEventListener("input", this.emailInputActive.bind(this));

    this.sendBtn.addEventListener("click", this.send.bind(this));
  }

  setPayState() {
    this.title.innerHTML = "Введите данные";

    this.defaultState.style.display = "none";
    this.payState.classList.add("pay-form__pay_active");

    this.payLogo.src = this.imgData.path + this.imgData.methods[ this.data.methodId ];

    this.totalAmount.innerHTML = this.data.amount;
    this.totalCurrency.innerHTML = this.data.currency;
  }

  toggleCurrencyDrop() {
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

    if (!this.actions.classList.contains(ACTIVE_CLASS)) {
      this.actions.classList.add(ACTIVE_CLASS);
    }
  }

  changeCurrency(e) {
    this.toggleCurrencyDrop();

    const newCurrency = e.target.innerHTML;
    const newCurrencies = this.currencies.filter((currency) => currency !== newCurrency);

    let i = 0;
    this.currencyElems.forEach((elem) => {
      elem.innerHTML = newCurrencies[i];
    
      i++;
    });

    this.selectedCurrency.innerText = newCurrency;

    this.data.currency = newCurrency;

    this.toggleCurrencyDrop();
  }

  amountInputActive(e) {
    if (this.amountInput.classList.contains("amount-input__input_error")) {
      this.amountInput.classList.remove("amount-input__input_error");
    }

    let inputValue = e.target.value;

    if (isNaN(Number(inputValue[inputValue.length - 1])) || inputValue.length >= 9) { // Если последний введенный символ это не цифра      
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

    this.data.phoneNumber = this.data.phoneMask.value;
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
    const CURRENCY_ACTIVE_CLASS = "base-input__message_active"; 
    
    if (this.phoneMessage.classList.contains(CURRENCY_ACTIVE_CLASS)) {
      this.phoneMessage.classList.remove(CURRENCY_ACTIVE_CLASS);
    } else {
      this.phoneMessage.classList.add(CURRENCY_ACTIVE_CLASS); 
    }
  }

  toggleEmailMessage(e) {
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