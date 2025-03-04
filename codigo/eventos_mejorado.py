import xml.etree.ElementTree as ET
import csv
import argparse
import datetime
import os

def convertir_xml_a_csv(archivo_xml, csv_output_path=None, update_progress=None, log_message=print):
    """Convierte un archivo XML a un archivo CSV con nombre basado en la fecha actual, evitando sobrescribir archivos existentes."""
    try:
        tree = ET.parse(archivo_xml)
        root = tree.getroot()
        
        # Obtener la fecha actual en formato dd-mm-aaaa
        fecha_actual = datetime.datetime.now().strftime("%d-%m-%Y")
        archivo_csv_base = f"Mensajes_{fecha_actual}"
        archivo_csv = f"{archivo_csv_base}.csv"
        
        # Si se proporciona una ruta de salida, usarla
        if csv_output_path:
            archivo_csv = csv_output_path
        else:
            # Evitar sobrescribir archivos existentes
            contador = 1
            while os.path.exists(archivo_csv):
                archivo_csv = f"{archivo_csv_base}_{contador}.csv"
                contador += 1
        
        total_entries = len(root.findall(".//entry"))
        progress_count = 0
        with open(archivo_csv, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["Time", "Category", "Title", "Text", "X", "Y", "Z"])

            for entry in root.findall(".//entry"):
                time = entry.get("time", "").strip()
                category = entry.get("category", "").strip()
                title = entry.get("title", "").strip()
                text = entry.get("text", "").strip()
                x = entry.get("x", "").strip()
                y = entry.get("y", "").strip()
                z = entry.get("z", "").strip()
                if time or title or text:  # Ignorar entradas vacías
                    writer.writerow([time, category, title, text, x, y, z])
                progress_count += 1
                progress = int((progress_count / total_entries) * 100)
                if update_progress:
                    update_progress(progress)

        log_message(f"✅ Archivo '{archivo_csv}' generado con éxito.")
        return archivo_csv
    except FileNotFoundError:
        log_message(f"❌ Error: Archivo XML '{archivo_xml}' no encontrado.")
    except ET.ParseError:
        log_message(f"❌ Error: Error al analizar el archivo XML '{archivo_xml}'.")
    except Exception as e:
        log_message(f"❌ Error inesperado: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convertir XML a CSV")
    parser.add_argument("xml_file", help="Ruta al archivo XML")
    parser.add_argument("csv_output_path", nargs="?", help="Ruta opcional para el archivo CSV de salida")
    args = parser.parse_args()
    convertir_xml_a_csv(args.xml_file, args.csv_output_path, None, print)
