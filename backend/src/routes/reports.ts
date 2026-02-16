import { Router } from 'express'
import PDFDocument from 'pdfkit'

const router = Router()

// List templates endpoint
router.get('/templates', (_req, res) => {
  const templates = [
    { id: 1, name: 'Health Score CSV Template', type: 'csv' },
    { id: 2, name: 'Health Report PDF Template', type: 'pdf' }
  ]
  res.json({ templates })
})

// Simple CSV template endpoint
router.get('/templates/health.csv', (_req, res) => {
  const csv = 'checkpoint,score,max\nintake,0,10\ndelivery,0,15\n'
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="health template.csv"')
  res.send(csv)
})

// Simple PDF generation endpoint for health report template
router.get('/health-report.pdf', (_req, res) => {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'attachment; filename="health-report.pdf"')
  const doc = new PDFDocument()
  doc.pipe(res)
  doc.fontSize(20).text('Health Report (Template)', 100, 80)
  doc.fontSize(12).text('This is a preview of a generated health report. Replace with real data in implementation.', 100, 120)
  doc.end()
})

// Additional export endpoint for templates
router.get('/:templateId/export', (req, res) => {
  const templateId = parseInt(req.params.templateId, 10)
  if (Number.isNaN(templateId)) {
    return res.status(400).json({ error: 'Invalid templateId' })
  }
  // Simple stub: return a small CSV/PDF based on template type in memory
  // In a full implementation, would fetch template metadata from DB
  if (templateId === 1) {
    const csv = 'checkpoint,score,max\nintake,0,10\n'
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="health-score-template.csv"')
    return res.send(csv)
  } else if (templateId === 2) {
    // Minimal PDF via PDFKit-like stream (we'll simulate with plain text for placeholder)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="health-report-template.pdf"')
    return res.send('%PDF-1.4\n% placeholder PDF content for template 2')
  } else if (templateId === 3) {
    const csv = 'Header1,Header2,Header3\nA,B,C\n'
    res.setHeader('Content-Type', 'application/vnd.ms-excel')
    res.setHeader('Content-Disposition', 'attachment; filename="health-template.xls"')
    return res.send(csv)
  }
  res.status(404).json({ error: 'Template not found' })
})

export default router
import express from 'express';
const router = express.Router();

// List available report templates
router.get('/templates', (req, res) => {
  const templates = [
    { id: 'health', name: 'Health Report', type: 'csv' },
    { id: 'health_pdf', name: 'Health Report PDF', type: 'pdf' },
  ];
  res.json(templates);
});

// Export a template in requested format (csv|pdf|xlsx as placeholder)
router.get('/templates/:id/export', (req, res) => {
  const { id } = req.params;
  const format = (req.query.format as string) || 'csv';
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.send('id,name,value\n1,Health,100');
  } else if (format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.send('%PDF-1.4 placeholder');
  } else if (format === 'xlsx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send('PK\x03\x04 placeholder');
  } else {
    res.status(400).json({ error: 'Unsupported format' });
  }
});

export default router;
