import xml.etree.ElementTree as ET
import csv
import argparse

def convertir_xml_a_csv(archivo_xml, archivo_csv, update_progress, log_message):
    """Convierte un archivo XML a un archivo CSV.

    Args:
        archivo_xml: Ruta al archivo XML.
        archivo_csv: Ruta al archivo CSV de salida.
    """
    try:
        tree = ET.parse(archivo_xml)
        root = tree.getroot()

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
                if time or title or text: # Ignorar entradas vacías
                    writer.writerow([time, category, title, text, x, y, z])
                progress_count += 1
                progress = int((progress_count / total_entries) * 100)
                if update_progress:
                    update_progress(progress)


        log_message(f"✅ Archivo '{archivo_csv}' generado con éxito.")

    except FileNotFoundError:
        log_message(f"❌ Error: Archivo XML '{archivo_xml}' no encontrado.")
    except ET.ParseError:
        log_message(f"❌ Error: Error al analizar el archivo XML '{archivo_xml}'.")
    except Exception as e:
        log_message(f"❌ Error inesperado: {e}")


if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description="Convertir XML a CSV")
    parser.add_argument("xml_file", help="Ruta al archivo XML")
    parser.add_argument("csv_file", help="Ruta al archivo CSV de salida")
    args = parser.parse_args()
    convertir_xml_a_csv(args.xml_file, args.csv_file)
