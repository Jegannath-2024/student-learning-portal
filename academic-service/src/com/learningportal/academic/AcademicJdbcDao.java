package com.learningportal.academic;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Data Access Object implementing direct JDBC (Java Database Connectivity)
 * for Student Academic Records and Transcript Compilation.
 */
public class AcademicJdbcDao {

    private String jdbcUrl;
    private String username;
    private String password;

    public AcademicJdbcDao() {
        // Defaults to environment variables or standard JDBC url
        this.jdbcUrl = System.getenv("JDBC_DATABASE_URL") != null ? 
                       System.getenv("JDBC_DATABASE_URL") : "jdbc:h2:mem:academicdb;DB_CLOSE_DELAY=-1";
        this.username = System.getenv("JDBC_USER") != null ? System.getenv("JDBC_USER") : "sa";
        this.password = System.getenv("JDBC_PASS") != null ? System.getenv("JDBC_PASS") : "";
    }

    public AcademicJdbcDao(String jdbcUrl, String username, String password) {
        this.jdbcUrl = jdbcUrl;
        this.username = username;
        this.password = password;
    }

    /**
     * Establishes a JDBC connection via DriverManager
     */
    public Connection getConnection() throws SQLException, ClassNotFoundException {
        // Load Driver dynamically if needed
        if (jdbcUrl.startsWith("jdbc:mysql:")) {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } else if (jdbcUrl.startsWith("jdbc:h2:")) {
            Class.forName("org.h2.Driver");
        }
        return DriverManager.getConnection(jdbcUrl, username, password);
    }

    /**
     * Retrieves academic course grades for a student using PreparedStatement and ResultSet
     */
    public List<Map<String, Object>> getStudentTranscript(String studentId) {
        List<Map<String, Object>> transcript = new ArrayList<>();
        String sql = "SELECT record_id, course_code, course_title, semester, credits, grade, grade_points " +
                     "FROM academic_records WHERE student_id = ? ORDER BY semester DESC, course_code ASC";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, studentId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> record = new HashMap<>();
                    record.put("recordId", rs.getInt("record_id"));
                    record.put("courseCode", rs.getString("course_code"));
                    record.put("courseTitle", rs.getString("course_title"));
                    record.put("semester", rs.getString("semester"));
                    record.put("credits", rs.getInt("credits"));
                    record.put("grade", rs.getString("grade"));
                    record.put("gradePoints", rs.getDouble("grade_points"));
                    transcript.add(record);
                }
            }
        } catch (Exception e) {
            System.err.println("[JDBC DAO] Error executing academic transcript query: " + e.getMessage());
        }

        return transcript;
    }

    /**
     * Calculates Cumulative Grade Point Average (GPA) using JDBC aggregate calculations
     */
    public double calculateCumulativeGpa(String studentId) {
        String sql = "SELECT SUM(credits * grade_points) AS total_points, SUM(credits) AS total_credits " +
                     "FROM academic_records WHERE student_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, studentId);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    double points = rs.getDouble("total_points");
                    int credits = rs.getInt("total_credits");
                    if (credits > 0) {
                        return points / credits;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[JDBC DAO] Error computing GPA: " + e.getMessage());
        }

        return 0.0;
    }

    /**
     * Issues an official certificate record using transactional JDBC batch execution
     */
    public boolean issueCertificate(String certId, String studentId, String courseCode, String courseTitle, String signature) {
        String sql = "INSERT INTO certificates (certificate_id, student_id, course_code, course_title, issue_date, digital_signature) " +
                     "VALUES (?, ?, ?, ?, CURRENT_DATE, ?)";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false); // Begin transaction

            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, certId);
                pstmt.setString(2, studentId);
                pstmt.setString(3, courseCode);
                pstmt.setString(4, courseTitle);
                pstmt.setString(5, signature);

                int rows = pstmt.executeUpdate();
                conn.commit(); // Commit transaction
                return rows > 0;
            } catch (SQLException ex) {
                conn.rollback(); // Rollback on failure
                throw ex;
            }
        } catch (Exception e) {
            System.err.println("[JDBC DAO] Transaction failed during certificate issue: " + e.getMessage());
            return false;
        }
    }
}
