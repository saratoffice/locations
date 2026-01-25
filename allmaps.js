(function () {

  /* Inject HTML into Divi */
  document.getElementById("location-dashboard-root").innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        Location Map Dashboard
      </div>

      <div id="map"></div>

      <div class="controls">
        <div>
          <label>Block</label>
          <input type="text" id="blockSearch" placeholder="Type block name">
        </div>
        <div>
          <label>Workplace Code</label>
          <input type="text" id="codeSearch" placeholder="Code">
        </div>
        <div>
          <label>Workplace Name</label>
          <input type="text" id="nameSearch" placeholder="Name">
        </div>
        <div>
          <label>&nbsp;</label>
          <button id="applyFilter">Search</button>
        </div>
      </div>

      <div class="footer">
        <div>Total<span id="totalCount">0</span></div>
        <div>Visible<span id="visibleCount">0</span></div>
      </div>
    </div>
  `;

  let map;
  let markers = [];
  let allLocations = [];

  /* Google calls this */
  window.initMap = function () {

    map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: { lat: 20.592263, lng: 83.248939 },
      mapTypeControl: false,
      streetViewControl: false
    });

    loadData();
  };

  function loadData() {
    const sheetURL =
      "https://docs.google.com/spreadsheets/d/1HI5Wjjwo5OObDaS4W7QaOVc_RcqgREu8pHEQxSjYhUg/gviz/tq?tqx=out:json";

    fetch(sheetURL)
      .then(res => res.text())
      .then(text => {
        const json = JSON.parse(text.substring(47).slice(0, -2));
        processData(json.table.rows);
        renderMarkers();
      });
  }

  function processData(rows) {
    rows.forEach(r => {
      if (!r.c || !r.c[3] || !r.c[4]) return;

      allLocations.push({
        block: r.c[0]?.v || "",
        name: r.c[1]?.v || "",
        code: r.c[2]?.v || "",
        lat: parseFloat(r.c[3].v),
        lng: parseFloat(r.c[4].v)
      });
    });

    document.getElementById("totalCount").textContent = allLocations.length;
  }

  function renderMarkers(filtered = allLocations) {
    markers.forEach(m => m.setMap(null));
    markers = [];

    filtered.forEach(loc => {
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        title: `${loc.name} (${loc.code})`
      });

      markers.push(marker);
    });

    document.getElementById("visibleCount").textContent = filtered.length;
  }

  document.getElementById("applyFilter").addEventListener("click", () => {
    const block = document.getElementById("blockSearch").value.toLowerCase();
    const code = document.getElementById("codeSearch").value.toLowerCase();
    const name = document.getElementById("nameSearch").value.toLowerCase();

    const filtered = allLocations.filter(l =>
      (!block || l.block.toLowerCase().includes(block)) &&
      (!code || l.code.toLowerCase().includes(code)) &&
      (!name || l.name.toLowerCase().includes(name))
    );

    renderMarkers(filtered);
  });

})();
