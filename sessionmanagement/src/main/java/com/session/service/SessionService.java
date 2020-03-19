package com.session.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.session.app.SessionManagementApplication;
import com.session.entity.Session;
import com.session.repository.SessionRepository;

import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SessionService {
	
	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private KafkaTemplate<String, String> kafkaTemplate;
	
	 private static final Logger logger = LoggerFactory.getLogger(SessionService.class);
	

	 @KafkaListener(topics = { "retrieve-session","model-session","process-session"} ,groupId = "session")
	    public void listen(String message) {
		 logger.info("Received Message: " + message);
		 JSONObject json = new JSONObject();
		 System.out.println("Received Message: " + message);
		 try {
	            json = (JSONObject) new JSONParser().parse(message);
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }

		 List<Session> sessionList = sessionRepository.findByUsername((String)json.get("user"));
		 
		 if(sessionList.isEmpty()) {
			 Session session = new Session((String)json.get("user"),(String)json.get("station"),(String)json.get("name"),(String)json.get("status") 
	            		);
			sessionRepository.save(session);
			  produceMessage(session);
	            
			 
		 }else {
			 
			 Session session = sessionList.get(0);
			 session.setJob((String)json.get("name"));
			 session.setStatus((String)json.get("status"));
			 sessionRepository.save(session);
			  produceMessage(session);
			 
		 }
		 
		 logger.info("Saved the message");
	       
	    }

	 	@SuppressWarnings("unchecked")
		public void produceMessage(Session session) {
	 		 logger.info("Producing the  message ........");
	 		
	 		JSONObject json = new JSONObject();
	 		json.put("job", session.getJob());
	 		json.put("username", session.getUsername());
	 		json.put("status", session.getStatus());
	 		json.put("station", session.getStation());
	 		
	
	 		kafkaTemplate.send("current-status", json.toJSONString());
	 		
	 		 logger.info("Produced the message");
	 		
	 	}

		public Session getSessionData(String userName) {
			
			 logger.info("Retrieveing the session data .....");
			 List<Session> sessionList = sessionRepository.findByUsername(userName);
			 Session session;
			 if(sessionList.isEmpty()) {
				 session = new Session("NA","NA","NA","NA");
			
				 logger.info("Could not find any session data , returning default record");

			 }else {
				 
				 session = sessionList.get(0);
				 logger.info("Retrieved the session data ");

			 }
			
			return session;
		}
		
	        
	  }

