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

import com.sivo.request.ResourceRequest;
import com.sivo.resource.Resource;
import com.sivo.service.ResourceService;

@RestController
@RequestMapping("/resources")
public class ResourceController {

	@Autowired
	ResourceService resourceService;

	@GetMapping("/getAll")
	public ResponseEntity<List<Resource>> getAllResources() {
		
		return resourceService.getAllResources();
	}
	
	@GetMapping("/findById/{id}")
	public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
		
		return resourceService.getResourceById(id);
	}
	
	@PostMapping("/save")
	public  ResponseEntity<Resource> saveResource(@RequestBody ResourceRequest resourceRequest ) {
		
		return resourceService.saveResource(resourceRequest);
	}
	
	@PostMapping("/delete/{id}")
	public ResponseEntity<Resource> deleteResourceById(@PathVariable Long id){
		
		return resourceService.deleteResourceById(id);
	}
	
	@PostMapping("/updateById/{id}")
	public ResponseEntity<Resource> updateResourceById(@PathVariable Long id,@RequestBody ResourceRequest resourceRequest ){
		
		return resourceService.updateResourceById(id,resourceRequest);
	}
	
	
	
}
