package com.sivo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sivo.resource.Timeslot;


@Repository
public interface TimeslotRepository extends JpaRepository<Timeslot, Long> {

	

}
