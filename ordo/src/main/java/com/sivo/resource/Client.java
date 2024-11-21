package com.sivo.resource;

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
import com.sivo.request.ClientRequest;

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
@Table(name = "Client")
public class Client {
	
	@Id
	@Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private long id;
	
	@Column( name = "name")
	private String name;
	
	@Column( name = "address")
	private String address;
	
	@Column( name = "email")
	private String email;
	
	@Column( name = "tel")
	private String tel;
	
	@JsonIgnore
	@ToString.Exclude
	@OneToMany(fetch = FetchType.LAZY,  mappedBy="client", cascade = CascadeType.ALL)
	private List<Job> jobList;
	
	
	public Client(ClientRequest clientRequest) {
		
		this.name = clientRequest.getName();
		this.address = clientRequest.getAddress();
		this.email = clientRequest.getEmail();
		this.tel = clientRequest.getTel();
	}

}
