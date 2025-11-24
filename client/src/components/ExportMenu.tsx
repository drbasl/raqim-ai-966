import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileCode, File } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface ExportMenuProps {
  title: string;
  basePrompt: string;
  enhancedPrompt: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function ExportMenu({
  title,
  basePrompt,
  enhancedPrompt,
  variant = "outline",
  size = "sm",
  className = "",
}: ExportMenuProps) {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  // تصدير PDF
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // إعداد الخط العربي (استخدام خط افتراضي يدعم العربية)
      doc.setFont("helvetica");
      doc.setFontSize(16);
      
      // العنوان
      doc.text(title, 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      let yPosition = 40;
      
      // البرومبت الأساسي
      doc.setFont("helvetica", "bold");
      doc.text("البرومبت الأساسي:", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const baseLines = doc.splitTextToSize(basePrompt, 170);
      doc.text(baseLines, 20, yPosition);
      yPosition += baseLines.length * 7 + 15;
      
      // البرومبت المحسّن
      doc.setFont("helvetica", "bold");
      doc.text("البرومبت المحسّن:", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      const enhancedLines = doc.splitTextToSize(enhancedPrompt, 170);
      doc.text(enhancedLines, 20, yPosition);
      
      // حفظ الملف
      doc.save(`${title.slice(0, 30)}.pdf`);
      toast.success(t('export.pdfSuccess'));
    } catch (error) {
      console.error("Error exporting PDF:", error);
        toast.error(t('export.error'));
    } finally {
      setIsExporting(false);
    }
  };

  // تصدير Word
  const exportToWord = async () => {
    try {
      setIsExporting(true);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "البرومبت الأساسي:",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: basePrompt,
                spacing: { after: 300 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "البرومبت المحسّن:",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: enhancedPrompt,
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title.slice(0, 30)}.docx`);
      toast.success(t('export.wordSuccess'));
    } catch (error) {
      console.error("Error exporting Word:", error);
      toast.error("حدث خطأ أثناء تصدير Word");
    } finally {
      setIsExporting(false);
    }
  };

  // تصدير Markdown
  const exportToMarkdown = () => {
    try {
      setIsExporting(true);

      const markdown = `# ${title}

## البرومبت الأساسي

${basePrompt}

## البرومبت المحسّن

${enhancedPrompt}

---
*تم التصدير من رقيم AI 966*
`;

      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      saveAs(blob, `${title.slice(0, 30)}.md`);
      toast.success(t('export.markdownSuccess'));
    } catch (error) {
      console.error("Error exporting Markdown:", error);
      toast.error("حدث خطأ أثناء تصدير Markdown");
    } finally {
      setIsExporting(false);
    }
  };

  // تصدير نص عادي
  const exportToText = () => {
    try {
      setIsExporting(true);

      const text = `${title}
${"=".repeat(title.length)}

البرومبت الأساسي:
${basePrompt}

${"-".repeat(50)}

البرومبت المحسّن:
${enhancedPrompt}

${"-".repeat(50)}
تم التصدير من رقيم AI 966
`;

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${title.slice(0, 30)}.txt`);
      toast.success(t('export.textSuccess'));
    } catch (error) {
      console.error("Error exporting Text:", error);
      toast.error("حدث خطأ أثناء تصدير النص");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isExporting}
        >
          <Download className="ml-2 w-4 h-4" />
          {t('export.title')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="ml-2 w-4 h-4" />
          {t('export.pdf')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToWord} className="cursor-pointer">
          <FileCode className="ml-2 w-4 h-4" />
          {t('export.word')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToMarkdown} className="cursor-pointer">
          <File className="ml-2 w-4 h-4" />
          {t('export.markdown')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToText} className="cursor-pointer">
          <FileText className="ml-2 w-4 h-4" />
          {t('export.text')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
