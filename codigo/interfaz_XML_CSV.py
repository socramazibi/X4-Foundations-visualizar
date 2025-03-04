import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox
import eventos_mejorado
import threading
import time
import os
import gzip

# Inicialización de la ventana principal
root = tk.Tk()
root.geometry("1024x720")
root.title("X4 Foundations Conversor XML a CSV")

# Variables globales
ruta_xml = tk.StringVar()

# Configuración del grid
root.grid_columnconfigure(1, weight=1)
root.grid_rowconfigure(2, weight=1)

# Crear el área de log primero
log_text = tk.Text(root, height=20, width=80)
scrollbar = tk.Scrollbar(root, command=log_text.yview)
log_text.config(yscrollcommand=scrollbar.set)

def log_message(message):
    log_text.insert(tk.END, message + "\n")
    log_text.see(tk.END)

def seleccionar_archivo():
    filepath = filedialog.askopenfilename(
        defaultextension=".xml", 
        filetypes=[("Archivos XML y GZ", "*.xml *.gz"), ("Archivos XML", "*.xml"), ("Archivos GZ", "*.gz")]
    )
    if filepath:
        ruta_xml.set(filepath)
        log_message(f"Archivo seleccionado: {filepath}")

def convertir():
    archivo_entrada = ruta_xml.get()
    if not archivo_entrada:
        messagebox.showerror("Error", "Selecciona un archivo.")
        return

    convertir_button.config(state=tk.DISABLED)

    def convertir_en_hilo():
        log_message("Procesando...")
        try:
            inicio = time.time()
            archivo_generado = None
            
            # Si el archivo está comprimido, descomprimirlo primero
            if archivo_entrada.endswith('.gz'):
                log_message("Descomprimiendo archivo...")
                archivo_temporal = archivo_entrada[:-3]  # Elimina .gz
                with gzip.open(archivo_entrada, 'rb') as f_in:
                    with open(archivo_temporal, 'wb') as f_out:
                        f_out.write(f_in.read())
                archivo_generado = eventos_mejorado.convertir_xml_a_csv(archivo_temporal, None, None, log_message)
                os.remove(archivo_temporal)  # Elimina el archivo temporal después de la conversión
            else:
                archivo_generado = eventos_mejorado.convertir_xml_a_csv(archivo_entrada, None, None, log_message)

            fin = time.time()
            tiempo_procesamiento = fin - inicio
            log_message(f"✅ Archivo '{archivo_generado}' generado con éxito en {tiempo_procesamiento:.4f} segundos.")
        except Exception as e:
            log_message(f"❌ Error al convertir: {e}")
        finally:
            convertir_button.config(state=tk.NORMAL)

    hilo = threading.Thread(target=convertir_en_hilo)
    hilo.start()

# Configuración del grid
root.grid_columnconfigure(1, weight=1)
root.grid_rowconfigure(2, weight=1)

# Widgets de la interfaz
# Área de log con scrollbar
log_text = tk.Text(root, height=20, width=80)
scrollbar = tk.Scrollbar(root, command=log_text.yview)
log_text.config(yscrollcommand=scrollbar.set)

# Etiquetas y campos de entrada
tk.Label(root, text="Archivo XML:").grid(row=0, column=0, sticky="w", padx=10, pady=10)
tk.Entry(root, textvariable=ruta_xml, width=50).grid(row=0, column=1, columnspan=2, sticky="ew", padx=10, pady=10)

# Botones
tk.Button(root, text="Seleccionar", command=seleccionar_archivo, width=15).grid(
    row=1, column=0, sticky="w", padx=10, pady=10
)
convertir_button = tk.Button(root, text="Convertir", command=convertir, width=15)
convertir_button.grid(row=1, column=1, sticky="e", padx=10, pady=10)

# Agregar botón salir
salir_button = tk.Button(root, text="Salir", command=root.destroy, width=15)
salir_button.grid(row=1, column=2, sticky="e", padx=10, pady=10)

# Posicionamiento del área de log y scrollbar
log_text.grid(row=2, column=0, columnspan=3, sticky="nsew", padx=10, pady=10)
scrollbar.grid(row=2, column=3, sticky="ns")

# Iniciar el loop principal
if __name__ == "__main__":
    root.mainloop()
