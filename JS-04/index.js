const body = document.body;
const popup = document.createElement("div");
const loading = document.createElement("div");
function myloading() {
  loading.innerHTML = "Loading...";
  loading.classList.add("loading");
  popup.classList.add("popup");
  popup.appendChild(loading);
  body.appendChild(popup);
}

getData();
async function getData() {
    myloading();
  let url = "https://reanweb.com/api/teaching/get-menu.php";
  const rp = await fetch(url);
  const rs = await rp.json();
  let txt = "";
  rs.map((e, i) => {
    txt += `
            <li>
                <a href="">${e["name"]}</a>
            </li>
        `;
  });
  document.querySelector(".menu").children[0].innerHTML = txt;
  document.querySelector(".popup").remove();
}
