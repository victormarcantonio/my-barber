$(document).ready(function ()
{
    waitingDialog.show('Carregando ...');
	var emailEdicao = null;
	var loginEdicao = null;

	$("#cep").mask("99999-999");

	$.ajax(
			{
				type: "GET",
				url: "api/usuarios/funcionario",
				cache: false,
				async:false,
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
			    },
				error: function error(data)
				{	
					waitingDialog.hide();
				    if(data.status == 400){
						lancarToastr("error",`${data.responseJSON.titulo}`);
					}else{
						lancarToastr("error",`${data.responseJSON.error_description}`);
					}

				},
				success: function (data)
				{
					console.log(data)
					
					$("#titulo-nome").text(data.nome);
					$("#titulo-cargo").text(data.cargo);
					
					
					$("#nome").val(data.nome);
					$("#sobrenome").val(data.sobrenome);
					$("#telefone").val(data.telefone);
					if(data.dataNascimento){
					  	let dataNascimento = `${data.dataNascimento[0]}-${("0"+data.dataNascimento[1]).slice(-2)}-${ ("0"+data.dataNascimento[2]).slice(-2) }`;

                        $("#dataNascimento").val(dataNascimento);
					}

					
					if(data.endereco){
						$("#logradouro").val(data.endereco.logradouro);
						$("#bairro").val(data.endereco.bairro);
						$("#numero").val(data.endereco.numero);
						$("#cep").val(data.endereco.cep);
						$("#cidade").val(data.endereco.cep);
						$("#uf").val(data.endereco.uf);
					}
					if(data.usuario){
						
						$("#login").val(data.usuario.login);
						loginEdicao = data.usuario.login;
						$("#email").val(data.usuario.email);
						emailEdicao = data.usuario.email;
						console.log(emailEdicao)
					}

					waitingDialog.hide();
				}
			});
	
			$("#alterar-senha").on("change",function(){
    	
				if($(this).is(":checked")){
					$(".row-senha").show();
					
				}else{
					$("#cliente").val('');
					$(".row-senha").hide();
				}
				
			});

            viaCep();
			validarForm();
	
});


function viaCep(){

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
						$('#form-perfil').validate().element("#logradouro");
						$('#form-perfil').validate().element("#bairro");
						$('#form-perfil').validate().element("#cidade");
						$('#form-perfil').validate().element("#uf");
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

}

function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#logradouro").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#uf").val("");
}

function enviarForm()
{

	let senha = null ;

	if($("#alterar-senha").is(":checked")){
		console.log($("#senha").val())
		senha = $("#senha").val();
	}

	console.log(senha)

       
	var sendInfo = {

			nome : $("#nome").val(),
			sobrenome : $("#sobrenome").val(),
			telefone : $("#telefone").val(),
			dataNascimento: $("#dataNascimento").val(),
			endereco : {logradouro: $("#logradouro").val(), bairro: $("#bairro").val(), numero: $("#numero").val(), cep: $("#cep").val(), cidade:  $("#cidade").val(), uf: $("#uf").val()},
			usuario : {email : $("#email").val(),login : $("#login").val(), senha : senha }
	}
	
	console.log(sendInfo);

	waitingDialog.show('Salvando ...');
	$.ajax(
	{
		type : 'PUT',
		url: `api/usuarios/editar-pessoa`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(sendInfo),
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			console.log(data)
			waitingDialog.hide();
			if(data.status == 400){
				lancarToastr("error",`${data.responseJSON.message}`);
			}else{
				lancarToastr("error",`Erro ao atualizar informações`);
			}

		},
		//dataType: 'json',
		success: function success(data)
		{
			
			
			lancarToastr("success",`Dados alterados com sucesso.`,true);

			if(senha!=null){
			  sessionStorage.clear();
			  window.location.href = "/";
			}

		}
	});
}




function validarForm()
{
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
	

	
	$("#form-perfil").validate(
	{
		// Rules for form validation
		rules:
		{
			nome:
			{
				required: true
			},
			email : {
				required: true
			},
			login:
			{
				required: true
			},
			senha:
			{
				required: true
			},
			senha2 : {
				required: true,
				equalTo : "#senha"
			}
		},
		messages : {
			nome:
			{
				required: "Campo obrigatório"
			},
			email:
			{
				required: "Campo obrigatório"
			},
			login:
			{
				required: "Campo obrigatório"
			},
			senha:
			{
				required: "Campo obrigatório"
			},
			senha2 : {
				required: "Campo obrigatório"
			}
			
		},
		submitHandler: function submitHandler(form)
		{
			enviarForm();

		}
	});
}


function verificarEmail(){
	
	var existe;
	let email = $('#email').val();
	
	
		
	if(email == emailEdicao || email == "") return false;
		$.ajax(
				
				{
					type: 'GET',
					url: `api/usuarios/verificarEmail/${email}`,
					contentType: "application/json; charset=utf-8",
					async:false,
					error: function error(data)
					{
						
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

function verificarUsuario(){
	
	var existe;
	let login = $('#login').val();
	
	
		
		if(login == loginEdicao) return false;
		
		$.ajax(
				
				{
					type: 'GET',
					url: `api/usuarios/verificarUsuario/${login}`,
					contentType: "application/json; charset=utf-8",
					async:false,
					error: function error(data)
					{
						
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

function verificarEmail(){
	
	
	
	var existe;
	let email = $('#email').val();
	

	console.log(emailEdicao)
		
		if(email == emailEdicao) return false;
		$.ajax(
				
				{
					type: 'GET',
					url: `api/usuarios/verificarEmail/${email}`,
					contentType: "application/json; charset=utf-8",
					async:false,
					error: function error(data)
					{
						
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
