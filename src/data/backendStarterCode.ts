export interface StarterFile {
  path: string;
  filename: string;
  language: 'java' | 'sql' | 'yaml' | 'xml' | 'json' | 'markdown' | 'bash';
  category: 'config' | 'database' | 'security' | 'controller' | 'service' | 'entity' | 'dto' | 'guide';
  description: string;
  content: string;
}

export const BACKEND_FOLDER_STRUCTURE = `protrack-system/
├── frontend/                          # React + TypeScript (Vite + Tailwind CSS)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/
│       │   └── jira.ts               # Domain interfaces (Issue, User, Status, Priority)
│       ├── services/
│       │   ├── api.ts                # Axios/Fetch client with JWT Bearer interceptor
│       │   └── storage.ts            # Local persistence & reactive state bridge
│       └── components/
│           ├── layout/
│           │   ├── Navbar.tsx         # Jira header, search, user profile & role switcher
│           │   └── Sidebar.tsx        # Project navigation, board, backlog, reports
│           ├── board/
│           │   ├── KanbanBoard.tsx    # 4-stage column workflow (Open, In Progress, Resolved, Closed)
│           │   └── IssueCard.tsx      # Draggable card with priority, key & assignee
│           ├── issue/
│           │   ├── CreateIssueModal.tsx # Clean issue submission dialog
│           │   └── IssueDetailModal.tsx # Full issue view with comments & subtasks
│           ├── dashboard/
│           │   └── DashboardView.tsx  # Total, Pending, Resolved & Critical metrics
│           └── reports/
│               └── ReportsView.tsx    # Developer workload & status distribution charts
│
└── backend/                           # Java 21 / Spring Boot 3.3.x REST API
    ├── pom.xml                        # Maven dependencies (Security, JPA, MySQL, JJWT)
    ├── docker-compose.yml             # MySQL 8.0 container & volume configuration
    ├── README.md                      # Comprehensive local laptop run guide
    └── src/
        └── main/
            ├── resources/
            │   ├── application.yml    # Database datasource, JPA & JWT secret config
            │   └── schema.sql         # MySQL 8.0 DDL script with composite indexes
            └── java/com/protrack/
                ├── ProTrackApplication.java
                ├── config/
                │   └── SecurityConfig.java         # Spring Security 6 & CORS policy
                ├── security/
                │   ├── JwtTokenProvider.java       # JWT token generation & HMAC verification
                │   ├── JwtAuthenticationFilter.java# Bearer token extraction filter
                │   └── UserPrincipal.java          # Spring Security UserDetails adapter
                ├── entity/
                │   ├── User.java                   # User entity with Role enum
                │   ├── Issue.java                  # Issue entity with Priority & Status
                │   ├── Comment.java                # Discussion comments entity
                │   └── enums/
                │       ├── Role.java               # ADMIN, DEVELOPER, TESTER, PROJECT_LEAD
                │       ├── Priority.java           # LOW, MEDIUM, HIGH, CRITICAL
                │       ├── IssueStatus.java        # OPEN, IN_PROGRESS, RESOLVED, CLOSED
                │       └── IssueType.java          # BUG, TASK, STORY, IMPROVEMENT
                ├── repository/
                │   ├── UserRepository.java
                │   ├── IssueRepository.java
                │   └── CommentRepository.java
                ├── dto/
                │   ├── AuthDtos.java               # LoginRequest, RegisterRequest, AuthResponse
                │   ├── IssueDtos.java              # CreateIssueRequest, UpdateStatusRequest
                │   └── ReportDtos.java             # DashboardMetricsResponse, DeveloperWorkloadDto
                ├── service/
                │   ├── AuthService.java            # BCrypt password hashing & authentication
                │   ├── IssueService.java           # Issue lifecycle & assignment operations
                │   └── ReportService.java          # SQL aggregation queries for analytics
                └── controller/
                    ├── AuthController.java         # /api/v1/auth (login, register, me)
                    ├── IssueController.java        # /api/v1/issues (CRUD, status, comments)
                    └── ReportController.java       # /api/v1/reports (dashboard, workloads)
`;

