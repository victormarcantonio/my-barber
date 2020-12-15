$(document).ready(function ()
{
	$(".app-menu__item").removeClass('active')
	$(".app-menu__item.funcionarios").addClass('active')
	var emailEdicao;
	var loginEdicao;
	
	
	$(function () {
		  $('[data-toggle="popover"]').popover();
	});

	montarDataTable();

	var tabelaBody = $("#table-funcionarios > tbody");

	iniciarEdicao(tabelaBody);

	inciarExclusao(tabelaBody);

	validarForm();
	
	preencherComboPerfil();
	
	function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
        $("#ibge").val("");
    }
    
    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {

        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');

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
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });
    
    $(".btn-cancelar").on("click",function(){
    	$(".funcionario-form").slideUp('slow');
		$('.listagem').slideDown('slow');
		$('#form-funcionario').validate().resetForm();
		$("#form-funcionario").find('.is-valid').removeClass("is-valid");
	});

});


function enviarForm(acao, id)
{  
	
	
	var sendInfo = {
			id : id,
			nome : $("#nome").val(),
			sobrenome : $("#sobrenome").val(),
			telefone : $("#telefone").val(),
			dataNascimento: $("#dataNascimento").val(),
			cargo : $("#cargo").val(),
			usuario:{id: $("#login").attr('idUsuario'),
				     login: $("#login").val(),
				     idPerfil :$("#perfilAcesso").val(),
				     email : $("#email").val()},
			barbearia: {id:getIdBarbearia(getToken())},
			primeiroFuncionario : false
	}
	
	
	
	var verbo;
	
	if(acao=="cadastrar"){
		var verbo = "POST";
	}else{
		var verbo = "PUT";
	}

	waitingDialog.show('Salvando funcionário ...');
	$.ajax(
	{
		type: verbo,
		url: `api/funcionarios`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(sendInfo),
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			waitingDialog.hide();
			if(data.status == 400){
				lancarToastr("error",`${data.responseJSON.message}`);
			}else{
				lancarToastr("error",`${data.responseJSON.error_description}`);
			}
			
		},
		//dataType: 'json',
		success: function success(data)
		{
			
			lancarToastr("success",`Funcionário ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`,true);

		}
		
		
	});
}

