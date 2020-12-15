/*
 * package com.mybarber.api.core.springsecurity;
 * 
 * 
 * import
 * org.springframework.security.config.annotation.web.builders.HttpSecurity;
 * import org.springframework.security.config.annotation.web.configuration.
 * EnableWebSecurity; import
 * org.springframework.security.config.annotation.web.configuration.
 * WebSecurityConfigurerAdapter;
 * 
 * @EnableWebSecurity public class SecurityWebConfig extends
 * WebSecurityConfigurerAdapter {
 * 
 * @Override protected void configure(HttpSecurity http) throws Exception {
 * 
 * http .authorizeRequests() .anyRequest().authenticated() .and() .formLogin()
 * .loginPage("/login").permitAll() //fazer pagina de login
 * .defaultSuccessUrl("/") .and() .logout().permitAll() ; // tira o token do
 * json, depois ver isso }
 * 
 * }
 */