import PDFDocument from 'pdfkit'
import Order from '../models/Order.js'

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product')

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order._id}.pdf`
    )

    doc.pipe(res)

    // HEADER
    doc.fontSize(28).text('Readymade Store', { align: 'center' })
    doc.moveDown()
    doc.fontSize(18).text('Order Invoice', { align: 'center' })
    doc.moveDown(2)

    // ORDER INFO
    doc.fontSize(12).text(`Invoice ID: ${order._id}`)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    // CUSTOMER
    doc.fontSize(16).text('Customer Details')
    doc.fontSize(12)
    doc.text(`Name: ${order.user?.name || 'N/A'}`)
    doc.text(`Email: ${order.user?.email || 'N/A'}`)
    doc.text(`Phone: ${order.shippingAddress?.phone || 'N/A'}`)
    doc.text(`Address: ${order.shippingAddress?.address || 'N/A'}`)
    doc.moveDown(2)

    // ITEMS
    doc.fontSize(16).text('Products')
    doc.moveDown()

    let total = 0

    order.items.forEach((item, index) => {

      const productName =
        item.product?.name || 'Deleted Product'

      const price =
        item.price || 0   // ✅ FIX: ALWAYS use stored order price

      const subtotal = price * item.quantity

      total += subtotal

      doc.fontSize(12).text(`${index + 1}. ${productName}`)
      doc.text(`Size: ${item.size || 'N/A'}`)
      doc.text(`Color: ${item.color || 'N/A'}`)
      doc.text(`Price: ₹${price}`)
      doc.text(`Quantity: ${item.quantity}`)
      doc.text(`Subtotal: ₹${subtotal}`)
      doc.moveDown()
    })

    // TOTAL (use calculated total OR stored totalAmount)
    doc.moveDown()

    doc.fontSize(20).text(
      `Grand Total: ₹${order.totalAmount || total}`,
      { align: 'right' }
    )

    doc.moveDown(2)

    doc.fontSize(12).text(
      'Thank you for shopping with us!',
      { align: 'center' }
    )

    doc.end()

  } catch (error) {
    console.log('Invoice Error:', error)

    res.status(500).json({
      message: 'Invoice generation failed',
    })
  }
}