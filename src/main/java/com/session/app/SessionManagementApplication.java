package com.session.app;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.session.service.SessionService;

@ComponentScan({"com.session.api","com.session.service"})
@EntityScan("com.session.entity")
@EnableJpaRepositories("com.session.repository")
@SpringBootApplication
public class SessionManagementApplication {

	private static final Logger logger = LoggerFactory.getLogger(SessionManagementApplication.class);

	private SessionService sessionService;
	
	public static void main(String[] args) {
		SpringApplication.run(SessionManagementApplication.class, args);
		
	}
	
	
	/*
	 * @Bean public SessionService getSessionService() { this.sessionService = new
	 * SessionService(); return this.sessionService; }
	 */

}
