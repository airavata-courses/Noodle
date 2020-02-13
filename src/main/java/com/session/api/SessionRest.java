package com.session.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.session.entity.Session;
import com.session.service.SessionService;

@RestController
public class SessionRest {
	
	@Autowired
	private SessionService sessionService;
	
	 @GetMapping("/session-data")
	 @ResponseBody
	public Session getSessionData(@RequestParam String username){
		 
		return sessionService.getSessionData(username);
	}

}
