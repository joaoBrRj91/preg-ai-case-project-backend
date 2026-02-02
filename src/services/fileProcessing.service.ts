import * as pdfjsLib from "pdfjs-dist";
import path from "path";

class FileProcessingService {
  private pdfjs: any = null;

  private initPdfJs(): void {
    if (!this.pdfjs) {
      this.pdfjs = pdfjsLib;
      const workerPath = path.join(
        path.dirname(require.resolve("pdfjs-dist/package.json")),
        "build",
        "pdf.worker.min.js",
      );
      this.pdfjs.GlobalWorkerOptions.workerSrc = workerPath;
    }
  }

  async extractTextFromPDF(fileData: Uint8Array): Promise<string> {
    try {
      this.initPdfJs();

      console.log("Load pdf modules");
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
        }`,
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
        }`,
      );
    }
  }

  async processFile(
    fileData: Buffer | Uint8Array,
    mimeType: string,
  ): Promise<string> {
    let uint8Array: Uint8Array = fileData;
    if (mimeType === "application/pdf") {
      console.log("pdf");
      uint8Array = new Uint8Array(
        fileData.buffer,
        fileData.byteOffset,
        fileData.byteLength,
      );
    }

    if (mimeType === "application/pdf") {
      return this.extractTextFromPDF(uint8Array);
    } else if (mimeType === "text/plain") {
      return this.extractTextFromPlainText(uint8Array);
    } else {
      throw new Error(
        `Unsupported file type: ${mimeType}. Supported types: application/pdf, text/plain`,
      );
    }
  }
}

export default new FileProcessingService();
