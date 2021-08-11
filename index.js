const isNotEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.findIndex((value) => !!value) !== -1;
  }
  if (typeof value === "object") {
    return !!Object.keys(value).length;
  }
  return !!value;
};

const removeEmptyField = (object) =>
  Object.entries(object).reduce((accum, [key, value]) => {
    if (isNotEmpty(value)) {
      accum[key] = value;
    }
    return accum;
  }, {});

const createQuery = (data) => {
  if (window.URLSearchParams) {
    return new URLSearchParams(data).toString();
  } else
    Object.entries(data)
      .map((pair) => pair.map(encodeURIComponent).join("="))
      .join("&");
};

const parseQueryParams = (url) => {
  const params = url.split("?")[1];

  if (params) {
    return params.split("&").reduce((acc, str) => {
      const [key, valueFromURI] = str.split("=");
      const value = decodeURIComponent(valueFromURI);

      acc[key] = value.indexOf(",") !== -1 ? value.split(",") : value;

      return acc;
    }, {});
  }
  return {};
};

const getFormValue = (event) => {
  event.preventDefault();

  const firstName = document.querySelector('[name="FName"]').value;
  const lastName = document.querySelector('[name="LName"]').value;
  const email = document.querySelector('[name="Email"]').value;
  const phone = document.querySelector('[name="Phone"]').value;
  const sex = document.querySelector('[name="Sex"]:checked')?.value;

  const skills = Array.from(
    document.querySelectorAll('[name="Skills"]:checked'),
    (el) => el?.value
  );
  const department = Array.from(
    document.querySelector('[name="Department"]').selectedOptions,
    (option) => option?.value
  );

  const data = {
    FName: firstName,
    LName: lastName,
    Email: email,
    Phone: phone,
    Sex: sex,
    Skills: skills,
    Department: department,
  };

  const queryData = removeEmptyField(data);
  console.log(data, queryData);

  const pageUrl = window.location.href.split("?")[0];
  const url = `${pageUrl}?${createQuery(queryData)}`;

  const link = document.createElement("a");
  link.target = "_blank";
  link.innerText = url;
  form.append(link);
};

const fillFormFromValues = (values) => {
  const formElements = document.getElementById("form");

  Object.entries(values).forEach(([key, value]) => {
    if (key === "Skills") {
      formElements[key].forEach((radioButton) => {
        if (
          (Array.isArray(value) && value.includes(radioButton.value)) ||
          radioButton.value === value
        ) {
          radioButton.checked = true;
        }
      });
    } else if (key === "Department") {
      Array.from(formElements[key].options).forEach((option) => {
        if (
          (Array.isArray(value) && value.includes(option.value)) ||
          option.value === value
        ) {
          option.selected = true;
        }
      });
    } else {
      formElements[key].value = value;
    }
  });
};

const fillFormFromUrl = () => {
  const queryParams = parseQueryParams(window.location.href);
  console.log(queryParams);
  fillFormFromValues(queryParams);
};

const form = document.getElementById("form");
form.addEventListener("submit", getFormValue);

window.addEventListener("load", fillFormFromUrl);
