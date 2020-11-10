var base_url = "https://readerapi.codepolitan.com/";
   var urlClubs = 'https://api.football-data.org/v2/competitions/2021/standings';
   var urlScore = 'https://api.football-data.org/v2/competitions/SA/scorers';
   var urlInfoClubs = 'https://api.football-data.org/v2/teams/';
   var urlMatch = 'https://api.football-data.org/v2/teams/64/matches?status=SCHEDULED';
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(urlClubs,{
      method: 'GET',
      headers: { 
      'X-Auth-Token': '974141197a304fc7a220c094c7608828'
      } 
    })
    .then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var articlesHTML = "";
          var dataClubs = data.standings[0].table;
          dataClubs.forEach(function(article) {
            articlesHTML += `
                  <div class="card">
                  <a href="./article.html?id=${article.team.id}">
                    <div class="card-image waves-effect waves-block waves-dark">
                    <img src="${article.team.crestUrl}" width="100" height="100"/>
                    </div>
                  </a>
                  <div class="card-content">
                    <span class="card-title truncate">${article.team.name}</span>
                    <p>Positons : ${article.position}</p>
                    <p>Points : ${article.points}</p>
                  </div>
                </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML += articlesHTML;
        });
      }
    });
  }

  fetch(urlClubs , {
    method: 'GET',
    headers: { 
    'X-Auth-Token': '974141197a304fc7a220c094c7608828'
    } 
    })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var articlesHTML = "";
      var dataClubs = data.standings[0].table;
      console.log(dataClubs);
      dataClubs.forEach(function(article) {
        articlesHTML += `
              <div class="card">
                <a href="./article.html?id=${article.team.id}">
                  <div class="card-image waves-effect waves-block waves-dark">
                  <img src="${article.team.crestUrl}" width="100" height="100"/>
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.team.name}</span>
                  <p>Positons : ${article.position}</p>
                  <p>Points : ${article.points}</p>
                </div>
              </div>
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML += articlesHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(function(resolve, reject) {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  if ("caches" in window) {
    caches.match(urlInfoClubs + idParam,
      {
        method: 'GET',
        headers: { 
        'X-Auth-Token': '974141197a304fc7a220c094c7608828'
        } 
      }).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var articleHTML= '';
          articleHTML += `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" width="100" height="100"/>
              </div>
              <div class="card-content">
                <span class="card-title">${data.name}</span>
                ${address}
              </div>
            </div>
          `;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML += articleHTML;
          resolve(data);
        });
      }
    });
}

  fetch(urlInfoClubs + idParam,
    {
      method: 'GET',
      headers: { 
      'X-Auth-Token': '974141197a304fc7a220c094c7608828'
      } 
    })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      console.log(data);
      var articleHTML = '';
      // Menyusun komponen card artikel secara dinamis
      articleHTML += `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" width="100" height="100"/>
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              ${snarkdown(data.address)}
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML += articleHTML;
      resolve(data);
      });
    });
}

function getSavedArticles() {
  getAll().then(function(articles) {
    // console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    var articlesHTML = '';
    articles.forEach(function(article) {
      console.log(articles);
      articlesHTML += `
                  <div class="card">
                    <a href="./article.html?id=${article.id}&saved=true">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${article.name}</span>
                      <p>${article.website}</p>
                    </div>
                  </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML += articlesHTML;
  });
}

function getSavedArticleById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(article) {
    console.log(article);
    var articleHTML = '';
    articleHTML += `
    <div class="card">
      <div class="card-image waves-effect waves-block waves-light">
        <img src="${article.crestUrl}" />
      </div>
      <div class="card-content">
        <span class="card-title">${article.name}</span>
        ${article.website}
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML += articleHTML;
  });
}