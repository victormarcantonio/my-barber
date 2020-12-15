package com.mybarber.api.api.controller;


import java.security.Principal;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
public class HtmlController {


	
	@GetMapping("/")
	public String index(HttpServletRequest request,Principal principal){
		return "fragments/dashboard";
	}
	
	@GetMapping("/senha-redefinida")
	public String  senhaRedefinida(ModelMap model){

		return "login/login";
		
	}
	
	@GetMapping("/teste")
	public String teste() {
		return "email/teste";
	}
	
	
	@GetMapping("/servicos")
	public String servicos(){
		return "servico/servico";
	}
	
	@GetMapping("/funcionarios")
	public String funcionario() {
		return "funcionario/funcionario";
	}

	@GetMapping("/login")
	public String login() {
		
		return "login/login";
	}
	
	
	
	@GetMapping("/agenda")
	public String agenda() {
		return "agendamento/agenda";
	}
	
	@GetMapping("/usuarios/reset")
	public String senha() {
		return "senha/reset-password";
	}
	
	@GetMapping("/clientes")
	public String clientes() {
		return "cliente/cliente";
	}
	
	@GetMapping("/barbearia")
	public String barbearia() {
		return "barbearia/barbearia";
	}
	
	@GetMapping("/registro")
	public String registro() {
		return"registro/registro";
	}
	
	@GetMapping("relatorioMensal")
	public String mensal() {
		return "relatorio/barGraph";
	}

	
	@GetMapping("resetar-senha")
	public String resetarSenha() {
		
		
		return "senha/resetar-senha";
	}
	
	@GetMapping("ativar-conta")
	public String ativarConta() {
		return "senha/resetar-senha";
	}
	
	@GetMapping("horario-atendimento")
	public String horararioAtendimento() {
		return "horarioatendimento/horario-atendimento";
	}

	@GetMapping("perfil")
	public String perfil() {
		return "perfil/perfil";
	}
}
