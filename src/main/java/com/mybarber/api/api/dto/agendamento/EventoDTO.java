package com.mybarber.api.api.dto.agendamento;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class EventoDTO {

	private int id;
	private String title ;
	private String color;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime start;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime end;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public LocalDateTime getStart() {
		return start;
	}
	public void setStart(LocalDateTime start) {
		this.start = start;
	}
	public LocalDateTime getEnd() {
		return end;
	}
	public void setEnd(LocalDateTime end) {
		this.end = end;
	}
	public EventoDTO(int id, String title, String color, LocalDateTime start, LocalDateTime end) {
		super();
		this.id = id;
		this.title = title;
		this.color = color;
		this.start = start;
		this.end = end;
	}
	
	
	
}
