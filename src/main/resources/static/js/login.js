$(document).ready(function() 
{
	
	var urlParams = new URLSearchParams(window.location.search);
	
	if(urlParams.has('ativacao')){
		
		$('.login-box').addClass('box-logout');
		$("#alert-sucesso").show().text('Conta ativada com sucesso.');
	}else if(urlParams.has('logout')){
		$("#alert-sucesso").show().text('Você foi desconectado.');
		$('.login-box').addClass('box-logout');
	}else if(urlParams.has('senha')){
		$("#alert-sucesso").show().text('Senha alterada com sucesso.');
		$('.login-box').addClass('box-logout');
	}else{
		$("#alert-sucesso").hide();
		$('.login-box').removeClass('box-logout');
	}
	
	$('.flip').on('click', function() {

		if ($('.login-box').hasClass('box-error')) {
			$('.login-box').removeClass('box-error');
			$("#alert-erro").hide();
			
		} else if ($('.login-box').hasClass('box-logout')) {
			$('.login-box').removeClass('box-logout');
			$("#alert-sucesso").hide();
		}

	});

	$('.voltar-login').on('click', function() {

		if (localStorage.getItem('classe')) {

			$('.login-box').addClass(localStorage.getItem('classe'));

		}
	});
	
	$('.login-content [data-toggle="flip"]').click(function () {
		
        $(".login-box").toggleClass("flipped");
        $(".login-box").removeClass("box-esqueci-senha");
        $("#form-esqueci-senha").find('.is-invalid').removeClass("is-invalid");
        var alert = $( "#form-esqueci-senha" ).find( "div.alert");
		alert.hide();
        return false;
    });
	
	
	validarForm();
	
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

  jQuery.validator.addMethod("verificarEmail", function(value, element,parametros) {
	return verificarEmail();
	
   },'e-mail não cadastrado.');
  


   $("#form-esqueci-senha").validate(
		{
			// Rules for form validation
			rules:
			{
				email:
				{
					required: true,
					verificarEmail: true
				}
			},
			submitHandler: function submitHandler()
			{

				
				enviarForm();

			}
		});

		$("#form-login").validate(
        		{
        			// Rules for form validation
        			rules:
        			{
        				login:
        				{
        					required: true
        				},
        				senha :
        				{
        				    required: true
        				}
        			},
        			submitHandler: function submitHandler()
        			{
						login();

        			}
        		});

}

function verificarEmail(){
	
	
	var existe;
	let email = $('#email').val();
	
		$.ajax(
				
				{
					type: 'GET',
					url: `api/usuarios/verificarEmail/${email}`,
					contentType: "application/json; charset=utf-8",
					async:false,
					error: function error(data)
					{
						console.log(data);

					},
					//dataType: 'json',
					success: function success(data)
					{
						
						
						existe = data;
					}
				});
		
		return existe;
	
	
}

function enviarForm(){
	
	let email = $('#email').val();
	
	waitingDialog.show('Enviando e-mail ...');
	
     $.ajax(
			
			{
				type: 'GET',
				url: `api/usuarios/esqueceu-senha/${email}`,
				contentType: "application/json; charset=utf-8",
				error: function error(data)
				{
					waitingDialog.hide();
					lancarToastr("error",data.responseJSON.message);
					console.log(data);

				},
				//dataType: 'json',
				success: function success(data)
				{
					
					$('#form-esqueci-senha')[0].reset();
					waitingDialog.hide();
					lancarToastr("success",`Link de alteração de senha enviado para o e-mail ${email}`);
					$("#form-esqueci-senha").find('.is-valid').removeClass("is-valid");
				}
			});
}

function login(){

	$.ajax(
			
		{
			type: 'POST',
			url: 'http://localhost:8080/oauth/token',
			data: `username=${$("#login").val()}&password=${$("#senha").val()}&grant_type=password`,
			beforeSend:function(request){
				request.setRequestHeader('Authorization', `Basic ${btoa("servidorAuthMyBarber:123")}`)
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			},
			error: function error(data)
			{
				$('.login-box').addClass('box-error');
				$("#alert-erro").hide();
				$("#alert-sucesso").hide();
				$("#alert-erro").show().text(data.responseJSON.error_description);

			},
			//dataType: 'json',
			success: function success(data)
			{
				$('.login-box').removeClass('box-error');
				$("#alert-erro").hide();
				$("#alert-erro").hide();
				
				//localStorage.checkBoxValidation =  $('#lembrar').is(":checked");
				sessionStorage.setItem('accessToken', data.access_token);
				sessionStorage.setItem('refreshToken', data.refresh_token);
				window.location.href = "/"; //fazer redirect uri no servidor de autenticação
			}
		});
	
}

function lancarToastr(acao,mensagem,reload=false){
	
	toastr.options = {
				"closeButton": true,
				"debug": false,
				"newestOnTop": true,
				"progressBar": true,
				"positionClass": "toast-top-right",
				"preventDuplicates": true,
				"onclick": null,
				"showDuration": "300",
				"hideDuration": "300",
				"timeOut": "2000",
				"extendedTimeOut": "3000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut",
				"onHidden": function ()
  				{
  					if(reload)window.location.reload();
  				}
			}
			toastr[acao](mensagem);
}
