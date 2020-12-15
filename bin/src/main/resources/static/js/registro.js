$(document).ready(function(){
	
var current_fs, next_fs, previous_fs; //fieldsets
var opacity;

$(".next").click(function(){

validarForm(this,true);


});

validarForm();


$(".previous").click(function(){

validarForm(this,false);
	

});

$('.radio-group .radio').click(function(){
$(this).parent().find('.radio').removeClass('selected');
$(this).addClass('selected');
});

$(".submit").click(function(){
return false;
})




});


function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#rua").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#uf").val("");
    $("#ibge").val("");
}

function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#logradouro").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#uf").val("");
}

$("#cep").mask("99999-999");

//Quando o campo cep perde o foco.
$(".btn-buscar").on('click',function() {
	
	

    //Nova variável "cep" somente com dígitos.
    var cep = $('#cep').val().replace(/\D/g, '');
     console.log(cep)
    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            $("#logradouro").val("...");
            $("#bairro").val("...");
            $("#cidade").val("...");
            $("#uf").val("...");

            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                if (!("erro" in dados)) {
                    //Atualiza os campos com os valores da consulta.
                    $("#logradouro").val(dados.logradouro);
                    $("#bairro").val(dados.bairro);
                    $("#cidade").val(dados.localidade);
                    $("#uf").val(dados.uf);
                    $('#msform').validate().element("#logradouro");
                    $('#msform').validate().element("#bairro");
                    $('#msform').validate().element("#cidade");
                    $('#msform').validate().element("#uf");
                } //end if.
                else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulário_cep();
                    alert("CEP não encontrado.");
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
    	alert("DIGITE UM CEP.");
        limpa_formulário_cep();
    }
});



function iniciarNovoCadastro()
{

		$(".action-button").removeAttr('data-id');
		$(".action-button").attr("acao", "salvar");
		
	
}

function validarForm(button,next)
{

	jQuery.validator.setDefaults({
		debug: true,
		success: "valid",
		errorElement: 'div',
	    errorPlacement: function (error, element) {
	        error.addClass('invalid-feedback');
	    	$(element).after(error);
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
	
	
	jQuery.validator.addMethod("verificarUsuario", function(value, element,parametros) {
		return !verificarUsuario();
		
	},'Nome de usuário já existente.');
	
	jQuery.validator.addMethod("verificarEmail", function(value, element,parametros) {
		return !verificarEmail();
		
	},'e-mail já cadastrado.');
	
	var form = $("#msform");
	
	
	form.validate(
	{
		rules:
		{
			nomeBarbearia:
			{
				required: true
			},
			telefone:
			{
				required: true
			},
			numero:
			{
				required: true
			},
			logradouro:
			{
				required: true
			},
			bairro:
			{
				required: true
			},
			cidade:
			{
				required: true
			},
			uf:
			{
				required: true
			},
			login:
			{   required: true,
				verificarUsuario: true
			},
			email:
			{   required: true,
				verificarEmail: true
			},
			nomeBarbeiro:
			{   required: true
			}
		},
		messages :
			{
			nomeBarbearia:
			{
				required: 'campo obrigatório'
			},
			telefone:
			{
				required: 'campo obrigatório'
			},
			numero:
			{
				required: 'campo obrigatório'
			},
			logradouro:
			{
				required: 'campo obrigatório'
			},
			bairro:
			{
				required: 'campo obrigatório'
			},
			cidade:
			{
				required: 'campo obrigatório'
			},
			uf:
			{
				required: 'campo obrigatório'
			},
			login:
			{
				required: 'campo obrigatório'
			},
			email:
			{
				required: 'campo obrigatório'
			},
			nomeBarbeiro:
			{   required: 'campo obrigatório'
			}
			},
		submitHandler: function submitHandler()
		{

			console.log('bla');
			//enviarForm($(".action-button").attr("acao"), $(".action-button").attr("data-id"))

		}
	});
	if(button || button){
	
	if (form.valid() && next){
		
	    if($(button).hasClass('concluir')){
	    	$('.modal-loading').modal('show');
	    	enviarForm(button);
	      
	    }else{
	    	
	    
		
		$('#msform').validate().destroy();
		current_fs = $(button).parent();
		next_fs = $(button).parent().next();

		//Add Class Active
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

		//show the next fieldset
		next_fs.show();
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
		step: function(now) {
		// for making fielset appear animation
		opacity = 1 - now;

		current_fs.css({
		'display': 'none',
		'position': 'relative'
		});
		next_fs.css({'opacity': opacity});
		},
		duration: 600
		});
	    }
		
	}else if(!next){
		
		$('#msform').validate().destroy();
		
		current_fs = $(button).parent();
		previous_fs = $(button).parent().prev();

		//Remove class active
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

		//show the previous fieldset
		previous_fs.show();

		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
		step: function(now) {
		// for making fielset appear animation
		opacity = 1 - now;

		current_fs.css({
		'display': 'none',
		'position': 'relative'
		});
		previous_fs.css({'opacity': opacity});
		},
		duration: 600
		});
		
	}
	
	}
}

function verificarUsuario(){
	
	var existe;
	let login = $('#login').val();
	$.ajax(
			
			{
				type: 'GET',
				url: `api/usuarios/verificarUsuario/${login}`,
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
					
					console.log(data)
					existe = data;
				}
			});
	
	return existe;
	
}

function verificarEmail(){
	
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

function enviarForm(button){
	
	
	
	
	

		var sendInfo = {
				nome : $("#nomeBarbeiro").val(),
				telefone : $("#telefone").val(),
				email : $("#email").val(),
				endereco : {logradouro: $("#rua").val(), bairro: $("#bairro").val(), numero: $("#numero").val(), cep: $("#cep").val(), cidade:  $("#cidade").val(), uf: $("#uf").val()},
				usuario:{login: $("#login").val(), senha:$("#senha").val(),perfil:{id:$("#perfilAcesso").val(),descricao:null}},
				barbearia:{nome: $("#barbearia").val(),endereco : {logradouro: $("#logradouro").val(), bairro: $("#bairro").val(), numero: $("#numero").val(), cep: $("#cep").val(), cidade:  $("#cidade").val(), uf: $("#uf").val()}}
				
		}
		
		
	
		$.ajax(
		{
			type: 'POST',
			url: `funcionarios/salvar-primeiro-funcionario`,
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(sendInfo),
			error: function error(data)
			{
				$('.modal-loading').modal('hide');
				toastr.options = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": true,
					"progressBar": true,
					"positionClass": "toast-top-right",
					"preventDuplicates": true,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "2000",
					"extendedTimeOut": "3000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
				}
				toastr["error"](`${data.responseText}`)

			},
			//dataType: 'json',
			success: function success(data)
			{
				$('.modal-loading').modal('hide');

				$('#msform').validate().destroy();
				current_fs = $(button).parent();
				next_fs = $(button).parent().next();

				//Add Class Active
				$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

				//show the next fieldset
				next_fs.show();
				//hide the current fieldset with style
				current_fs.animate({opacity: 0}, {
				step: function(now) {
				// for making fielset appear animation
				opacity = 1 - now;

				current_fs.css({
				'display': 'none',
				'position': 'relative'
				});
				next_fs.css({'opacity': opacity});
				},
				duration: 600
				});

			}
		});

}




