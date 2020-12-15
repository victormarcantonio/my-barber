package com.mybarber.api.domain.entity;

import java.io.File;
import java.util.Map;

public class Email {

	private String de;
    private String para;
    private String assunto;
    private File anexo;
    private Map<String, Object> map;
    
	public String getDe() {
		return de;
	}
	public void setDe(String de) {
		this.de = de;
	}
	public String getPara() {
		return para;
	}
	public void setPara(String para) {
		this.para = para;
	}
	public String getAssunto() {
		return assunto;
	}
	public void setAssunto(String assunto) {
		this.assunto = assunto;
	}
	
	public File getAnexo() {
		return anexo;
	}
	public void setAnexo(File anexo) {
		this.anexo = anexo;
	}
	public Map<String, Object> getMap() {
		return map;
	}
	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	public Email() {
	}

}
