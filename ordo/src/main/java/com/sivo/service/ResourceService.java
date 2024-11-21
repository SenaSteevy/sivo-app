package com.sivo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.sivo.repository.ResourceRepository;
import com.sivo.request.ResourceRequest;
import com.sivo.resource.Resource;

@Service
public class ResourceService {
	
	@Autowired
	ResourceRepository resourceRepository;

	public ResponseEntity<List<Resource>> getAllResources() {
		
		List<Resource> resources = resourceRepository.findAll();
		return ResponseEntity.ok(resources);
	}

	public ResponseEntity<Resource> getResourceById(Long id) {
		
		Optional<Resource> resource = resourceRepository.findById(id);
		if(resource.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(resource.get());
	}

	public ResponseEntity<Resource> saveResource(ResourceRequest resourceRequest) {
		
		Resource resource = new Resource(resourceRequest);
		resource = resourceRepository.save(resource);
		
		return ResponseEntity.ok(resource);
	}

	public ResponseEntity<Resource> deleteResourceById(Long id) {
		
		Optional<Resource> resource = resourceRepository.findById(id);
		if(resource.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		resourceRepository.deleteById(id);
		return ResponseEntity.ok().build();
		
		
	}

	public ResponseEntity<Resource> updateResourceById(Long id, ResourceRequest resourceRequest) {
		
		Optional<Resource> resource = resourceRepository.findById(id);
		if(resource.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		Resource updatedResource = new Resource(resourceRequest);
		updatedResource.setId(id);
		updatedResource = resourceRepository.save(updatedResource);
		
		return ResponseEntity.ok(updatedResource);
		
	}

}
