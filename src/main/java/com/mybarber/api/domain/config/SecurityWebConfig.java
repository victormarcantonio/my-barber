//
//  package com.mybarber.api.domain.config;
//  
//  import javax.sql.DataSource;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import
//  org.springframework.security.config.annotation.web.builders.HttpSecurity;
//  import org.springframework.security.config.annotation.web.configuration.
//  EnableWebSecurity; import
//  org.springframework.security.config.annotation.web.configuration.
//  WebSecurityConfigurerAdapter;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//  
//  @EnableWebSecurity
//  public class SecurityWebConfig extends WebSecurityConfigurerAdapter {
//
//  	@Autowired
//  	private DataSource dataSource;
//  	
//  	private static final String USUARIO_POR_LOGIN = "select login, senha, ativo from usuario"
//  			+ " WHERE login = ?";
//  	
//  	private static final String PERMISSOES_POR_USUARIO = "select u.login, per.descricao from usuario_perfil up"
//  			+ " join usuario u on up.id_usuario = u.id"
//  			+ " join perfil p on up.id_perfil = p.id"
//  			+ " join perfil_permissao pp on pp.id_perfil = p.id"
//  			+ " join permissao per on pp.id_permissao = per.id"
//  			+ " where u.login = ?";
//  	
//  	/*
//  	  private static final String PERMISSOES_POR_PERFIL = "SELECT p.id, p.descricao, per.descricao FROM perfil_permissao pp"
//  	            + " JOIN perfil  p ON p.id = pp.id_perfil"
//  	            + " JOIN permissao per ON per.id = pp.id_permissao"
//  	            + " JOIN usuario_perfil up ON up.id_perfil = p.id"
//  	            + " JOIN usuario u ON u.id = up.id_usuario"
//  	            + " WHERE u.login = ?";*/
//  	
//  	
//  	@Autowired
//  	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
//
//  		auth.jdbcAuthentication().dataSource(dataSource).passwordEncoder(new BCryptPasswordEncoder())
//  				.usersByUsernameQuery(USUARIO_POR_LOGIN)
//  				.authoritiesByUsernameQuery(PERMISSOES_POR_USUARIO)
//  				.rolePrefix("ROLE_"); 
//  	}
//  	
//  	@Override
//  	  protected void configure(HttpSecurity http) throws Exception {
//  	    http
//  	        .authorizeRequests()
//  	        .antMatchers("/css/**", "/js/**", "/imagens/**","/pluginsAdd/**","/compiler/**","/img/**","/resources/**", "/webjars/**",
//  	        		"/api/usuarios/verificarUsuario/{login}",
//  	        		"/resetar-senha",
//  	        		"/registro",
//  	        		"/resources/template/AdminLTE**",
//  	        		"/funcionarios/verificarEmail/{email}",
//  	        		"/api/clientes/verificarEmail/{email}",
//  	        		"/api/usuarios/esqueceu-senha/{email}",
//  	        		"/api/usuarios/verificarUsuario/{login}",
//  	        		"/api/usuarios/buscar-token/{token}",
//  	        		"/api/usuarios/alterar-senha",
//  	        		"/login",
//  	        		"email/redefinir-senha**",
//  	        		"email/ativar-conta**",
//  	        		"/funcionarios/salvar-primeiro-funcionario").permitAll()
//  	        .antMatchers("/api/servicos/cadastrar").hasRole("CADASTRAR_SERVICO")
//  	        .antMatchers("/api/servicos/listar").hasRole("LISTAR_SERVICO")
//  	        .antMatchers("/api/servicos/editar/{id}").hasRole("EDITAR_SERVICO")
//  	        .antMatchers("/api/servicos/excluir/{id}").hasRole("EXCLUIR_SERVICO")
//  		    /*.antMatchers("/funcionarios/cadastrar").hasRole("ADMINISTRADOR")
//  	        .antMatchers("/servicos/listar").hasAnyRole("COMUM","ADMINISTRADOR")
//  	        .antMatchers("/funcionarios/listar").hasAnyRole("COMUM","ADMINISTRADOR")
//  	        .antMatchers("/servicos/editar/{id}").hasRole("ADMINISTRADOR")
//  	        .antMatchers("/funcionarios/editar/{id}").hasRole("ADMINISTRADOR")
//  	        .antMatchers("/servicos/editar").hasRole("ADMINISTRADOR")
//  	        .antMatchers("/funcionarios/editar").hasRole("ADMINISTRADOR")
//  	        .antMatchers("/funcionarios/excluir/{id}").hasRole("ADMINISTRADOR")*/
//  	        .anyRequest().authenticated()
//  	        .and()
//  	        .formLogin()
//  				.loginPage("/login").permitAll()  //fazer pagina de login
//  	        .defaultSuccessUrl("/")
//  	        .and()
//  	        .logout().permitAll()
//  	        .and()
//  	        .csrf().ignoringAntMatchers("/h2-console/**")
//  	        .and()
//  	        .headers().frameOptions().sameOrigin()
//  	        .and()
//  	        .csrf().disable().cors(); // tira o token do json, depois ver isso
//  	       
//  	  }
//  	
//  	@Bean
//      public BCryptPasswordEncoder passwordEncoder() {
//          BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
//          return bCryptPasswordEncoder;
//      }
//  }
//
// 