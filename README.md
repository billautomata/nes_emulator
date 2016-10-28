# profiler
Accepts as inputs the button state for each frame, and plays through the level storing the memory state of each frame.  It also records a screenshot of each frame.  When the run is complete there is a DVR style playback where you can A/B compare the memory across frames with a visual indicator of what is happening in the level.

It also hooks into the load and write commands in the cpu recording the memory values written to and read each frame.

# discover used memory addresses
Each load and write operation in the memory is kept track of, display a histogram of memory operations.

# blocks
197, flashing axe
196, brown box
195, coin with dark bg
194, coin
193, [?] power-up
192, [?] coin
191 - 144, text
143, axe
142, blue box
141, blue coin bg, not gettable
140, blue coin bg, not gettable
139, [?] blue, not gettable
138, [?] blue, not gettable
137, repeating pattern
136, cloud
135, blue bg
135, blue bg
