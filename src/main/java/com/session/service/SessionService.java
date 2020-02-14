package com.session.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.session.entity.Session;
import com.session.repository.SessionRepository;

import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@Service
public class SessionService {
	
	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private KafkaTemplate<String, String> kafkaTemplate;
	

	 @KafkaListener(topics = { "retrieve-session","model-session","process-session"} ,groupId = "session")
	    public void listen(String message) {
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
	       
	    }

	 	@SuppressWarnings("unchecked")
		public void produceMessage(Session session) {
	 		
	 		JSONObject json = new JSONObject();
	 		json.put("job", session.getJob());
	 		json.put("username", session.getUsername());
	 		json.put("status", session.getStatus());
	 		json.put("station", session.getStation());
	 		
	
	 		kafkaTemplate.send("current-status", json.toJSONString());		
	 		
	 	}

		public Session getSessionData(String userName) {
			
			 List<Session> sessionList = sessionRepository.findByUsername(userName);
			 Session session;
			 if(sessionList.isEmpty()) {
				 session = new Session("NA","NA","NA","NA");
			
				 
			 }else {
				 
				 session = sessionList.get(0);
			 }
			
			return session;
		}
		
	        
	  }

