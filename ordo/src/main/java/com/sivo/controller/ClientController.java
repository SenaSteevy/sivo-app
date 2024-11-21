package com.sivo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sivo.request.ClientRequest;
import com.sivo.resource.Client;
import com.sivo.service.ClientService;

@RestController
@RequestMapping("/clients")
public class ClientController {

	
	
	@Autowired
	ClientService clientService;

	@GetMapping("/getAll")
	public ResponseEntity<List<Client>> getAllClients() {
		
		return clientService.getAllClients();
	}
	
	@GetMapping("/findById/{id}")
	public ResponseEntity<Client> getClientById(@PathVariable Long id) {
		
		return clientService.getClientById(id);
	}
	
	@PostMapping("/new")
	public  ResponseEntity<Client> saveClient(@RequestBody ClientRequest clientRequest ) {
		
		return clientService.saveClient(clientRequest);
	}
	
	@PostMapping("/delete/{id}")
	public ResponseEntity<Client> deleteClientById(@PathVariable Long id){
		
		return clientService.deleteClientById(id);
	}
	
	@PostMapping("/updateById/{id}")
	public ResponseEntity<Client> updateClientById(@PathVariable Long id, @RequestBody ClientRequest clientRequest){
		
		return clientService.updateClientById(id, clientRequest);
	}
	
	
	
}
