// ============================
// WasteWise - app.js (simplified/utility-first)
// ============================

// Store for any future small tracking (optional)
const store = {
	key: "wastewise_user",
	get() {
		try {
			return JSON.parse(localStorage.getItem(this.key) || "{}");
		} catch {
			return {};
		}
	},
	set(v) {
		localStorage.setItem(this.key, JSON.stringify(v));
	},
};

// Page name
const page = location.pathname.split("/").pop() || "index.html";

// Load items
function loadItems() {
	return fetch("items.json").then((r) => {
		if (!r.ok) throw new Error("Failed to load items.json");
		return r.json();
	});
}

// Simple HTML escape
function escapeHtml(str) {
	return String(str || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// Toast popup
function showToast(msg) {
	const t = document.getElementById("toast");
	if (!t) return;
	t.textContent = msg;
	t.classList.add("show");
	setTimeout(() => t.classList.remove("show"), 1600);
}

// --------------------
// INDEX PAGE LOGIC
// --------------------
if (page === "index.html") {
	const searchInput = document.getElementById("search");
	const resultsDiv = document.getElementById("results");
	let ITEMS = [];

	loadItems()
		.then((data) => {
			ITEMS = data;
			setupSectionTabs();
			renderConfusing();
			renderList("");
		})
		.catch((err) => {
			console.error(err);
			resultsDiv.innerHTML =
				'<div class="card">Could not load items list.</div>';
		});

	// Render items
	function renderList(query, categoryKey = "all") {
		const qq = (query || "").toLowerCase();
		let filtered = ITEMS.filter((it) => {
			const inCategory =
				categoryKey === "all" || it.category === categoryKey;
			const match =
				!qq ||
				it.name.toLowerCase().includes(qq) ||
				(it.aliases || []).some((a) =>
					(a || "").toLowerCase().includes(qq)
				);
			return inCategory && match;
		});

		// Show default set if nothing searched & in all category
		if (!qq && categoryKey === "all") {
			const defaults = [
				"Paper cup",
				"Pizza box (oily)",
				"Milk pouch (clean)",
				"Tetra pack (clean)",
				"Plastic bottle (PET)",
				"Cardboard box (clean)",
				"Aluminium foil (clean)",
				"Multilayered wrappers",
				"Broken glass shards",
				"Battery (AA/AAA)",
				"Sanitary pad",
				"Vegetable peels",
			];
			const defaultItems = ITEMS.filter((x) => defaults.includes(x.name));
			if (defaultItems.length) filtered = defaultItems;
		}

		resultsDiv.innerHTML = filtered
			.map(
				(it) => `
      <a class="card" href="item.html?id=${encodeURIComponent(it.id)}">
        <div class="badge ${escapeHtml(it.category)}">${escapeHtml(
					it.category
				)}</div>
        <div class="title">${escapeHtml(it.name)}</div>
      </a>
    `
			)
			.join("");

		const countEl = document.getElementById("count");
		if (countEl)
			countEl.textContent = `${filtered.length} item${
				filtered.length !== 1 ? "s" : ""
			}`;
	}

	// Populate category tabs
	function setupSectionTabs() {
		const wrap = document.getElementById("section-tabs");
		if (!wrap) return;
		const cats = [
			{ key: "all", label: "All" },
			{ key: "wet", label: "Wet" },
			{ key: "dry-recyclable", label: "Dry ♻️" },
			{ key: "dry-nonrecyclable", label: "Dry (non)" },
			{ key: "e-waste", label: "E‑waste" },
			{ key: "biomedical", label: "Biomedical" },
		];
		const counts = Object.fromEntries(cats.map((c) => [c.key, 0]));
		ITEMS.forEach((it) => {
			counts.all++;
			if (counts[it.category] != null) counts[it.category]++;
		});
		wrap.innerHTML = cats
			.map(
				(c) => `
      <button class="stab" data-key="${c.key}">${c.label} (${
					counts[c.key]
				})</button>
    `
			)
			.join("");
		const buttons = [...wrap.querySelectorAll(".stab")];
		let activeCat = "all";
		const apply = (cat) => {
			activeCat = cat;
			buttons.forEach((b) =>
				b.classList.toggle("active", b.dataset.key === cat)
			);
			renderList(searchInput?.value || "", cat);
		};
		buttons.forEach((b) => (b.onclick = () => apply(b.dataset.key)));
		apply("all");
		if (searchInput) {
			searchInput.addEventListener("input", () => apply(activeCat));
		}
	}

	// Commonly confusing chips
	function renderConfusing() {
		const wrap = document.getElementById("confusing-chips");
		if (!wrap) return;
		const names = [
			"Paper cup",
			"Pizza box (oily)",
			"Milk pouch (clean)",
			"Tetra pack (clean)",
			"Multilayered wrappers",
			"Aluminium foil (clean)",
			"Aluminium foil (oily)",
			"Broken glass shards",
			"Toothpaste tube",
			"Thermocol",
		];
		const list = ITEMS.filter((x) => names.includes(x.name));
		wrap.innerHTML = list
			.map(
				(it) =>
					`<button class="chip" data-id="${it.id}">${escapeHtml(
						it.name
					)}</button>`
			)
			.join("");
		wrap.querySelectorAll(".chip").forEach((btn) => {
			btn.onclick = () =>
				(location.href = `item.html?id=${encodeURIComponent(
					btn.dataset.id
				)}`);
		});
	}
}

// --------------------
// ITEM PAGE LOGIC
// --------------------

if (page === "item.html") {
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id") || 0);

  const nameEl = document.getElementById("item-name");
  const catEl = document.getElementById("item-category");
  const rulesEl = document.getElementById("rules");
  const mistakesEl = document.getElementById("mistakes");
  const verdictEl = document.getElementById("verdict");
  const whereEl = document.getElementById("bin-where");
  const doBox = document.getElementById("do-avoid");
  const doText = document.getElementById("do-text");
  const avoidText = document.getElementById("avoid-text");

  loadItems()
    .then((items) => {
      const it = items.find((x) => Number(x.id) === id);

      // If item not found → friendly message
      if (!it) {
        if (nameEl) nameEl.textContent = "Item not found";
        const mainEl = document.querySelector("main");
        if (mainEl) {
          mainEl.innerHTML = `
      <div class="card" style="padding:20px; text-align:center;">
        <p>Sorry, we couldn’t find that item.</p>
        <a href="index.html" class="tab" style="display:inline-block; margin-top:10px;">← Back to Search</a>
      </div>
    `;
        }
        return;
      }

      // ✅ Dynamic page title
      document.title = `WasteWise — ${it.name}`;

      // Fill name, badge, lists
      if (nameEl) nameEl.textContent = it.name;
      if (catEl) {
        catEl.textContent = it.category;
        catEl.classList.add(it.category);
      }
      if (rulesEl)
        rulesEl.innerHTML = (it.rules || [])
          .map((r) => `<li>${escapeHtml(r)}</li>`)
          .join("");
      if (mistakesEl)
        mistakesEl.innerHTML = (it.mistakes || [])
          .map((m) => `<li>${escapeHtml(m)}</li>`)
          .join("");

      // Verdict & destination
      const c = it.category;
      let verdict = "",
        where = "";
      if (c === "dry-recyclable") {
        const nm = it.name.toLowerCase();
        if (nm.includes("foil")) {
          verdict = nm.includes("clean")
            ? "Recyclable if clean (no food/oil)."
            : "Not recyclable if oily/soiled.";
        } else if (nm.includes("milk pouch") || nm.includes("tetra")) {
          verdict = "Recyclable only if rinsed, drained, and dry.";
        } else {
          verdict = "Recyclable if clean and dry.";
        }
        where = "Dry bin (recyclables). Keep away from moisture.";
      } else if (c === "dry-nonrecyclable") {
        verdict = "Not recyclable through household collection.";
        where =
          "Dry bin (non-recyclables). Keep separate from clean recyclables.";
      } else if (c === "wet") {
        verdict = "Organic/wet waste.";
        where = "Wet bin (compost preferred).";
      } else if (c === "e-waste") {
        verdict = "Do not bin: e-waste only.";
        where =
          "Store separately, give to authorized e-waste recycler.";
      } else if (c === "biomedical") {
        verdict = "Biomedical waste — handle carefully.";
        where =
          'Double-wrap, label "BIOMEDICAL", and hand over to: (1) municipal collection or designated sanitary-waste pickup, (2) nearest hospital/clinic if they accept community sanitary waste, or (3) your authorized waste collection service. Never mix with dry/wet bins.';
      }

      if (verdictEl) verdictEl.textContent = verdict;
      if (whereEl) whereEl.textContent = where;

      // Do / Avoid
      if (doBox && doText && avoidText) {
        let doMsg = "",
          avoidMsg = "";
        switch (c) {
          case "dry-recyclable":
            doMsg = "Keep items clean & dry";
            avoidMsg = "No food or liquid residue";
            break;
          case "dry-nonrecyclable":
            doMsg = "Keep separate from recyclables";
            avoidMsg = "Do not mix with clean items";
            break;
          case "wet":
            doMsg = "Compost if possible, tie securely";
            avoidMsg = "Do not mix with dry bin";
            break;
          case "e-waste":
            doMsg = "Store separately for e-waste recycler";
            avoidMsg = "Do not put in bins";
            break;
          case "biomedical":
            doMsg =
              "Double-wrap, label “BIOMEDICAL”, and hand over to municipal/authorized service or a clinic that accepts it.";
            avoidMsg =
              "Do not flush, burn, or mix with household dry/wet bins.";
            break;
        }
        if (doMsg) {
          doText.textContent = doMsg;
          avoidText.textContent = avoidMsg;
          doBox.style.display = "block";
        }
      }
    })
    .catch((err) => {
      console.error(err);
      if (nameEl) nameEl.textContent = "Could not load items.json";
    });
}
