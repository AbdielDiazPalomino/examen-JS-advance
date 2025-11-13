import jsPDF from "jspdf"

export function generateBoletPDF(data) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 55

  // Header con gradiente simulado
  doc.setFillColor(72, 52, 212) // Azul primario
  doc.rect(0, 0, pageWidth, 40, "F")

  // Logo y título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text("P", 15, 20)
  doc.setFontSize(18)
  doc.text("ProBill", 25, 22)

  doc.setFontSize(10)
  doc.text("Sistema de Facturación", 25, 28)

  // Información de la boleta
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text(`Boleta #${Date.now().toString().slice(-6)}`, 15, yPosition)
  doc.text(new Date().toLocaleDateString("es-PE"), 15, yPosition + 6)
  yPosition += 15

  // Información del cliente
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Datos del Cliente", 15, yPosition)
  yPosition += 7

  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.text(`Nombre: ${data.customerName}`, 15, yPosition)
  yPosition += 6
  doc.text(`DNI: ${data.dni}`, 15, yPosition)
  yPosition += 12

  // Tabla de productos
  doc.setFont(undefined, "bold")
  doc.setFontSize(11)
  doc.text("Descripción", 15, yPosition)
  doc.text("Cantidad", 100, yPosition)
  doc.text("Precio", 130, yPosition)
  doc.text("Subtotal", 160, yPosition)

  doc.setDrawColor(200, 200, 200)
  doc.line(15, yPosition + 2, pageWidth - 15, yPosition + 2)
  yPosition += 8

  doc.setFont(undefined, "normal")
  doc.setFontSize(10)

  // Items
  data.items.forEach((item) => {
    doc.text(item.name.substring(0, 30), 15, yPosition)
    doc.text(item.quantity.toString(), 102, yPosition, { align: "center" })
    doc.text(`S/. ${item.price.toFixed(2)}`, 130, yPosition, { align: "right" })
    doc.text(`S/. ${item.subtotal.toFixed(2)}`, 170, yPosition, { align: "right" })
    yPosition += 7

    // Salto de página si es necesario
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 15
    }
  })

  yPosition += 5

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(15, yPosition, pageWidth - 15, yPosition)
  yPosition += 8

  // Total
  doc.setFont(undefined, "bold")
  doc.setFontSize(12)
  doc.setTextColor(72, 52, 212)
  doc.text("Total a Pagar:", 110, yPosition)
  doc.text(`S/. ${data.total.toFixed(2)}`, 170, yPosition, { align: "right" })

  // Footer
  yPosition = pageHeight - 20
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text("Gracias por su compra", pageWidth / 2, yPosition, { align: "center" })
  doc.text(`Generado: ${new Date().toLocaleString("es-PE")}`, pageWidth / 2, yPosition + 5, { align: "center" })

  // Descargar
  doc.save(`boleta-${data.dni}-${Date.now()}.pdf`)
}