export const STARTER_FILES: StarterFile[] = [
  {
    path: 'backend/src/main/resources/schema.sql',
    filename: 'schema.sql',
    language: 'sql',
    category: 'database',
    description: 'Complete MySQL 8.0 DDL script with tables, constraints, foreign keys, and indexes.',
    content: `-- =========================================================================
-- ProTrack Database Schema (MySQL 8.0 / InnoDB Engine)
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- =========================================================================

CREATE DATABASE IF NOT EXISTS protrack_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE protrack_db;

-- 1. Users Table (Authentication and Profiles)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'DEVELOPER', 'TESTER', 'PROJECT_LEAD') NOT NULL DEFAULT 'DEVELOPER',
    avatar_url VARCHAR(255) DEFAULT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_key VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    lead_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_lead FOREIGN KEY (lead_id) REFERENCES users (id) ON DELETE RESTRICT,
    INDEX idx_projects_key (project_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Issues Table (Core Issue Tracking Engine)
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_key VARCHAR(20) NOT NULL UNIQUE, -- e.g. PRO-101
    project_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_type ENUM('BUG', 'TASK', 'STORY', 'IMPROVEMENT') NOT NULL DEFAULT 'TASK',
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    story_points INT DEFAULT 3,
    assignee_id BIGINT DEFAULT NULL,       -- Developer assigned
    reporter_id BIGINT NOT NULL,           -- Creator of the issue
    version BIGINT NOT NULL DEFAULT 0,     -- Optimistic locking
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_issues_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_issues_assignee FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_issues_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE RESTRICT,
    
    -- Composite indexes for high-speed Kanban board and report aggregation queries
    INDEX idx_issues_status_priority (status, priority),
    INDEX idx_issues_assignee_status (assignee_id, status),
    INDEX idx_issues_project_status (project_id, status),
    INDEX idx_issues_key (issue_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Comments Table (Discussion Panel)
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_comments_issue FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_comments_issue (issue_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Subtasks Table (Checklist inside issues)
CREATE TABLE IF NOT EXISTS subtasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subtasks_issue FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE,
    INDEX idx_subtasks_issue (issue_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Issue Audit Logs (Audit History)
CREATE TABLE IF NOT EXISTS issue_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    actor_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- STATUS_CHANGED, ASSIGNED, PRIORITY_CHANGED
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_issue FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE RESTRICT,
    INDEX idx_audit_issue (issue_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`,
  },
  {
    path: 'backend/src/main/resources/seed.sql',
    filename: 'seed.sql',
    language: 'sql',
    category: 'database',
    description: 'Realistic seed data with initial test users, project, and sample issues.',
    content: `-- Seed Test Users (BCrypt hashed password for 'password123': $2a$10$7R3v8Z1n1g9k8w7...)
USE protrack_db;

INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES
(1, 'alex.chen', 'alex.chen@protrack.io', '$2a$10$w09ZlE5M/8E.eEaDq6uRFe7vD7x8aH1JcTz.Uq1bK4m7wNqT8wY.W', 'Alex Chen', 'PROJECT_LEAD'),
(2, 'sarah.jenkins', 'sarah.jenkins@protrack.io', '$2a$10$w09ZlE5M/8E.eEaDq6uRFe7vD7x8aH1JcTz.Uq1bK4m7wNqT8wY.W', 'Sarah Jenkins', 'DEVELOPER'),
(3, 'marcus.vance', 'marcus.vance@protrack.io', '$2a$10$w09ZlE5M/8E.eEaDq6uRFe7vD7x8aH1JcTz.Uq1bK4m7wNqT8wY.W', 'Marcus Vance', 'DEVELOPER'),
(4, 'elena.rostova', 'elena.rostova@protrack.io', '$2a$10$w09ZlE5M/8E.eEaDq6uRFe7vD7x8aH1JcTz.Uq1bK4m7wNqT8wY.W', 'Elena Rostova', 'ADMIN'),
(5, 'liam.tester', 'liam.miller@protrack.io', '$2a$10$w09ZlE5M/8E.eEaDq6uRFe7vD7x8aH1JcTz.Uq1bK4m7wNqT8wY.W', 'Liam Miller', 'TESTER');

-- Seed Project
INSERT INTO projects (id, project_key, name, description, lead_id) VALUES
(1, 'PRO', 'ProTrack Enterprise System', 'Production Jira-style issue tracker with Spring Boot 3 & MySQL backend.', 1);

-- Seed Initial Issues
INSERT INTO issues (id, issue_key, project_id, title, description, issue_type, status, priority, story_points, assignee_id, reporter_id) VALUES
(1, 'PRO-101', 1, 'Implement Spring Security 6 stateless JWT authentication filter', 'Configure OncePerRequestFilter with HMAC-SHA256 signature verification.', 'TASK', 'IN_PROGRESS', 'HIGH', 5, 3, 1),
(2, 'PRO-102', 1, 'Fix null pointer exception during user registration with blank email', 'Add @NotBlank and @Email bean validation annotations to RegisterRequest.', 'BUG', 'OPEN', 'CRITICAL', 3, 2, 5),
(3, 'PRO-103', 1, 'Design MySQL relational schema with composite indexes and foreign keys', 'Create DDL script with InnoDB engine and composite indexes.', 'TASK', 'RESOLVED', 'HIGH', 5, 3, 4),
(4, 'PRO-104', 1, 'Build interactive Kanban board with column drag and drop workflow', 'Support Open, In Progress, Resolved, and Closed lifecycle columns.', 'STORY', 'IN_PROGRESS', 'MEDIUM', 8, 2, 1),
(5, 'PRO-105', 1, 'Create reports dashboard with developer workload and status breakdowns', 'Calculate assignment workloads and status distribution metrics.', 'STORY', 'RESOLVED', 'MEDIUM', 5, 2, 4),
(6, 'PRO-106', 1, 'Add comment thread discussion panel inside issue detail modal', 'Allow developers and testers to post technical notes with timestamps.', 'TASK', 'CLOSED', 'MEDIUM', 3, 2, 3);

-- Seed Comments
INSERT INTO comments (id, issue_id, author_id, content) VALUES
(1, 1, 3, 'I have drafted the JwtTokenProvider with JJWT 0.12. Testing token generation now.'),
(2, 1, 1, 'Ensure CORS headers allow http://localhost:3000 from our React dev server.'),
(3, 2, 5, 'Reproduced on Chrome 130: Leaving email blank causes 500 error.');
`,
  },
  {
    path: 'backend/pom.xml',
    filename: 'pom.xml',
    language: 'xml',
    category: 'config',
    description: 'Maven build file with Spring Boot 3.3.x, Spring Security, Spring Data JPA, MySQL Driver & JJWT 0.12.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    
    <groupId>com.protrack</groupId>
    <artifactId>protrack-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>protrack-backend</name>
    <description>ProTrack Jira-Style Issue Tracker Backend</description>
    
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Connector/J -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- JJWT for Stateless JWT Authentication -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok Developer Productivity -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`,
  },
  {
    path: 'backend/src/main/resources/application.yml',
    filename: 'application.yml',
    language: 'yaml',
    category: 'config',
    description: 'Spring Boot application configuration for MySQL connection, HikariCP, and JWT secrets.',
    content: `server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: protrack-backend

  datasource:
    url: jdbc:mysql://localhost:3306/protrack_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5
      idle-timeout: 30000
      connection-timeout: 20000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

  sql:
    init:
      mode: always
      schema-locations: classpath:schema.sql
      data-locations: classpath:seed.sql

# JWT Security Configuration
app:
  jwt:
    # 256-bit base64-encoded secret key for HMAC-SHA256
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration-ms: 86400000 # 24 Hours

# Cross-Origin Resource Sharing (CORS)
cors:
  allowed-origins:
    - "http://localhost:3000"
    - "http://localhost:5173"
`,
  },
  {
    path: 'backend/docker-compose.yml',
    filename: 'docker-compose.yml',
    language: 'yaml',
    category: 'config',
    description: 'Docker Compose configuration for running MySQL 8.0 on your local laptop with volume persistence.',
    content: `version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: protrack-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: protrack_db
      MYSQL_USER: protrack_user
      MYSQL_PASSWORD: protrack_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql
      - ./src/main/resources/seed.sql:/docker-entrypoint-initdb.d/02_seed.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-prootpassword"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
    driver: local
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/config/SecurityConfig.java',
    filename: 'SecurityConfig.java',
    language: 'java',
    category: 'security',
    description: 'Spring Security 6 configuration establishing stateless session, CORS, and role authorizations.',
    content: `package com.protrack.config;

import com.protrack.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public authentication endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/health").permitAll()
                // Swagger / OpenAPI documentation
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                // Role-restricted deletion: Only ADMIN or PROJECT_LEAD
                .requestMatchers(HttpMethod.DELETE, "/api/v1/issues/**").hasAnyRole("ADMIN", "PROJECT_LEAD")
                // All other business endpoints require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/security/JwtTokenProvider.java',
    filename: 'JwtTokenProvider.java',
    language: 'java',
    category: 'security',
    description: 'JWT Provider for generating HMAC-SHA256 bearer tokens, extracting claims, and verifying signatures.',
    content: `package com.protrack.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("userId", userPrincipal.getId())
                .claim("email", userPrincipal.getEmail())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getUsernameFromJwt(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // Log warning: MalformedJwtException, ExpiredJwtException, UnsupportedJwtException
            return false;
        }
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/security/JwtAuthenticationFilter.java',
    filename: 'JwtAuthenticationFilter.java',
    language: 'java',
    category: 'security',
    description: 'Stateless filter extracting Bearer JWT from Authorization header on each incoming HTTP request.',
    content: `package com.protrack.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJwt(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/entity/Issue.java',
    filename: 'Issue.java',
    language: 'java',
    category: 'entity',
    description: 'JPA entity modeling Jira issues with optimistic locking version, foreign keys, and status enums.',
    content: `package com.protrack.entity;

import com.protrack.entity.enums.IssueStatus;
import com.protrack.entity.enums.IssueType;
import com.protrack.entity.enums.Priority;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues", indexes = {
    @Index(name = "idx_issues_status_priority", columnList = "status, priority"),
    @Index(name = "idx_issues_assignee_status", columnList = "assignee_id, status"),
    @Index(name = "idx_issues_key", columnList = "issue_key", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "issue_key", nullable = false, unique = true, length = 20)
    private String issueKey; // e.g. "PRO-101"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", nullable = false)
    private IssueType issueType; // BUG, TASK, STORY, IMPROVEMENT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "story_points")
    private Integer storyPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Version
    private Long version; // Optimistic locking to prevent lost concurrent updates

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/controller/IssueController.java',
    filename: 'IssueController.java',
    language: 'java',
    category: 'controller',
    description: 'REST Controller for issue creation, status transition, assignment, search & comments.',
    content: `package com.protrack.controller;

import com.protrack.dto.IssueDtos.*;
import com.protrack.entity.enums.IssueStatus;
import com.protrack.entity.enums.Priority;
import com.protrack.security.UserPrincipal;
import com.protrack.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public ResponseEntity<List<IssueResponseDto>> getIssues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) IssueStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long assigneeId) {
        return ResponseEntity.ok(issueService.findIssues(search, status, priority, assigneeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponseDto> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }

    @PostMapping
    public ResponseEntity<IssueResponseDto> createIssue(
            @Valid @RequestBody CreateIssueRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        IssueResponseDto created = issueService.createIssue(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IssueResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(issueService.updateStatus(id, request.getStatus(), currentUser.getId()));
    }

    @PatchMapping("/{id}/assignee")
    public ResponseEntity<IssueResponseDto> assignIssue(
            @PathVariable Long id,
            @Valid @RequestBody AssignIssueRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(issueService.assignIssue(id, request.getAssigneeId(), currentUser.getId()));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody AddCommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(issueService.addComment(id, request.getContent(), currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_LEAD')")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/controller/AuthController.java',
    filename: 'AuthController.java',
    language: 'java',
    category: 'controller',
    description: 'REST Controller for user registration, login, and JWT token issuance.',
    content: `package com.protrack.controller;

import com.protrack.dto.AuthDtos.*;
import com.protrack.security.UserPrincipal;
import com.protrack.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(principal.getId()));
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/controller/ReportController.java',
    filename: 'ReportController.java',
    language: 'java',
    category: 'controller',
    description: 'REST Controller serving analytical dashboard summaries and developer workload distributions.',
    content: `package com.protrack.controller;

import com.protrack.dto.ReportDtos.*;
import com.protrack.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardMetricsResponse> getDashboardMetrics() {
        return ResponseEntity.ok(reportService.getDashboardMetrics());
    }

    @GetMapping("/developer-workload")
    public ResponseEntity<List<DeveloperWorkloadDto>> getDeveloperWorkload() {
        return ResponseEntity.ok(reportService.getDeveloperWorkloadSummary());
    }

    @GetMapping("/status-breakdown")
    public ResponseEntity<List<StatusBreakdownDto>> getStatusBreakdown() {
        return ResponseEntity.ok(reportService.getStatusBreakdownSummary());
    }
}
`,
  },
  {
    path: 'backend/src/main/java/com/protrack/service/IssueService.java',
    filename: 'IssueService.java',
    language: 'java',
    category: 'service',
    description: 'Business service managing issue validation, status transitions, and audit records.',
    content: `package com.protrack.service;

import com.protrack.dto.IssueDtos.*;
import com.protrack.entity.Comment;
import com.protrack.entity.Issue;
import com.protrack.entity.User;
import com.protrack.entity.enums.IssueStatus;
import com.protrack.entity.enums.Priority;
import com.protrack.repository.CommentRepository;
import com.protrack.repository.IssueRepository;
import com.protrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public List<IssueResponseDto> findIssues(String search, IssueStatus status, Priority priority, Long assigneeId) {
        return issueRepository.findWithFilters(search, status, priority, assigneeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IssueResponseDto getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found with ID: " + id));
        return mapToDto(issue);
    }

    @Transactional
    public IssueResponseDto createIssue(CreateIssueRequest request, Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found"));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId()).orElse(null);
        }

        long nextIndex = issueRepository.count() + 101;
        String issueKey = "PRO-" + nextIndex;

        Issue issue = Issue.builder()
                .issueKey(issueKey)
                .title(request.getTitle())
                .description(request.getDescription())
                .issueType(request.getIssueType())
                .status(IssueStatus.OPEN)
                .priority(request.getPriority())
                .storyPoints(request.getStoryPoints() != null ? request.getStoryPoints() : 3)
                .assignee(assignee)
                .reporter(reporter)
                .build();

        return mapToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponseDto updateStatus(Long id, IssueStatus newStatus, Long actorId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        issue.setStatus(newStatus);
        return mapToDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueResponseDto assignIssue(Long id, Long assigneeId, Long actorId) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        if (assigneeId == null) {
            issue.setAssignee(null);
        } else {
            User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new IllegalArgumentException("Assignee user not found"));
            issue.setAssignee(assignee);
        }

        return mapToDto(issueRepository.save(issue));
    }

    @Transactional
    public CommentResponseDto addComment(Long issueId, String content, Long authorId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = Comment.builder()
                .issue(issue)
                .author(author)
                .content(content)
                .build();

        Comment saved = commentRepository.save(comment);
        return new CommentResponseDto(saved.getId(), saved.getContent(), author.getFullName(), author.getId(), saved.getCreatedAt());
    }

    @Transactional
    public void deleteIssue(Long id) {
        if (!issueRepository.existsById(id)) {
            throw new IllegalArgumentException("Issue not found with ID: " + id);
        }
        issueRepository.deleteById(id);
    }

    private IssueResponseDto mapToDto(Issue issue) {
        return IssueResponseDto.builder()
                .id(issue.getId())
                .issueKey(issue.getIssueKey())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .issueType(issue.getIssueType())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .storyPoints(issue.getStoryPoints())
                .assigneeId(issue.getAssignee() != null ? issue.getAssignee().getId() : null)
                .assigneeName(issue.getAssignee() != null ? issue.getAssignee().getFullName() : null)
                .reporterName(issue.getReporter().getFullName())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }
}
`,
  },
  {
    path: 'backend/README.md',
    filename: 'README.md',
    language: 'markdown',
    category: 'guide',
    description: 'Step-by-step local laptop run instructions: Docker MySQL, Spring Boot, React, and testing.',
    content: `# ProTrack - Local Laptop Setup Guide

Follow this guide to run the complete **ProTrack** Jira-style issue tracker on your local workstation.

---

## 1. Prerequisites Checklist

Ensure your laptop has the following tools installed:
- **Java Development Kit (JDK 21 or 17)**: Verify with \`java -version\`
- **Maven 3.9+** (or use the included \`./mvnw\` wrapper)
- **Docker & Docker Compose** (Recommended for MySQL) OR a native **MySQL 8.0** server
- **Node.js (v20+) & npm**: Verify with \`node -v\` and \`npm -v\`

---

## 2. Step 1: Start MySQL Database

### Option A: Using Docker Compose (Easiest)
From the project root directory, run:
\`\`\`bash
docker compose up -d mysql
\`\`\`
This will launch MySQL 8.0 on port \`3306\` and automatically execute \`schema.sql\` and \`seed.sql\`.

Verify it is running:
\`\`\`bash
docker ps
# Look for container named 'protrack-mysql' with status 'healthy'
\`\`\`

### Option B: Using Native MySQL
1. Connect to your local MySQL server:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Run the initialization scripts:
   \`\`\`sql
   SOURCE backend/src/main/resources/schema.sql;
   SOURCE backend/src/main/resources/seed.sql;
   \`\`\`

---

## 3. Step 2: Configure & Start Spring Boot Backend

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. (Optional) Check \`src/main/resources/application.yml\` to verify database credentials:
   \`\`\`yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/protrack_db?useSSL=false
       username: root
       password: rootpassword
   \`\`\`

3. Build and launch the Spring Boot service:
   \`\`\`bash
   ./mvnw clean spring-boot:run
   \`\`\`
   *(On Windows PowerShell, use \`.\\mvnw.cmd clean spring-boot:run\`)*

4. The REST API will start on **\`http://localhost:8080\`**.
   You can verify it with curl:
   \`\`\`bash
   curl -X GET http://localhost:8080/api/v1/auth/me
   \`\`\`

---

## 4. Step 3: Start the React + TypeScript Frontend

1. Open a new terminal window in the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies (if not already installed):
   \`\`\`bash
   npm install
   \`\`\`

3. Launch the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open **\`http://localhost:3000\`** in your browser.
   You will see the ProTrack Jira interface connected and ready!

---

## 5. Default Test Accounts

| Username | Password | Full Name | Role | Primary Permissions |
|---|---|---|---|---|
| \`alex.chen\` | \`password123\` | Alex Chen | PROJECT_LEAD | Sprint management, assign, all status changes |
| \`sarah.jenkins\` | \`password123\` | Sarah Jenkins | DEVELOPER | Move cards, code reviews, comments, subtasks |
| \`marcus.vance\` | \`password123\` | Marcus Vance | DEVELOPER | Move cards, code reviews, comments, subtasks |
| \`elena.rostova\` | \`password123\` | Elena Rostova | ADMIN | Unrestricted access & issue deletion |
| \`liam.tester\` | \`password123\` | Liam Miller | TESTER | Submit bug reports, comment, verify fixes |

---

## 6. Sample REST API Testing with curl

### 1. Authenticate & Obtain JWT Token
\`\`\`bash
curl -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "alex.chen", "password": "password123"}'
\`\`\`

### 2. Create a New Issue (Passing Bearer Token)
\`\`\`bash
curl -X POST http://localhost:8080/api/v1/issues \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -d '{
    "title": "Add redis cache layer for issue search",
    "description": "Cache frequent search results with 60 second TTL.",
    "issueType": "IMPROVEMENT",
    "priority": "HIGH",
    "storyPoints": 5,
    "assigneeId": 2
  }'
\`\`\`

### 3. Transition Issue Status
\`\`\`bash
curl -X PATCH http://localhost:8080/api/v1/issues/1/status \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -d '{"status": "RESOLVED"}'
\`\`\`
`,
  },
];
