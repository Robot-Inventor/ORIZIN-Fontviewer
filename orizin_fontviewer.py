import eel
import tkinter as tk
import tkinter.font as t_font
import re


@eel.expose
def get_font_list() -> list[str]:
    root = tk.Tk()
    root.withdraw()
    return sorted([font_name for font_name in list(t_font.families()) if not re.search("^@.*", font_name)])


eel.init("resource/")
eel.start("/html/index.html")
