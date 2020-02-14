package com.session.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.session.entity.Session;


@Repository
public interface SessionRepository extends JpaRepository<Session, Long>{

	List<Session> findByUsername(String string);
	
	
	

}
