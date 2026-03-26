![Game Splash](images/colorSorta_small.png)

# Color Sorta — Drag & Drop Interface

A drag-and-drop color sorting interface built with vanilla JavaScript.

---

## Background

This project started as a prototype at a previous job. Our products stored info that users could access through a CLI or a web GUI, and users could create different types of objects through the GUI. A new way to group those objects came up in discussion — I suggested a drag and drop approach would be a natural fit, so I was tasked with building something to show what was possible.

I started messing around in JSFiddle, then eventually transferred it to my own setup. Got the basics working and made it somewhat presentable. It was well received, but the feature never got the green light and the prototype was sadly forgotten. This version is a full rebuild based on everything learned making that original.

---

## What's Changed

The original was built with jQuery and jQuery UI for drag-and-drop, and required **jQuery UI Touch Punch** to make it work on mobile. Touch Punch was a clever shim by Dave Furfero that translated touch events into mouse events so jQuery UI's draggable could function on touchscreens — a real necessity back when mobile browser support was a mess and there was no standard way to handle touch-based drag interactions.

The rebuild drops jQuery entirely. Modern browsers now support the **Pointer Events API** natively — one unified event system that handles mouse, touch, and stylus without any plugins or polyfills. What Touch Punch had to fake, the platform now does out of the box.

---

## What It Does Now

- Two equal panels — **Palette A** and **Palette B** — each starting with 3 color chips
- Drag chips freely between panels in either direction
- Both panels behave identically — no home zone, no asymmetry
- Chips snap into whichever panel you drop them, or return to origin if dropped outside
- Live contents log updates as you sort
- Left palette order shuffles to keep things interesting
- Clean dark UI with GitHub link

---

## What's Next

A memory game — **Color Memory** — is in active design using this interface as its foundation. Full game docs (GDD, Level Design, UX Flow) have been written. The core mechanic: study a color sequence, then rebuild it from memory by dragging from the palette before the timer runs out.

---

## Links

- [Original JSFiddle](https://jsfiddle.net/garysgray/uyo0pr1c/)
- [Original Demo Site](http://garysgameapps.orgfree.com/Draggable/)
- [OG-GitHub](https://github.com/garysgray/Color-Builder-Interface)