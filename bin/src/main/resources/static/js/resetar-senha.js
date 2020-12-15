$(document).ready(function() 
{
	
	var urlParams = new URLSearchParams(window.location.search);
	
	
	if(urlParams.has('token')){
		var token = urlParams.get('token');
		var ativar = urlParams.get('ativacao');
		
		$.ajax(
				
				{
					type: 'GET',
					url: `api/usuarios/buscar-token/${token}`,
					contentType: "application/json; charset=utf-8",
					error: function error(data)
					{
						console.log($("#form-resetar")
						.find('div.alert')
						.addClass('alert-danger'))
						$("#form-resetar")
						.find('div.alert')
						.addClass('alert-danger')
						.text(`${data.responseJSON.message}`)
						.show();
						$(".box-resetar").css("min-height","160px");
						$('.form').hide();

					},
					//dataType: 'json',
					success: function success(data)
					{
						console.log(data)
						
							if(data.usuario.ativo && !urlParams.has('ativacao')){
								$("#form-resetar")
								.find('h4.user-name').append(data.usuario.login);
								
								$('.btn-resetar').attr('idUsuario',data.usuario.id);
							}else if(!data.usuario.ativo && urlParams.has('ativacao')){
								
								$("#form-resetar")
								.find('h4.user-name').append(data.usuario.login);
								$(".text-muted").text("Ativar conta");
								$('.btn-resetar').attr('idUsuario',data.usuario.id);
								
							}else if(!data.usuario.ativo && urlParams.has('ativacao')){
								$("#form-resetar")
								.find('div.alert')
								.addClass('alert-danger')
								.text(`Usuário já ativado.`)
								.show();
								$(".box-resetar").css("min-height","140px");
								$('.form').hide();
							}else if (!data.usuario.ativo && !urlParams.has('ativacao')){
								
								$("#form-resetar")
								.find('div.alert')
								.addClass('alert-danger')
								.text(`Usuário desativado.`)
								.show();
								$(".box-resetar").css("min-height","140px");
								$('.form').hide();
							}
					}
				});
		
	}else{
		
		$("#form-resetar")
		.find('div.alert')
		.addClass('alert-danger')
		.text(`Você não pode acessar esta página sem ser a partir de um e-mail de redefinição de senha. 
		Se você a acessou através de um e-mail de redefinição de senha, certifique-se de utilizar o endereço completo da URL fornecida.`)
		.show();
		
		$('.form').hide();
		
		$(".box-resetar").css("min-height","280px");
		
	}
	
	
	validarForm();
	mostrarSenha()
});


function validarForm(){
	
	errorElement: 'span',
	jQuery.validator.setDefaults({
	    errorPlacement: function (error, element) {
	        error.addClass('invalid-feedback');
	        element.closest('.form-group').append(error);
	    },
	    highlight: function (element, errorClass, validClass) {
	        $(element).addClass('is-invalid');
	        $(element).removeClass('is-valid');
	    },
	    unhighlight: function (element, errorClass, validClass) {
	        $(element).removeClass('is-invalid');
	        $(element).addClass('is-valid');
	    }
	});


$("#form-resetar").validate(
		{
			// Rules for form validation
			rules:
			{
				senha : {
					required: true,
                    minlength : 5
                },
                confirm : {
                	required: true,
                    minlength : 5,
                    equalTo : "#senha"
                }
			},messages :
			{
				senha:
				{
					required: 'Campo obrigatório.',
	                minlength : 'Minímo de 5 caracteres.'
				},
				confirm:
				{
					required: 'Campo obrigatório.',
	                minlength : 'Minímo de 5 caracteres.',
	                equalTo : 'Senha de confirmação não confere.'
				}
			},
			submitHandler: function submitHandler()
			{
				enviarForm();
			}
		});

}


function mostrarSenha(){
	
	  $(".mostrar-senha").on('click', function(event) {
	        event.preventDefault();
	        let input =  $(this).parent().parent().find('input');
	        let i = $(this).children();
	        let button = this;
	        
	        if($(input).attr("type") == "text"){
	        	$(button).prop('title',"Mostrar senha");
	            $(input).attr('type', 'password');
	            $(i).removeClass( "fa-eye-slash" );
	            $(i).addClass( "fa-eye" );
	        }else if($(input).attr("type") == "password"){
	        	$(button).prop('title',"Ocultar senha");
	            $(input).attr('type', 'text');
	            $(i).addClass( "fa-eye-slash");
	            $(i).removeClass("fa-eye");
	        }
	    });
}


function enviarForm(){
	
	
	
	if($('.btn-resetar').attr('idUsuario')){
		
		var usuario  = { id : $('.btn-resetar').attr('idUsuario'), senha : $('#senha').val() };
		
		$.ajax(
				{
					type: 'POST',
					url: `api/usuarios/alterar-senha`,
					contentType: "application/json; charset=utf-8",
					data: JSON.stringify(usuario),
					error: function error(data)
					{
						

					},
					//dataType: 'json',
					success: function success(data)
					{
						$('#form-resetar')[0].reset();
						$('.btn-resetar').removeAttr('idUsuario');
						$("#form-resetar").find('.is-valid').removeClass("is-valid");
						var urlParams = new URLSearchParams(window.location.search);
						if(urlParams.has('ativacao')){
							window.location.href = "/login?ativacao";
						}else{
							window.location.href = "/login?senha";
						}
	
					}
				});
		
		
	}else {
		console.log('aqui')
		$("#form-resetar")
		.find('div.alert')
		.addClass('alert-danger')
		.text(`Senha já alterada.`)
		.show();
	}
	
}
