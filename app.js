const city = document.querySelector("#input");
const submit = document.querySelector(".btn");
const clear = document.querySelector(".clear");
const key = "cabfa038e40c8b5b146376cc86284a58";
let cityList = [];
const message = document.querySelector(".error");
const resultUl = document.querySelector(".result ul ");

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (!city.value.trim()) {
    message.innerHTML = "You should enter a city";
    setTimeout(() => {
      message.innerHTML = "";
    }, 3000);
    city.value = "";
  } else if (cityList.includes(city.value.toLowerCase())) {
    message.innerHTML = "You already entered this city";
    setTimeout(() => {
      message.innerHTML = "";
    }, 3000);
    city.value = "";
  } else {
    cityList.push(city.value.toLowerCase());
    fetch(
      `
      https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${key}&units=metric
      `
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("You should  enter a valid city");
        }

        return res.json();
      })

      .then((data) => updateDom(data))
      .catch((err) => {
        message.innerHTML = err;
        setTimeout(() => {
          message.innerHTML = "";
        }, 3000);
        city.value = "";
        city.focus();
      });
  }
});

function updateDom(data) {
  const {
    name,
    main: { feels_like },
    main: { temp },
    main: { humidity },
    sys: { country },
  } = data;
  console.log(data);
  const resultLi = document.createElement("li");
  resultLi.classList.add("city");
  if (cityList.length < 5) {
    resultLi.innerHTML = `

  <h3 class ='text-warning'>${name} - ${country}</h3><hr/>
  <p><span class ='temp'>${Math.round(temp)}</span>°C</p><hr/>
  <p>${data.weather[0].main}</p><hr/>
  <p>Felt : ${Math.round(feels_like)}°C</p>
  <p>HMD : %${Math.round(humidity)}</p>
  

  `;
    city.value = "";
    city.focus();

    resultUl.prepend(resultLi);
  } else {
    let last = resultUl.children[3];
    resultUl.removeChild(last);
    cityList = cityList.slice(1);
    console.log(cityList);
    resultLi.innerHTML = `
    <h3 class ='text-warning'>${name} - ${country}</h3><hr/>
    <p><span class ='temp'>${Math.round(temp)}</span>°C</p><hr/>
    <p>${data.weather[0].main}</p><hr/>
    <p>Felt : ${Math.round(feels_like)}°C</p><hr/>
    <p>HMD : %${Math.round(humidity)}</p>
    
  
    `;
    city.value = "";
    resultUl.prepend(resultLi);
    city.focus();
  }
}

city.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    submit.click();
  }
});

clear.addEventListener("click", () => {
  let removeLi = document.querySelectorAll(".result ul li ");
  // resultUl.removeChild(removeLi);
  // removeLi.parentElement.remove();
  resultUl.innerHTML = "";
  cityList = [];
});

window.addEventListener("load", () => {
  city.focus();
});
