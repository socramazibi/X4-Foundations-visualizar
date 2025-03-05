import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
from tkinter import ttk
from datetime import timedelta

class CSVFilterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Filtro de Eventos CSV")
        self.root.geometry("1200x600")

        self.load_button = tk.Button(self.root, text="Cargar CSV", command=self.load_csv)
        self.load_button.pack(pady=10)

        self.filter_label = tk.Label(self.root, text="Filtrar por Título (Ej: Destruida, Destruido):")
        self.filter_label.pack(pady=5)

        self.filter_entry = tk.Entry(self.root)
        self.filter_entry.pack(pady=5)
        self.filter_entry.bind("<Return>", lambda event: self.apply_filter())

        self.filter_button = tk.Button(self.root, text="Aplicar Filtro", command=self.apply_filter, state="disabled")
        self.filter_button.pack(pady=10)

        self.table_frame = tk.Frame(self.root)
        self.table_frame.pack(pady=10, fill="both", expand=True)

        self.column_widths = {
            "Hora Fecha": 60,
            "Categoría": 80,
            "Título": 120,
            "Texto": 300,
            "X": 60,
            "Y": 60,
            "Z": 60
        }

        self.df = None
        self.tree = None

    def load_csv(self):
        file_path = filedialog.askopenfilename(filetypes=[["CSV Files", "*.csv"]])
        if file_path:
            try:
                self.df = pd.read_csv(file_path, dtype=str)
                self.df.fillna("", inplace=True)

                if "Time" in self.df.columns:
                    self.df["Hora Fecha"] = self.df["Time"].apply(self.convert_time)
                    self.df.drop(columns=["Time"], inplace=True)
                
                self.df.rename(columns={
                    "Category": "Categoría",
                    "Title": "Título",
                    "Text": "Texto"
                }, inplace=True)
                
                self.df["Título"] = self.df["Título"].apply(lambda text: self.format_text(text, 30))
                self.df["Texto"] = self.df["Texto"].apply(lambda text: self.format_text(text, 50))
                
                cols = ["Hora Fecha"] + [col for col in self.df.columns if col != "Hora Fecha"]
                self.df = self.df[cols]
                
                self.show_table(self.df)
                self.filter_button.config(state="normal")
            except Exception as e:
                messagebox.showerror("Error", f"No se pudo cargar el archivo CSV.\n{e}")

    def convert_time(self, time_str):
        try:
            time_seconds = float(time_str)
            delta = timedelta(seconds=time_seconds)
            total_days = delta.days
            hours, remainder = divmod(delta.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"Día {total_days}, {hours:02}:{minutes:02}:{seconds:02}"
        except (ValueError, TypeError):
            return "Formato Inválido"

    def apply_filter(self):
        if self.df is not None and "Título" in self.df.columns:
            filter_text = self.filter_entry.get().strip().lower()
            if filter_text:
                filtered_df = self.df[self.df["Título"].str.lower().str.contains(filter_text, na=False)]
                self.show_table(filtered_df)
            else:
                self.show_table(self.df)

    def format_text(self, text, max_length):
        words = text.split()
        lines = []
        current_line = ""

        for word in words:
            if len(current_line) + len(word) + 1 > max_length:
                lines.append(current_line)
                current_line = word
            else:
                current_line += " " + word

        lines.append(current_line)
        return "\n".join(lines)

    def show_table(self, data_frame):
        for widget in self.table_frame.winfo_children():
            widget.destroy()

        table_container = tk.Frame(self.table_frame)
        table_container.pack(fill="both", expand=True)

        v_scroll = tk.Scrollbar(table_container, orient="vertical")
        v_scroll.pack(side="right", fill="y")

        h_scroll = tk.Scrollbar(table_container, orient="horizontal")
        h_scroll.pack(side="bottom", fill="x")

        columns = list(data_frame.columns)

        self.tree = ttk.Treeview(table_container, columns=columns, show="headings", yscrollcommand=v_scroll.set, xscrollcommand=h_scroll.set)

        v_scroll.config(command=self.tree.yview)
        h_scroll.config(command=self.tree.xview)

        style = ttk.Style()
        style.configure("Treeview", rowheight=100)
        style.configure("Treeview.Heading", font=("Arial", 10, "bold"))

        for col in columns:
            self.tree.heading(col, text=col, anchor="w")
            self.tree.column(col, width=self.column_widths.get(col, 120), anchor="w")

        for _, row in data_frame.iterrows():
            row_values = list(row)
            self.tree.insert("", "end", values=row_values)

        self.tree.pack(fill="both", expand=True)

if __name__ == "__main__":
    root = tk.Tk()
    app = CSVFilterApp(root)
    root.mainloop()
