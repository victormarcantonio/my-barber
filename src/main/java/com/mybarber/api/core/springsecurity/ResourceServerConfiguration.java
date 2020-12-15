package com.mybarber.api.core.springsecurity;

import org.apache.commons.io.IOUtils;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.CharacterEncodingFilter;


import java.io.IOException;

import static java.nio.charset.StandardCharsets.UTF_8;

@Configuration
@EnableResourceServer
@EnableConfigurationProperties(SecurityProperties.class)
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {

    //private static final String ROOT_PATTERN = "/**";

    private final SecurityProperties securityProperties;

    private TokenStore tokenStore;

    public ResourceServerConfiguration(final SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    @Override
    public void configure(final ResourceServerSecurityConfigurer resources) {
        resources.tokenStore(tokenStore());
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
    	CharacterEncodingFilter filter = new CharacterEncodingFilter(); 
    	filter.setEncoding("UTF-8"); filter.setForceEncoding(true);
    	http.addFilterBefore(filter, CsrfFilter.class);
    	
    	 http
	        .authorizeRequests()
	        .antMatchers("/css/**", "/js/**", "/imagens/**","/pluginsAdd/**","/compiler/**","/img/**","/resources/**", "/webjars/**",
	        		"/api/usuarios/verificarUsuario/{login}",
	        		"/api/usuarios/verificarEmail/{email}",
	        		"/resetar-senha",
	        		"/registro",
	        		"/resources/template/AdminLTE**",
	        		"/funcionarios/verificarEmail/{email}",
	        		"/api/clientes/verificarEmail/{email}",
	        		"/api/usuarios/esqueceu-senha/{email}",
	        		"/api/usuarios/verificarUsuario/{login}",
	        		"/api/usuarios/buscar-token/{token}",
	        		"/api/usuarios/alterar-senha",
	        		"/login",
	        		"/redefinir-senha**",
	        		"/ativar-conta**",
	        		"/api/funcionarios/cadastro-primeiro-funcionario",
	        		"/servicos",
                    "/funcionarios",
                    "/clientes",
                    "/agenda",
                    "/barbearia",
                    "/usuarios/reset",
                    "/horario-atendimento",
                    "/perfil",
                    "/teste",
                    "/",
                    "/api/agendamentos/listarFullCalendar/{idBarbeiro}").permitAll()
	        .antMatchers("/thymeleaf/").hasRole("LISTAR_SERVICO")
	        .anyRequest().authenticated(); // tira o token do json, depois ver isso
	        
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }

    @Bean
    public DefaultTokenServices tokenServices(final TokenStore tokenStore) {
        DefaultTokenServices tokenServices = new DefaultTokenServices();
        tokenServices.setTokenStore(tokenStore);
        return tokenServices;
    }

    @Bean
    public TokenStore tokenStore() {
        if (tokenStore == null) {
            tokenStore = new JwtTokenStore(jwtAccessTokenConverter());
        }
        return tokenStore;
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setVerifierKey(getPublicKeyAsString());
        return converter;
    }

    private String getPublicKeyAsString() {
        try {
            return IOUtils.toString(securityProperties.getJwt().getPublicKey().getInputStream(), UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    
 

}
