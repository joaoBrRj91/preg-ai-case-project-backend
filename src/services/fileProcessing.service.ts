class FileProcessingService {
  private pdfjs: any = null;

  private async initPdfJs(): Promise<void> {
    if (!this.pdfjs) {
      this.pdfjs = await import("pdfjs-dist");
      this.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${this.pdfjs.version}/pdf.worker.min.js`;
    }
  }

  async extractTextFromPDF(fileData: Uint8Array): Promise<string> {
    try {
      await this.initPdfJs();
      const pdf = await this.pdfjs.getDocument({ data: fileData }).promise;
      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (error) {
      throw new Error(
        `Failed to extract text from PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async extractTextFromPlainText(fileData: Uint8Array): Promise<string> {
    try {
      const decoder = new TextDecoder();
      const text = decoder.decode(fileData);
      return text.trim();
    } catch (error) {
      throw new Error(
        `Failed to extract text from plain text file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async processFile(
    fileData: number[],
    mimeType: "application/pdf" | "text/plain"
  ): Promise<string> {
    const uint8Array = new Uint8Array(fileData);

    if (mimeType === "application/pdf") {
      return this.extractTextFromPDF(uint8Array);
    } else if (mimeType === "text/plain") {
      return this.extractTextFromPlainText(uint8Array);
    } else {
      throw new Error(
        `Unsupported file type: ${mimeType}. Supported types: application/pdf, text/plain`
      );
    }
  }
}

export default new FileProcessingService();
