cc65 -Oi lesson1.c --add-source; ca65 lesson1.s; ld65 -o ../../compiled.nes -C nes.cfg reset.o lesson1.o nes.lib
