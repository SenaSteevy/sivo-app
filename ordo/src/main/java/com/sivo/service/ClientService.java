package com.sivo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.repository.ClientRepository;
import com.sivo.request.ClientRequest;
import com.sivo.resource.Client;

@Service
public class ClientService {
	
	@Autowired
	ClientRepository clientRepository;

	public ResponseEntity<List<Client>> getAllClients() {
		
		List<Client> clients = clientRepository.findAll();
		return ResponseEntity.ok(clients);
	}

	public ResponseEntity<Client> getClientById(Long id) {
		
		Optional<Client> client = clientRepository.findById(id);
		if(client.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(client.get());
	}

	public ResponseEntity<Client> saveClient(ClientRequest clientRequest) {
		
		Client client = new Client(clientRequest);
		client = clientRepository.save(client);
		
		return ResponseEntity.ok(client);
	}

	public ResponseEntity<Client> deleteClientById(Long id) {
		
		Optional<Client> client = clientRepository.findById(id);
		if(client.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		clientRepository.deleteById(id);
		return ResponseEntity.ok().build();
		
		
	}

	public ResponseEntity<Client> updateClientById(Long id, ClientRequest clientRequest) {
		
		Optional<Client> client = clientRepository.findById(id);
		if(client.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Client updatedClient = new Client(clientRequest);
		updatedClient.setId(id);
		updatedClient = clientRepository.save(updatedClient);
		
		return ResponseEntity.ok( updatedClient);
		
	}

}