function montarDataTable()
{
	
	waitingDialog.show('Carregando ...');
	
	
	var table = $('#table-funcionarios').DataTable(
	{
		
		responsive: true,
	    lengthChange: false,
		"processing": true,
		"ajax":
		{
			"url": `api/funcionarios/${getIdBarbearia(getToken())}`,
			'beforeSend': function (request) {
		        request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
			dataSrc: ''
		},
		"columns": [
		{
			"data" : "nome"
	    }, {
	        "data" : "telefone"
	    }, {
	        "data" : "usuario.email"
	    },
	    {
			'mRender': function (data, type, row)
			{
			
				return `<button type="button" class="btn btn-secondary btn-sm viewEndereco"
				                    tabindex="0" data-trigger="focus"
									data-container="body" data-toggle="popover" tabindex="0"
									data-placement="top"
									data-content="${
									row.endereco.cep+' - '+
									row.endereco.logradouro+','+
									row.endereco.numero+','+
									row.endereco.bairro+','+
									row.endereco.cidade+'-'+
									row.endereco.uf
									}">
									<span class="fa fa-eye" aria-hidden="true"></span>
								</button>`
			},
		},
	    {
			'mRender': function (data, type, row)
			{
				 return row.usuario.ativo ?  'Ativo' :  'Desativado'
			},
	    },
		{
			'mRender': function (data, type, row)
			{
				
				return `<a type="button" class="btn btn-secondary btn-editar btn-sm" data-id="${row.id}" data-toggle="modal" ><i class="fa fa-edit"></i></a>
            <a type="button" class="btn btn-danger btn-excluir btn-sm" data-toggle="modal" href="#modal-excluir" data-id="${row.id}" ><i class="fa fa-trash"></i></a>`
			},
		}],
		buttons: [ {
            text: 'Novo',
            className: 'btn-primary btn-novo',
            title: 'Clique para cadastrar um novo serviço',
            action: function ( e, dt, node, config ) {
            	emailEdicao = null;
            	loginEdicao = null;
            	$(".tile-title").text("Novo funcionário");
                $('.funcionario-form').slideDown('slow');
                $(".listagem").slideUp('slow');
                $(".btn-salvar").removeAttr('data-id');
                $("#login").prop( "disabled", false );
        		$(".btn-salvar").attr("acao", "cadastrar");
            }
        } ],

		"oLanguage":
		{
			"sEmptyTable": "Não foi encontrado nenhum registo",
			"sLoadingRecords": "A carregar...",
			"sProcessing": "A processar...",
			"sLengthMenu": "Mostrar _MENU_ registos",
			"sZeroRecords": "Não foram encontrados resultados",
			"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registos",
			"sInfoEmpty": "Mostrando de 0 até 0 de 0 registos",
			"sInfoFiltered": "(filtrado de _MAX_ registos no total)",
			"sInfoPostFix": "",
			"sSearch": "Procurar:",
			"sUrl": "",
			"oPaginate":
			{
				"sFirst": "Primeiro",
				"sPrevious": "Anterior",
				"sNext": "Seguinte",
				"sLast": "Último"
			},
			"oAria":
			{
				"sSortAscending": ": Ordenar colunas de forma ascendente",
				"sSortDescending": ": Ordenar colunas de forma descendente"
			}
		},
		"fnDrawCallback": function(oSettings){
			waitingDialog.hide();
        },
		initComplete : function(){
			table.buttons().container().appendTo( '#table-funcionarios_wrapper .col-md-6:eq(0)' );
			$('.btn-novo').removeClass('btn-secondary');
			
		}
		
	});
	
	
	$(function () {
		  $('[data-toggle="popover"]').popover();
	});
	
	
}



function iniciarEdicao(tabelaBody)
{
	tabelaBody.on("click", "a.btn-editar", function (e)
	{    
		$('.funcionario-form').slideDown('slow');
        $(".listagem").slideUp('slow');
		$('#form-funcionario')[0].reset();
		$(".btn-salvar").attr("acao", "editar");
		$(".btn-salvar").attr("data-id", $(this).attr('data-id'));
		
		$.ajax(
				{
					type: "PATCH",
					url: "api/funcionarios/" + $(this).attr('data-id'),
					cache: false,
					beforeSend: function (request) {
						request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
				    },
					error: function error(data)
					{
						lancarToastr("error",`${data.responseText}`);

					},
					success: function (data)
					{
						
						$(".tile-title").text("Editar funcionário");
						$("#nome").val(data.nome);
						$("#sobrenome").val(data.sobrenome);
						$("#telefone").val(data.telefone);
						
						$("#dataNascimento").val(data.dataNascimento);
						
						if(data.endereco){
							$("#logradouro").val(data.endereco.logradouro);
							$("#bairro").val(data.endereco.bairro);
							$("#numero").val(data.endereco.numero);
							$("#cep").val(data.endereco.cep);
							$("#cidade").val(data.endereco.cep);
							$("#uf").val(data.endereco.uf);
						}
						$("#cargo").val(data.cargo);
						if(data.usuario){
							
							$("#login").val(data.usuario.login).prop( "disabled", true ).attr("idUsuario", data.usuario.id);
							loginEdicao = data.usuario.login;
							$("#perfilAcesso").val(data.usuario.idPerfil);
							$("#email").val(data.usuario.email);
							emailEdicao = data.usuario.email;
						}
					}
				});
	});
}

function inciarExclusao(tabelaBody)
{

	tabelaBody.on("click", "a.btn-excluir", function (e)
			{
				let id = $(this).attr('data-id');
				
				swal({
		      		title: "Deseja confirmar a exclusão do funcionário: " + $(this).closest("tr").find('td:eq(0)').text() + "?",
		      		//text: "You will not be able to recover this imaginary file!",
		      		type: "warning",
		      		showCancelButton: true,
		      		confirmButtonText: "Sim",
		      		cancelButtonText: "Não",
		      		closeOnConfirm: false,
		      		closeOnCancel: false
		      	}, function(isConfirm) {
		      		if (isConfirm) {
		      			excluir(id);
		      		} else {
		      			swal("Cancelado", "O funcionário não será excluido :)", "error");
		      		}
		      	});

		});
}

function excluir(id)
{
	    swal.close();
	    waitingDialog.show('Excluindo ...');
	
		$.ajax(
		{
			type: "DELETE",
			url: "api/funcionarios/" + id,
			cache: false,
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
			error: function error(data)
			{
				
				console.log(data);
				lancarToastr("error",`${data.responseJSON.message}`);

			},
			success: function ()
			{
				lancarToastr("success",`Funcionário excluido com sucesso.`,true);

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
	

jQuery.validator.addMethod("verificarUsuario", function(value, element,parametros) {
	
	return  !verificarUsuario();
	
},'Nome de usuário já existente.');

jQuery.validator.addMethod("verificarEmail", function(value, element,parametros) {
	
	return  !verificarEmail();
	
},'Email já utilizado.');

	
	$("#form-funcionario").validate(
	{
		// Rules for form validation
		rules:
		{
			nome:
			{
				required: true
			},
			login:
			{
				required: true,
				verificarUsuario: true
			},
			cargo:
			{
				required: true
			},
			perfilAcesso:
			{
				required: true
			},
			email : {
				required: true,
				verificarEmail: true
			}
		},
		messages : {
			nome:
			{
				required: "Campo obrigatório"
			},
			login:
			{
				required: "Campo obrigatório"
			},
			cargo:
			{
				required: "Campo obrigatório"
			},
			perfilAcesso:
			{
				required: "Campo obrigatório"
			}
			
		},
		submitHandler: function submitHandler(form)
		{
			enviarForm($(".btn-salvar").attr("acao"), $(".btn-salvar").attr("data-id"))

		}
	});
}

function preencherComboPerfil(){
	
	$.ajax(
			{
				type: "GET",
				url: "api/perfis/listar",
				cache: false,
				beforeSend: function (request) {
					request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
			    },
				error: function error(data)
				{
					
					console.log(data)

				},
				success: function (data)
				{
					for (var i in data) {
				        $("#perfilAcesso").append('<option value=' + data[i].id + '>' + data[i].descricao + '</option>');
				    }
				}
			});
	
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