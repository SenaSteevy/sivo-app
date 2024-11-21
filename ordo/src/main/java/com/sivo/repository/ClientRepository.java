package com.sivo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sivo.resource.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

	
}
