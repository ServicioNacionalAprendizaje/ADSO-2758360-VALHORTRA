package com.SENA.GOAPPv2.DTO;

public class LoginSession {
    private String username;
    private String role;

    public LoginSession(String username, String role) {
        this.username = username;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}
