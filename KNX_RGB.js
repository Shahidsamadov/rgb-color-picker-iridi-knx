RGB_player(
   "Server",      // Driver in project
   "Absolute_R",                   // Name of Red Channel
   "Absolute_G",                   // Name of Green Channel 
   "Absolute_B",                   // Name of Blue Channel
   100,                           // Top limit for RGB channels (255 or 100)
   IR.GetPopup("ColorPicker").GetItem("JstColorPicker")  // Item "Color Picker"
);

RGB_add_color_listener(
   IR.GetDevice("Server"), // Driver in project
   "R_status",                  // Name of Red Channel
   "G_status",                  // Name of Green Channel 
   "B_status",                  // Name of Blue Channel
   100,                           // Top limit for RGBW channels (255 or 100)
   IR.GetPopup("ColorPicker").GetItem("colorrgb")  // Item "Color Display"
);