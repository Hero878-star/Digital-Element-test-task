// Получение элементов
const modalTrigger = document.getElementById("modal-trigger");
const modalBackground = document.querySelector(".modal-background");
const modalClose = document.querySelector(".modal-close");
const submitButton = document.querySelector(".submit_button");
const successModal = document.querySelector(".success-modal");
const closeSuccess = document.querySelector(".close-success");
const body = document.body;

// Элементы формы
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// Функция для блокировки прокрутки
function disablePageScroll() {
  const scrollY = window.scrollY; 
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`; 
  body.style.width = "100%";
  body.classList.add("body-lock");
}

// Функция для разблокировки прокрутки
function enablePageScroll() {
  const scrollY = Math.abs(parseInt(body.style.top || "0")); 
  body.style.position = "";
  body.style.top = "";
  body.classList.remove("body-lock");
  window.scrollTo(0, scrollY); 
}

// Валидация Full name
function validateFullName() {
  const value = fullNameInput.value.trim();
  if (value.length < 2) {
    showError(fullNameInput, "Full Name must be at least 2 characters long");
    return false;
  }
  hideError(fullNameInput);
  return true;
}


// Валидация поля email
function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!value) {
    showError(emailInput, "Email is required");
    return false;
  }
  
  if (!emailRegex.test(value)) {
    showError(emailInput, "Please enter a valid email address");
    return false;
  }
  
  hideError(emailInput);
  return true;
}

// Валидация поля message
function validateMessage() {
  const value = messageInput.value.trim();
  if (value.length < 10) {
    showError(messageInput, "Message must be at least 10 characters long");
    return false;
  }
  hideError(messageInput);
  return true;
}

// Вспомогательные функции для ошибок
function showError(input, message) {
  input.classList.add("error");
  
  // Создаем или находим элемент для сообщения об ошибке
  let errorElement = input.parentNode.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    input.parentNode.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

function hideError(input) {
  input.classList.remove("error");
  const errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.classList.remove("show");
  }
}

// Валидация всей формы
function validateForm() {
  const isNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();
  
  return isNameValid && isEmailValid && isMessageValid;
}

// Функция отправки формы
function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  // Собираем данные формы
  const formData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };

  // отправка формы на какое-то api
  fetch("https://some-api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (response.ok) {
        // Успешная отправка
        modalBackground.style.display = "none";
        successModal.style.display = "block";
        clearForm();
        return 0;
      } else {
        alert("Error sending message");
        return new Error("Request Failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error sending message");
    });
}

// Функция очистки формы
function clearForm() {
  fullNameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
  
  // Убираем все ошибки
  hideError(fullNameInput);
  hideError(emailInput);
  hideError(messageInput);
}


// Открытие модального окна
modalTrigger.addEventListener("click", function() {
  modalBackground.style.display = "block";
  disablePageScroll();
});

// Закрытие по крестику
modalClose.addEventListener("click", function() {
  modalBackground.style.display = "none";
  enablePageScroll();
});

// Закрытие success modal
closeSuccess.addEventListener("click", function() {
  successModal.style.display = "none";
  enablePageScroll();
});

// Закрытие по клику на фон
modalBackground.addEventListener("click", function(event) {
  if (event.target === modalBackground) {
    modalBackground.style.display = "none";
    enablePageScroll();
  }
});

// Закрытие success modal по клику на фон
successModal.addEventListener("click", function(event) {
  if (event.target === successModal) {
    successModal.style.display = "none";
    enablePageScroll();
  }
});

// Валидация 
fullNameInput.addEventListener("blur", validateFullName);
emailInput.addEventListener("blur", validateEmail);
messageInput.addEventListener("blur", validateMessage);

// Обработчик отправки формы
submitButton.addEventListener("click", function(event) {
  event.preventDefault(); 
  submitForm();
});

// Валидация при вводе)
fullNameInput.addEventListener("input", function() {
  if (this.classList.contains("error")) {
    hideError(this);
  }
});

emailInput.addEventListener("input", function() {
  if (this.classList.contains("error")) {
    hideError(this);
  }
});

messageInput.addEventListener("input", function() {
  if (this.classList.contains("error")) {
    hideError(this);
  }
});

