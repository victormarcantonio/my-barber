$(document).ready(function() 
{
	
	
	$('.flip').on('click', function() {

		if ($('.login-box').hasClass('box-error')) {
			$('.login-box').removeClass('box-error');
			localStorage.setItem('classe', 'box-error');

		} else if ($('.login-box').hasClass('box-logout')) {
			$('.login-box').removeClass('box-logout');
			localStorage.setItem('classe', 'box-logout');
		} else {
			localStorage.removeItem('classe')
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
	return verificarEmailFuncionario()||verificarEmailCliente();
	
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
						login()

        			}
        		});

}

function verificarEmailFuncionario(){
	
	var existe;
	let email = $('#email').val();
	$.ajax(
			
			{
				type: 'GET',
				url: `funcionarios/verificarEmail/${email}`,
				contentType: "application/json; charset=utf-8",
				async:false,
				error: function error(data)
				{
					console.log(data)
					lancarToastr("error",data);

				},
				//dataType: 'json',
				success: function success(data)
				{
					
					existe = data;
				}
			});
	
	return existe;
	
}

function verificarEmailCliente(){
	
	var existe;
	let email = $('#email').val();
	$.ajax(
			
			{
				type: 'GET',
				url: `api/clientes/verificarEmail/${email}`,
				contentType: "application/json; charset=utf-8",
				async:false,
				error: function error(data)
				{
					console.log(data)
					lancarToastr("error",data);

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
	
	$('.modal-loading').modal('show');
	
     $.ajax(
			
			{
				type: 'GET',
				url: `api/usuarios/esqueceu-senha/${email}`,
				contentType: "application/json; charset=utf-8",
				error: function error(data)
				{
					console.log(data);

				},
				//dataType: 'json',
				success: function success(data)
				{
					
					$('#form-esqueci-senha')[0].reset();
					$('.modal-loading').modal('hide');
					$(".flipped").addClass("box-esqueci-senha");
					var alert = $( "#form-esqueci-senha" ).find( "div.alert");
					alert.show();
					$(alert).find('strong').text(email);
					$("#form-esqueci-senha").find('.is-valid').removeClass("is-valid");
				}
			});
}

function login(){

	$.ajax(
			
		{
			type: 'POST',
			url: 'http://192.168.0.107:8080/oauth/token',
			data: `username=${$("#login").val()}&password=${$("#senha").val()}&grant_type=password`,
			beforeSend:function(request){
				request.setRequestHeader('Authorization', `Basic ${btoa("servidorAuthMyBarber:123")}`)
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
			},
			error: function error(data)
			{

				console.log(data);

			},
			//dataType: 'json',
			success: function success(data)
			{
				
				console.log(data)
			}
		});
	
}
