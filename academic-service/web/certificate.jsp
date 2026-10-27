<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, java.util.*, java.text.SimpleDateFormat" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Academic Excellence</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            background: #0f172a;
            color: #1e293b;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .cert-container {
            width: 900px;
            background: #ffffff;
            border: 14px solid #1e3a8a;
            border-image: linear-gradient(135deg, #1e3a8a, #d97706, #1e3a8a) 20;
            padding: 50px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            text-align: center;
            position: relative;
        }
        .cert-header h1 {
            font-size: 38px;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin: 0 0 10px 0;
        }
        .cert-header p {
            font-size: 16px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0 0 30px 0;
        }
        .recipient-title {
            font-size: 18px;
            font-style: italic;
            color: #475569;
            margin-bottom: 10px;
        }
        .recipient-name {
            font-size: 34px;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 2px solid #cbd5e1;
            display: inline-block;
            padding: 0 40px 10px 40px;
            margin-bottom: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .cert-body {
            font-size: 18px;
            line-height: 1.6;
            color: #334155;
            max-width: 680px;
            margin: 0 auto 40px auto;
        }
        .course-highlight {
            font-weight: bold;
            color: #1e3a8a;
        }
        .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            padding: 0 40px;
        }
        .signature-block {
            text-align: center;
        }
        .sign-line {
            width: 200px;
            border-top: 1px solid #0f172a;
            margin-bottom: 6px;
        }
        .sign-title {
            font-size: 13px;
            font-family: sans-serif;
            color: #64748b;
        }
        .seal-gold {
            width: 90px;
            height: 90px;
            background: radial-gradient(circle, #fde047 0%, #d97706 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #78350f;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
            letter-spacing: 1px;
            border: 3px dashed #b45309;
        }
        .cert-id {
            position: absolute;
            bottom: 12px;
            right: 20px;
            font-size: 11px;
            color: #94a3b8;
            font-family: monospace;
        }
    </style>
</head>
<body>

<%
    String studentName = request.getParameter("name");
    if (studentName == null || studentName.trim().isEmpty()) {
        studentName = "Alex Sterling";
    }

    String courseTitle = request.getParameter("course");
    if (courseTitle == null || courseTitle.trim().isEmpty()) {
        courseTitle = "Full-Stack Web Architectures & Cloud Microservices";
    }

    String certId = "CERT-LP-" + Math.abs((studentName + courseTitle).hashCode());
    String today = new SimpleDateFormat("MMMM dd, yyyy").format(new java.util.Date());
%>

<div class="cert-container">
    <div class="cert-header">
        <h1>Certificate of Mastery</h1>
        <p>Global Center for Advanced Technical Education</p>
    </div>

    <div class="recipient-title">This official credential is systematically awarded to</div>
    <div class="recipient-name"><%= studentName %></div>

    <div class="cert-body">
        for exemplary completion and verified mastery of the rigorous academic curriculum and laboratory practicals in <span class="course-highlight"><%= courseTitle %></span>.
    </div>

    <div class="cert-footer">
        <div class="signature-block">
            <div style="font-family:'Brush Script MT', cursive; font-size: 24px; margin-bottom: 4px; color:#1e3a8a;">Dr. Sarah Mitchell</div>
            <div class="sign-line"></div>
            <div class="sign-title">Academic Program Director</div>
        </div>

        <div class="seal-gold">
            Official<br>Verified<br>Mastery
        </div>

        <div class="signature-block">
            <div style="font-family:sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 4px;"><%= today %></div>
            <div class="sign-line"></div>
            <div class="sign-title">Date of Conferral</div>
        </div>
    </div>

    <div class="cert-id">Credential ID: <%= certId %> • Signed JDBC Record</div>
</div>

</body>
</html>
