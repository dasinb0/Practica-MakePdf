import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Llama a createPdf después de que la vista se haya inicializado
    this.createPdf();
  }

  async createPdf() {
    try {
      // Realiza una solicitud GET para obtener el contenido HTML desde "assets/turno.html"
      const htmlContent = await this.http.get('assets/turno.html', { responseType: 'text' }).toPromise();

      // Llamada a la función para generar el PDF con el contenido HTML
      this.generatePDF(htmlContent);
    } catch (error) {
      console.error('Error al obtener el contenido HTML', error);
    }
  }

  generatePDF(htmlContent: string) {
    // Obtén el elemento que contiene el HTML
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
  
    // Crear un elemento iframe y agregar el contenido HTML
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    document.body.appendChild(iframe);
  
    // Esperar a que el iframe se cargue completamente
    iframe.onload = () => {
      // Agregar el contenido al iframe
      iframe.contentDocument.body.appendChild(element);
  
      // Utiliza html2canvas para capturar el contenido HTML como una imagen con ajustes personalizados
      html2canvas(iframe.contentDocument.body, {
        scale: 2, 
       }).then((canvas) => {
        const dataUrl = canvas.toDataURL(); 
  
        const pdfDefinition: any = {
          content: [
            {
              image: dataUrl,
              width: 500, 
            },
          ],
        };
  
        // Crear y abrir el PDF
        const pdf = pdfMake.createPdf(pdfDefinition);
  
        // Aplicar el estilo display: none; después de tomar la captura
        iframe.style.display = 'none';
  
        // Abre el PDF después de ocultar el iframe
        pdf.open();
  
        // Eliminar el iframe después de su uso
        document.body.removeChild(iframe);
      });
    };
  
    // Establecer la fuente del iframe
    iframe.src = 'about:blank';
  }
}




