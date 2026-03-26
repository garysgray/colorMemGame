// Color dictionary mapping color names to their hex codes (without the #)
const colrDict = 
{
  "Blue":   "00CFCF",
  "Yellow": "E8D84A",
  "Green":  "2E7D4F",
  "Orange": "E07020",
  "Purple": "9B59B6",
  "Red":    "C0384A",
};

// Grab both drop zones from the DOM into an array.
// They're treated as equals — no "home" zone concept.
const zones = 
[
  document.getElementById("zone-a"),
  document.getElementById("zone-b"),
];

// --- Drag state variables ---
let active = null;     // The real chip element being dragged
let clone  = null;     // A floating visual copy that follows the mouse
let offsetX = 0, offsetY = 0;  // How far from the chip's top-left corner the user clicked
let originZone = null; // Which zone the chip came from (so we can return it if dropped outside)

// Attach drag behaviour to every chip on the page, then draw the initial UI
document.querySelectorAll(".color-chip").forEach(attachDrag);
updateUI();

// Adds the pointerdown listener to a chip element
function attachDrag(el) 
{
  el.addEventListener("pointerdown", onPointerDown);
}

// Fires when the user clicks/touches a chip
function onPointerDown(e) 
{
  e.preventDefault();                          // Stop text selection, scrolling, etc.
  active = e.currentTarget;                   // Remember which chip is being dragged
  originZone = active.parentElement;          // Remember which zone it currently lives in

  const rect = active.getBoundingClientRect(); // Get the chip's position on screen
  offsetX = e.clientX - rect.left;            // Distance from left edge of chip to cursor
  offsetY = e.clientY - rect.top;             // Distance from top edge of chip to cursor

  // Create a visual clone that will float under the cursor while dragging
  clone = active.cloneNode(true);
  clone.classList.add("drag-clone");          // CSS makes this position:fixed and semi-transparent
  clone.style.width = rect.width + "px";      // Match the original chip's width
  clone.style.left  = rect.left  + "px";      // Start exactly on top of the original
  clone.style.top   = rect.top   + "px";
  document.body.appendChild(clone);           // Add clone directly to <body> so it floats freely

  active.classList.add("dragging");           // CSS can dim/hide the original while dragging
  active.setPointerCapture(e.pointerId);      // Keep receiving pointer events even if cursor leaves the chip
}

// Fires continuously as the mouse/finger moves
document.addEventListener("pointermove", function(e) 
{
  if (!clone) return;                          // Nothing being dragged — bail out

  // Move the clone to follow the cursor, adjusted by the initial click offset
  clone.style.left = (e.clientX - offsetX) + "px";
  clone.style.top  = (e.clientY - offsetY) + "px";

  // Highlight whichever zone the cursor is currently hovering over
  zones.forEach(z => z.classList.toggle("drag-over", zoneContains(z, e.clientX, e.clientY)));
});

// Fires when the user releases the mouse/finger
document.addEventListener("pointerup", function(e) 
{
  if (!active) return;                         // Nothing was being dragged — bail out

  // Find which zone (if any) the cursor is inside right now
  const target = zones.find(z => zoneContains(z, e.clientX, e.clientY));

  if (target) 
  {
    target.appendChild(active);              // Dropped in a zone → move chip there
  } 
  else 
  {
    originZone.appendChild(active);          // Dropped outside → return chip to where it came from
  }

  // Clean up drag state
  active.classList.remove("dragging");
  clone.remove();                             // Delete the floating clone
  zones.forEach(z => z.classList.remove("drag-over")); // Remove all hover highlights
  active     = null;
  clone      = null;
  originZone = null;

  updateUI();                                 // Refresh the badge counts and color lists

});

// Returns true if the point (x, y) falls inside the zone element's bounding box
function zoneContains(zone, x, y) 
{
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

// Refreshes the badge (chip count) and the text log for both zones
function updateUI() 
{
  [["a", zones[0]], ["b", zones[1]]].forEach(([id, zone]) => 
  {
      const chips = zone.querySelectorAll(".color-chip"); // All chips currently in this zone
      const badge = document.getElementById("badge-" + id); // e.g. badge-a or badge-b
      const log   = document.getElementById("log-"   + id); // e.g. log-a or log-b

      // Update the badge text, e.g. "3 colors" or "1 color"
      badge.textContent = chips.length + " color" + (chips.length !== 1 ? "s" : "");
      badge.classList.toggle("has-items", chips.length > 0); // CSS can style a non-empty badge differently

      // Build a comma-separated list like "Blue #00CFCF, Red #C0384A"
      log.textContent = Array.from(chips).map(c => c.id + " #" + colrDict[c.id]).join(", ");
  });
}
