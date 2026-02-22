package com.taskflow.dto;

import java.util.UUID;
import com.taskflow.enums.Role;

public class CreateEmployeeDTO {

	private String name;
	private String email;
	private Role role;
	private UUID managerId;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public UUID getManagerId() {
		return managerId;
	}
	public void setManagerId(UUID managerId) {
		this.managerId = managerId;
	}


  
}
