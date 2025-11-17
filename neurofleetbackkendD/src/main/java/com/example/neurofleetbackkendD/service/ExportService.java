package com.example.neurofleetbackkendD.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExportService {
    
    // Generate CSV content from report data
    public String generateCSV(List<Map<String, Object>> data) {
        if (data == null || data.isEmpty()) {
            return "";
        }
        
        StringBuilder csv = new StringBuilder();
        
        // Headers
        List<String> headers = data.get(0).keySet().stream()
            .sorted()
            .collect(Collectors.toList());
        csv.append(String.join(",", headers)).append("\n");
        
        // Data rows
        for (Map<String, Object> row : data) {
            List<String> values = headers.stream()
                .map(header -> {
                    Object value = row.get(header);
                    return value != null ? escapeCSV(value.toString()) : "";
                })
                .collect(Collectors.toList());
            csv.append(String.join(",", values)).append("\n");
        }
        
        return csv.toString();
    }
    
    private String escapeCSV(String value) {
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
    
    // Generate simple HTML report (can be converted to PDF)
    public String generateHTMLReport(Map<String, Object> reportData) {
        StringBuilder html = new StringBuilder();
        
        html.append("<!DOCTYPE html>\n");
        html.append("<html>\n<head>\n");
        html.append("<title>NeuroFleetX Report</title>\n");
        html.append("<style>\n");
        html.append("body { font-family: Arial, sans-serif; margin: 40px; }\n");
        html.append("h1 { color: #2c3e50; }\n");
        html.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n");
        html.append("th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }\n");
        html.append("th { background-color: #3498db; color: white; }\n");
        html.append("tr:nth-child(even) { background-color: #f2f2f2; }\n");
        html.append("</style>\n");
        html.append("</head>\n<body>\n");
        
        html.append("<h1>NeuroFleetX Report</h1>\n");
        html.append("<p>Generated: ").append(reportData.get("generatedAt")).append("</p>\n");
        html.append("<p>Period: ").append(reportData.get("periodStart"))
            .append(" to ").append(reportData.get("periodEnd")).append("</p>\n");
        
        html.append("<hr>\n");
        
        // Add report data
        if (reportData.containsKey("data")) {
            Object data = reportData.get("data");
            if (data instanceof List) {
                html.append(convertListToHTMLTable((List<Map<String, Object>>) data));
            } else if (data instanceof Map) {
                html.append(convertMapToHTML((Map<String, Object>) data));
            }
        }
        
        html.append("</body>\n</html>");
        
        return html.toString();
    }
    
    private String convertListToHTMLTable(List<Map<String, Object>> data) {
        if (data.isEmpty()) {
            return "<p>No data available</p>";
        }
        
        StringBuilder table = new StringBuilder();
        table.append("<table>\n<thead>\n<tr>\n");
        
        // Headers
        for (String key : data.get(0).keySet()) {
            table.append("<th>").append(key).append("</th>\n");
        }
        table.append("</tr>\n</thead>\n<tbody>\n");
        
        // Rows
        for (Map<String, Object> row : data) {
            table.append("<tr>\n");
            for (Object value : row.values()) {
                table.append("<td>").append(value != null ? value : "").append("</td>\n");
            }
            table.append("</tr>\n");
        }
        
        table.append("</tbody>\n</table>\n");
        return table.toString();
    }
    
    private String convertMapToHTML(Map<String, Object> data) {
        StringBuilder html = new StringBuilder();
        
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            html.append("<h3>").append(entry.getKey()).append("</h3>\n");
            
            if (entry.getValue() instanceof List) {
                html.append(convertListToHTMLTable((List<Map<String, Object>>) entry.getValue()));
            } else {
                html.append("<p>").append(entry.getValue()).append("</p>\n");
            }
        }
        
        return html.toString();
    }
}
