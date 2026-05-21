const UIService = (() => {
  let toastTimeout = null;

  function getElement(id) {
    return document.getElementById(id);
  }

  function getValue(id) {
    const element = getElement(id);
    return element ? element.value.trim() : "";
  }

  function getRawValue(id) {
    const element = getElement(id);
    return element ? element.value : "";
  }

  function setValue(id, value) {
    const element = getElement(id);

    if (element) {
      element.value = value || "";
    }
  }

  function setText(id, text) {
    const element = getElement(id);

    if (element) {
      element.textContent = text;
    }
  }

  function setHtml(id, html) {
    const element = getElement(id);

    if (element) {
      element.innerHTML = html;
    }
  }

  function showElement(id) {
    const element = getElement(id);

    if (element) {
      element.classList.remove("hidden");
    }
  }

  function hideElement(id) {
    const element = getElement(id);

    if (element) {
      element.classList.add("hidden");
    }
  }

  function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
      page.classList.add("hidden");
      page.classList.remove("active-page");
    });

    const activePage = getElement(pageId);

    if (activePage) {
      activePage.classList.remove("hidden");
      activePage.classList.add("active-page");
    }

    updateNavigation(pageId);
    closeMenu();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function updateNavigation(pageId) {
    document.querySelectorAll(".menu-link[data-page]").forEach(button => {
      button.classList.toggle("active", button.dataset.page === pageId);
    });

    document.querySelectorAll(".mobile-nav-button[data-page]").forEach(button => {
      button.classList.toggle("active", button.dataset.page === pageId);
    });
  }

  function openMenu() {
    getElement("sideMenu")?.classList.add("open");
    getElement("menuOverlay")?.classList.remove("hidden");
  }

  function closeMenu() {
    getElement("sideMenu")?.classList.remove("open");
    getElement("menuOverlay")?.classList.add("hidden");
  }

  function openModal(modalId) {
    const modal = getElement(modalId);

    if (!modal) {
      return;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalId) {
    const modal = getElement(modalId);

    if (!modal) {
      return;
    }

    modal.classList.add("hidden");

    const visibleModal = document.querySelector(".modal:not(.hidden)");

    if (!visibleModal) {
      document.body.style.overflow = "";
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.classList.add("hidden");
    });

    document.body.style.overflow = "";
  }

  function showToast(message) {
    const toast = getElement("toast");

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3200);
  }

  function resetForm(formId) {
    const form = getElement(formId);

    if (form) {
      form.reset();
    }
  }

  function populateSelect(selectId, options, selectedValue = "") {
    const select = getElement(selectId);

    if (!select) {
      return;
    }

    select.innerHTML = "";

    options.forEach(option => {
      const optionElement = document.createElement("option");

      optionElement.value = option.value;
      optionElement.textContent = option.label;

      if (option.value === selectedValue) {
        optionElement.selected = true;
      }

      select.appendChild(optionElement);
    });

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);
    StorageService.saveTheme(newTheme);

    const message = newTheme === "dark"
      ? translate("toastDark", "Dunkler Modus aktiviert.")
      : translate("toastLight", "Heller Modus aktiviert.");

    showToast(message);
  }

  function createActionLinks(customer) {
    const phone = customer.phone || "";
    const email = customer.email || "";
    const address = customer.address || "";
    const city = customer.city || "";
    const routeAddress = encodeURIComponent(`${address} ${city}`.trim());

    const phoneLabel = translate("actionCall", "Anrufen");
    const mailLabel = translate("actionEmail", "E-Mail");
    const routeLabel = translate("actionRoute", "Route");

    const phoneLink = phone
      ? `<a class="action-link call-button" href="tel:${escapeAttribute(phone)}">${phoneLabel}</a>`
      : "";

    const mailLink = email
      ? `<a class="action-link mail-button" href="mailto:${escapeAttribute(email)}">${mailLabel}</a>`
      : "";

    const routeLink = address || city
      ? `
        <a
          class="action-link route-button"
          href="https://www.google.com/maps/search/?api=1&query=${routeAddress}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${routeLabel}
        </a>
      `
      : "";

    return `${phoneLink}${mailLink}${routeLink}`;
  }

  function formatDate(dateString) {
    if (!dateString) {
      return translate("notSpecified", "Nicht angegeben");
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return translate("notSpecified", "Nicht angegeben");
    }

    return date.toLocaleDateString(getLocale());
  }

  function formatDateTime(dateString) {
    if (!dateString) {
      return translate("notSpecified", "Nicht angegeben");
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return translate("notSpecified", "Nicht angegeben");
    }

    return date.toLocaleString(getLocale());
  }

  function getLocale() {
    if (typeof I18nService === "undefined") {
      return "de-DE";
    }

    return I18nService.getLanguage() === "en" ? "en-GB" : "de-DE";
  }

  function translate(key, fallback) {
    if (typeof I18nService === "undefined") {
      return fallback;
    }

    return I18nService.t(key);
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  return {
    getElement,

    getValue,
    getRawValue,
    setValue,

    setText,
    setHtml,

    showElement,
    hideElement,
    showPage,

    openMenu,
    closeMenu,

    openModal,
    closeModal,
    closeAllModals,

    showToast,

    resetForm,
    populateSelect,

    applyTheme,
    toggleTheme,

    createActionLinks,

    formatDate,
    formatDateTime
  };
})();