import {PDFParse} from "pdf-parse";

const extractTextFromPdf = async (buffer)=>{
    const parser= new PDFParse({
        data :buffer
    });
    const data = await parser.getText();

    return data.text;
}

export default extractTextFromPdf;