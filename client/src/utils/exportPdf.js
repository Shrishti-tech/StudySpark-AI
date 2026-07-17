import { jsPDF } from "jspdf";

const MARGIN = 15;
const LINE_HEIGHT = 6;

export function exportFlashcardsToPdf(flashcards, topic) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = pageWidth - MARGIN * 2;

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("StudySpark AI", MARGIN, MARGIN);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");
  const subtitle = topic ? `Flashcards — ${topic}` : "Flashcards";
  doc.text(subtitle, MARGIN, MARGIN + 7);

  let y = MARGIN + 18;

  flashcards.forEach((card, index) => {
    const questionLines = doc.splitTextToSize(card.question, textWidth);
    const answerLines = doc.splitTextToSize(card.answer, textWidth);
    const blockHeight = LINE_HEIGHT * (3 + questionLines.length + answerLines.length) + 6;

    if (y + blockHeight > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text(`Flashcard ${index + 1}`, MARGIN, y);
    y += LINE_HEIGHT;

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("Question:", MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont(undefined, "normal");
    doc.text(questionLines, MARGIN, y);
    y += LINE_HEIGHT * questionLines.length;

    doc.setFont(undefined, "bold");
    doc.text("Answer:", MARGIN, y);
    y += LINE_HEIGHT;
    doc.setFont(undefined, "normal");
    doc.text(answerLines, MARGIN, y);
    y += LINE_HEIGHT * answerLines.length;

    y += 4;
    doc.setDrawColor(200);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 8;
  });

  doc.save("studyspark-flashcards.pdf");
}
