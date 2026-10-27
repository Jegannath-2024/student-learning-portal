package com.learningportal.academic;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Lightweight standalone Java Web Server that renders and serves
 * the Academic JSP & JDBC transcripts and certificates.
 */
public class AcademicServiceRunner {

    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        System.out.println("=======================================================");
        System.out.println("Academic JSP & JDBC Service initializing on port: " + PORT);
        System.out.println("Access Transcript: http://localhost:" + PORT + "/transcript.jsp?studentId=STU-2026-8941");
        System.out.println("Access Certificate: http://localhost:" + PORT + "/certificate.jsp?name=Alex+Sterling");
        System.out.println("=======================================================");

        server.createContext("/transcript.jsp", new JspPageHandler("web/transcript.jsp"));
        server.createContext("/certificate.jsp", new JspPageHandler("web/certificate.jsp"));
        server.createContext("/health", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String response = "{\"status\":\"online\",\"service\":\"Academic JSP & JDBC Subsystem\"}";
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        });

        server.setExecutor(null); // Default executor
        server.start();
    }

    /**
     * Handler simulating JSP page processing and variable substitution
     */
    static class JspPageHandler implements HttpHandler {
        private final String jspPath;

        public JspPageHandler(String relativePath) {
            this.jspPath = relativePath;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String studentId = params.getOrDefault("studentId", "STU-2026-8941");
            String studentName = params.getOrDefault("name", "Alex Sterling");
            String courseTitle = params.getOrDefault("course", "Full-Stack Web Architectures");

            String fullPath = "academic-service/" + jspPath;
            if (!new File(fullPath).exists()) {
                fullPath = jspPath; // fallback
            }

            String jspContent;
            if (new File(fullPath).exists()) {
                jspContent = new String(Files.readAllBytes(Paths.get(fullPath)));
            } else {
                jspContent = "<h1>JSP file not found: " + fullPath + "</h1>";
            }

            // Execute JSP expressions simulation first, then strip raw scriptlets
            String renderedHtml = jspContent
                .replace("<%= studentName %>", studentName)
                .replace("<%= targetStudentId %>", studentId)
                .replace("<%= major %>", "Computer Science & Engineering")
                .replace("<%= standing %>", "Dean's Honors List")
                .replace("<%= totalCredits %>", "14")
                .replace("<%= df.format(totalGradePoints) %>", "52.30")
                .replace("<%= df.format(gpa) %>", "3.74")
                .replace("<%= courseTitle %>", courseTitle)
                .replace("<%= certId %>", "CERT-LP-" + Math.abs((studentName + courseTitle).hashCode()))
                .replace("<%= today %>", new java.text.SimpleDateFormat("MMMM dd, yyyy").format(new java.util.Date()))
                .replace("<%= new java.util.Date() %>", new java.util.Date().toString())
                .replaceAll("<%@[^>]*%>", "") // Strip directives
                .replaceAll("<%[\\s\\S]*?%>", ""); // Strip scriptlets

            byte[] responseBytes = renderedHtml.getBytes("UTF-8");
            exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
            exchange.sendResponseHeaders(200, responseBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(responseBytes);
            }
        }

        private Map<String, String> parseQueryParams(String query) {
            Map<String, String> map = new HashMap<>();
            if (query == null) return map;
            for (String pair : query.split("&")) {
                String[] parts = pair.split("=");
                if (parts.length == 2) {
                    map.put(parts[0], java.net.URLDecoder.decode(parts[1], java.nio.charset.StandardCharsets.UTF_8));
                }
            }
            return map;
        }
    }
}
