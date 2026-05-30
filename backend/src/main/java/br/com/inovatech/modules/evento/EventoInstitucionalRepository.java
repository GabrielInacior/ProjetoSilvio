package br.com.inovatech.modules.evento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoInstitucionalRepository extends JpaRepository<EventoInstitucional, Long> {

    @Query("SELECT e FROM EventoInstitucional e WHERE e.publico = true AND e.dataInicio >= :from ORDER BY e.dataInicio")
    List<EventoInstitucional> findProximosEventos(LocalDateTime from);

    @Query("SELECT e FROM EventoInstitucional e WHERE e.dataInicio BETWEEN :inicio AND :fim ORDER BY e.dataInicio")
    List<EventoInstitucional> findByPeriodo(LocalDateTime inicio, LocalDateTime fim);
}
