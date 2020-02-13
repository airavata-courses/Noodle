package com.session.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
public class Session {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
    private Long sessionid;
	
	
    private String username;
	
	private String station;
	
	private String job;
	
	private String status;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getStation() {
		return station;
	}

	public void setStation(String station) {
		this.station = station;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	


	public Session() {
		super();
	}

	public Session(String username, String station, String job, String status) {
		super();
		this.username = username;
		this.station = station;
		this.job = job;
		this.status = status;
	}
	
	
	
	
	
	
	
	
	

}
