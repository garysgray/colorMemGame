  const colrDict = {
    "Blue":   "00CFCF",
    "Yellow": "E8D84A",
    "Green":  "2E7D4F",
    "Orange": "E07020",
    "Purple": "9B59B6",
    "Red":    "C0384A",
  };

  // Both zones are identical peers — stored in an array.
  // No concept of "home" or "origin"; chips snap into whichever zone you drop them.
  const zones = [
    document.getElementById("zone-a"),
    document.getElementById("zone-b"),
  ];

  let active = null;
  let clone  = null;
  let offsetX = 0, offsetY = 0;
  let originZone = null; // remember where the chip came from

  document.querySelectorAll(".color-chip").forEach(attachDrag);
  updateUI();

  function attachDrag(el) {
    el.addEventListener("pointerdown", onPointerDown);
  }

  function onPointerDown(e) {
    e.preventDefault();
    active = e.currentTarget;
    originZone = active.parentElement; // remember its current zone

    const rect = active.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    clone = active.cloneNode(true);
    clone.classList.add("drag-clone");
    clone.style.width = rect.width + "px";
    clone.style.left  = rect.left  + "px";
    clone.style.top   = rect.top   + "px";
    document.body.appendChild(clone);

    active.classList.add("dragging");
    active.setPointerCapture(e.pointerId);
  }

  document.addEventListener("pointermove", function(e) {
    if (!clone) return;
    clone.style.left = (e.clientX - offsetX) + "px";
    clone.style.top  = (e.clientY - offsetY) + "px";

    zones.forEach(z => z.classList.toggle("drag-over", zoneContains(z, e.clientX, e.clientY)));
  });

  document.addEventListener("pointerup", function(e) {
    if (!active) return;

    const target = zones.find(z => zoneContains(z, e.clientX, e.clientY));

    if (target) {
      // Dropped inside a zone (same or different) — snap in
      target.appendChild(active);
    } else {
      // Dropped outside both zones — return to where it came from
      originZone.appendChild(active);
    }

    active.classList.remove("dragging");
    clone.remove();
    zones.forEach(z => z.classList.remove("drag-over"));

    active     = null;
    clone      = null;
    originZone = null;

    updateUI();
  });

  function zoneContains(zone, x, y) {
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function updateUI() {
    [["a", zones[0]], ["b", zones[1]]].forEach(([id, zone]) => {
      const chips = zone.querySelectorAll(".color-chip");
      const badge = document.getElementById("badge-" + id);
      const log   = document.getElementById("log-"   + id);

      badge.textContent = chips.length + " color" + (chips.length !== 1 ? "s" : "");
      badge.classList.toggle("has-items", chips.length > 0);
      log.textContent = Array.from(chips)
        .map(c => c.id + " #" + colrDict[c.id])
        .join(", ");
    });
  }