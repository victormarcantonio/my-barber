package com.mybarber.api.domain.util;


import com.lowagie.text.DocumentException;

import com.mybarber.api.domain.service.AgendamentoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.time.LocalDate;

@Component
public class GerarPdf {


	private static final String PDF_RESOURCES = "/pdf-resources/";
  
    private SpringTemplateEngine templateEngine;

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    public GerarPdf( SpringTemplateEngine templateEngine) {
    
        this.templateEngine = templateEngine;
    }

    public  File generatePdf(int idBarbearia)  {
        Context context = getContext(idBarbearia);
        String html = loadAndFillTemplate(context);
        return renderPdf(html);
    }

    private File renderPdf(String html)  {
    	try {
        File file = File.createTempFile("students", ".pdf");
        OutputStream outputStream = new FileOutputStream(file);
        ITextRenderer renderer = new ITextRenderer(25f * 4f / 3f, 20);
        renderer.setDocumentFromString(html, new ClassPathResource(PDF_RESOURCES).getURL().toExternalForm());
        renderer.layout();
        renderer.createPDF(outputStream);
        outputStream.close();
        file.deleteOnExit();
        return file;
    	}catch(Exception e) {
    		return null;
    	}
    }

   private Context getContext(int idBarbearia) {
        Context context = new Context();
        LocalDate data =  LocalDate.now();

        var mes = data.getMonth().getValue();
        var ano = data.getYear();
        context.setVariable("mes", mes);
        context.setVariable("ano", ano);
        context.setVariable("relatorio", agendamentoService.relatorioServicosMes(idBarbearia));
        return context;
    }

    private String loadAndFillTemplate(Context context) {
        return templateEngine.process("relatorio", context);
    }

}
