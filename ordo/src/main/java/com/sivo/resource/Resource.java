package com.sivo.resource;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sivo.domain.Job;
import com.sivo.request.ResourceRequest;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Include;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString

@Entity
@Table(name = "Resource")
public class Resource {

	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@Column( name = "name")
	private String name;
	
	@Column( name = "type")
	private String type;
	
	@Column( name = "createdAt")
	private LocalDateTime createdAt;
	
	@Column( name = "quantity")
	private int quantity;
	
	@JsonIgnore
	@ToString.Exclude
	@OneToMany(fetch = FetchType.LAZY,  mappedBy="resource", cascade = CascadeType.ALL)
	private List<Job> jobList;
	
	
	public Resource(ResourceRequest resourceRequest) {
		this.name = resourceRequest.getName();
		this.type = resourceRequest.getType();
		this.quantity = resourceRequest.getQuantity();
		this.createdAt = LocalDateTime.now();
	}


	public Resource(String string, String string2, int quantity) {
		
		this.name = string;
		this.type = string2;
		this.quantity = quantity;
		this.createdAt = LocalDateTime.now();
	}
}


