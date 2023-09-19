import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  async createPdf() {
    try {
      // Realizar una solicitud GET a la API para obtener los datos
      const data: any = await this.http.get('https://jsonplaceholder.typicode.com/posts/1').toPromise();

      // Llamada a la función para generar el PDF con los datos obtenidos
      this.generatePDF(data);
    } catch (error) {
      console.error('Error al obtener los datos de la API', error);
    }
  }

  generatePDF(data: any) {
    const pdfDefinition: any = {
      content: [
        { text: 'Título del PDF', style: 'header' },
        { text: 'Datos de la API:', style: 'subheader' },
        { text: `ID: ${data.id}`, style: 'body' },
        { text: `Título: ${data.title}`, style: 'body' },
        { text: `Cuerpo: ${data.body}`, style: 'body' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        body: {
          margin: [0, 0, 0, 5],
        },
      },
    };

    // Crear y abrir el PDF
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }
}


