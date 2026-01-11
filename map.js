let map;
let markers = [];
let markerCluster;

/* 🎨 ONLY 3 COLORS: RED, BLUE, GREEN */
const blockColors = {};
const primaryColors = [
  "#d32f2f",
  "#1976d2",
  "#FFE878"
];
let colorIndex = 0;

function getBlockColor(block) {
  if (!blockColors[block]) {
    blockColors[block] = primaryColors[colorIndex % primaryColors.length];
    colorIndex++;
  }
  return blockColors[block];
}

function getCategoryLetter(cat) {
  if (cat === "PPC") return "P";
  if (cat === "Rice Mill") return "M";
  if (cat === "FPS") return "F";
  if (cat === "Godown") return "G";
  return "?";
}

function linePin(color) {
  return {
    path: "M12 2C7.6 2 4 5.6 4 10c0 4.5 4.1 8.2 6.8 11V30h2.4V21c2.7-2.8 6.8-6.5 6.8-11 0-4.4-3.6-8-8-8z",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 1.2,
    scale: 1.15,
    labelOrigin: new google.maps.Point(12, 10)
  };
}

window.addEventListener("load", function () {

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 20.97, lng: 83.53 },
    gestureHandling: "greedy",
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false
  });

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/1HI5Wjjwo5OObDaS4W7QaOVc_RcqgREu8pHEQxSjYhUg/gviz/tq?tqx=out:json";

  fetch(sheetURL)
    .then(r => r.text())
    .then(text => {

      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows;

      const infoWindow = new google.maps.InfoWindow();
      const blockSet = new Set();

      rows.forEach(r => {
        if (!r.c || !r.c[3]?.v || !r.c[4]?.v) return;

        const block = r.c[0].v;
        const name  = r.c[1].v;
        const code  = r.c[2].v;
        const lat   = r.c[3].v;
        const lng   = r.c[4].v;
        const cat   = r.c[5].v;

        blockSet.add(block);

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          icon: linePin(getBlockColor(block)),
          label: {
            text: getCategoryLetter(cat),
            color: "white",
            fontWeight: "bold",
            fontSize: "11px"
          }
        });

        marker.meta = {
          block: block.toUpperCase(),
          code: code.toUpperCase(),
          name: name.toUpperCase()
        };

        marker.addListener("click", () => {
          infoWindow.setContent(
            "<strong>Name:</strong> " + name + "<br>" +
            "<strong>Code:</strong> " + code + "<br>" +
            "<strong>Block:</strong> " + block + "<br>" +
            "<strong>Category:</strong> " + cat
          );
          infoWindow.open(map, marker);
        });

        markers.push(marker);
      });

      markerCluster = new MarkerClusterer({ map, markers });
      populateBlockList(blockSet);
    });
});

function populateBlockList(blockSet) {
  const list = document.getElementById("blockList");
  list.innerHTML = "";
  [...blockSet].sort().forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    list.appendChild(opt);
  });
}

function applyFilters() {
  const blockVal = blockSearch.value.trim().toUpperCase();
  const codeVal  = codeSearch.value.trim().toUpperCase();
  const nameVal  = nameSearch.value.trim().toUpperCase();

  markers.forEach(m => {
    const blockMatch = !blockVal || m.meta.block.includes(blockVal);
    const codeMatch  = !codeVal  || m.meta.code.includes(codeVal);
    const nameMatch  = !nameVal  || m.meta.name.includes(nameVal);
    m.setVisible(blockMatch && codeMatch && nameMatch);
  });

  markerCluster.repaint();
}

blockSearch.addEventListener("input", applyFilters);
codeSearch.addEventListener("keyup", applyFilters);
nameSearch.addEventListener("keyup", applyFilters);
