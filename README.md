# RGB Color Picker for iRidium (KNX)

JavaScript library for **iRidium** that links a GUI **Color Picker** to **RGB / RGBW driver
channels** (KNX, Modbus, HDL, ...) in both directions: picking a color writes scaled R/G/B
values to the bus, and channel feedback paints the indicator item with the current color.

**Language:** JavaScript 1.5 — ECMAScript Edition 3 (ES3). No `let`/`const`, arrow
functions, template strings or other modern syntax — iRidium does not support them.

## Files

| File | Purpose |
|---|---|
| `RGB_Library.js` | The library. Add it to the project first; it does nothing on load. |
| `KNX_RGB.js` | Example entry point — edit the names to match your project. |

## Setup

1. In **iRidium Studio**, add both files to the project under **Scripts**.
2. Make sure `RGB_Library.js` is loaded **before** the file that calls it, otherwise you
   get `RGB_player is not defined` at startup.
3. Mark `KNX_RGB.js` as autostart, or attach it to the driver.
4. Your project needs a driver named `Server`, channels `Absolute_R` / `Absolute_G` /
   `Absolute_B`, feedbacks `R_status` / `G_status` / `B_status`, and a popup `ColorPicker`
   containing a `JstColorPicker` item and a `colorrgb` indicator item.
   All channel and item names are **case-sensitive**.
5. Use `toplimit = 100` for KNX DPT 5.001 (percent) or `255` for DPT 5.004.

## Usage

```js
// Color picker -> bus, plus indicator and +/- buttons
RGB_player(
   "Server",                                              // driver name
   "Absolute_R", "Absolute_G", "Absolute_B",              // channels
   100,                                                   // toplimit: 100 or 255
   IR.GetPopup("ColorPicker").GetItem("JstColorPicker"),  // picker
   IR.GetPopup("ColorPicker").GetItem("colorrgb"),        // indicator
   IR.GetPopup("ColorPicker").GetItem("rgb_up"),          // "+" button
   IR.GetPopup("ColorPicker").GetItem("rgb_down"),        // "-" button
   5                                                      // step
);

// Bus -> indicator only
RGB_add_color_listener(
   IR.GetDevice("Server"),
   "R_status", "G_status", "B_status",
   100,
   IR.GetPopup("ColorPicker").GetItem("colorrgb")
);
```

Everything after `toplimit` in `RGB_player()` is optional — omit the indicator and the
buttons and only the picker will be wired up.

## API

| Function | Description |
|---|---|
| `RGB_player(device, R, G, B, toplimit, picker, display, up, down, step)` | Registers the picker, indicator and step buttons in one call. |
| `RGB_add_color_listener(device, R_feed, G_feed, B_feed, toplimit, display)` | Updates `display.GetState(0).FillColor` on `IR.EVENT_TAG_CHANGE`. |
| `RGBW_add_color_listener(device, R_feed, G_feed, B_feed, W_feed, toplimit, display, w_display)` | Same as above, plus a separate white-level item (`w_display.Value`). |
| `RGB_divider(device, R_feed, G_feed, B_feed, toplimit, picker)` | Reads `picker.PickColor` and writes scaled R/G/B to the driver. |
| `RGB_change_step(device, step, R, G, B)` | Adds `step` to each channel's current feedback, clamped at 0. |

## Color format

Colors are packed into one 32-bit **RGBA** value:

```js
FillColor = R << 24 | G << 16 | B << 8 | 0xFF;

var R = (color >> 24) & 0xFF;
var G = (color >> 16) & 0xFF;
var B = (color >> 8)  & 0xFF;
```

Channel values are scaled by `toplimit / 255` in both directions.

> **Note:** iRidium/Android colors are often `0xAARRGGBB` (alpha in the high byte). If
> `PickColor` returns ARGB, the red channel will always read `255`. Log
> `picker.PickColor.toString(16)` once to confirm the byte order in your project.

## Known limitations

* `toplimit` is only validated as `<= 255` — pass exactly `100` or `255`.
* `RGB_change_step()` has no upper bound, so "+" can push a channel past `toplimit`.
* Scaled values are written without `Math.round()`.
* Channel bits are not masked with `& 0xFF` when packing the color, so a feedback above
  `toplimit` bleeds into the neighbouring channel.
* The indicator is not refreshed on startup — it updates after the first tag change.
* Only `IR.EVENT_ITEM_RELEASE` is handled on the picker (no live preview while dragging).
* `RGB_player()` uses `this.RGB_device = ...`, which relies on the global scope. It works
  for a plain call but breaks with `new` or in strict mode.
* `GetPopup()` / `GetItem()` results are not checked for `null`.

## License

MIT — see [LICENSE](LICENSE).

