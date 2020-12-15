$(document).ready(function ()
{
	$(".app-menu__item").removeClass('active')
	$(".app-menu__item.clientes").addClass('active')
	$(function () {
		  $('[data-toggle="popover"]').popover()
		})

		
	var emailEdicao;
	montarDataTable();

	var tabelaBody = $("#table-cliente > tbody");

	iniciarEdicao(tabelaBody);

	inciarExclusao(tabelaBody);

	//excluir(tabelaBody);

	

	validarForm();
	
	$(".btn-cancelar").on("click",function(){
		$(".cliente-form").slideUp('slow');
		$('.listagem').slideDown('slow');
		$('#form-cliente').validate().resetForm();
		$("#form-cliente").find('.is-valid').removeClass("is-valid");
	});
	
	
});


function enviarForm(acao, id)
{
       
	var sendInfo = {
			id : id,
			nome : $("#nome").val(),
			telefone : $("#telefone").val(),
			dataNascimento: $("#dataNascimento").val(),
			endereco : null,
			usuario:null,
			idBarbearia: getIdBarbearia(getToken()),
			usuario : {id:$("#email").attr('idusuario'), email : $("#email").val()!=""?$("#email").val():null}
	}
	
	
	let verbo;
	if(acao == "editar"){
		verbo = 'PUT';
	}else{
		verbo= 'POST';
	}

	waitingDialog.show('Salvando cliente ...');
	$.ajax(
	{
		type : verbo,
		url: `api/clientes`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(sendInfo),
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
		//dataType: 'json',
		success: function success(data)
		{
			
			
			lancarToastr("success",`Cliente ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`,true)


		}
	});
}

function montarDataTable()
{
	waitingDialog.show('Carregando ...');

	var table = $('#table-cliente').DataTable(
	{

		responsive: true,
		lengthChange: false,
		"processing": true,
		"ajax":
		{
			"url": `api/clientes/${getIdBarbearia(getToken())}`,
			'beforeSend': function (request) {
		        request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
			dataSrc: ''
		},
		"columns": [
		{
			"data" : "nome"
	    }, {
	        "data" : "usuario.email"
	    }, {
	        "data" : "telefone"
	    },
		{
			'mRender': function (data, type, row)
			{
				
				return `<a type="button" class="btn btn-secondary btn-editar btn-sm " data-id="${row.id}" data-toggle="modal" ><i class="fa fa-edit"></i></a>
            <a type="button" class="btn btn-danger btn-excluir  btn-sm" data-toggle="modal" href="#modal-excluir" data-id="${row.id}" ><i class="fa fa-lg fa-trash"></i></a>`
			},
		}],
		
		buttons: [ {
            text: 'Novo',
            className: 'btn-primary btn-novo',
            title: 'Clique para cadastrar um novo cliente',
            action: function ( e, dt, node, config ) {
            	$(".tile-title").text("Novo cliente");
            	emailEdicao = null;
                $('.cliente-form').slideDown('slow');
                $(".listagem").slideUp('slow');
                $(".btn-salvar").removeAttr('data-id');
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
			table.buttons().container().appendTo( '#table-cliente_wrapper .col-md-6:eq(0)' );
			$('.btn-novo').removeClass('btn-secondary');
		}

	});
}

function iniciarEdicao(tabelaBody)
{
	
	tabelaBody.on("click", "a.btn-editar", function (e)
	{
		$('.cliente-form').slideDown('slow');
        $(".listagem").slideUp('slow');
		$('#form-cliente')[0].reset();
		$(".btn-salvar").attr("acao", "editar");
		$(".btn-salvar").attr("data-id", $(this).attr('data-id'));
		$.ajax(
				{
					type: "PATCH",
					url: "api/clientes/" + $(this).attr('data-id'),
					cache: false,
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
						$(".tile-title").text("Editar cliente");
						$("#nome").val(data.nome);
						$("#telefone").val(data.telefone);
						$("#email").val(data.emailUsuario);
						$("#email").attr("idusuario",data.idUsuario);
						emailEdicao = data.emailUsuario
						$("#dataNascimento").val(data.dataNascimento);
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
      		title: "Deseja confirmar a exclusão do cliente: " + $(this).closest("tr").find('td:eq(0)').text() + "?",
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
      			swal("Cancelado", "O cliente não será excluido :)", "error");
      		}
      	});

	});
}

function excluir(id)
{
	   
        swal.close();
        waitingDialog.show('Carregando ...');
	
		
		$.ajax(
		{
			type: "DELETE",
			url: `api/clientes/${id}/${getIdBarbearia(getToken())}`,
			cache: false,
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
			error: function error(data)
			{
				waitingDialog.hide();
				lancarToastr("error",data)

			},
			success: function ()
			{
				
				lancarToastr("success",`Cliente excluido com sucesso.`,true);

			}
		});
	
}

function validarForm()
{

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
		
		return  !verificarEmail();
		
	},'Email já utilizado.');
	
	
	 $("#form-cliente").validate(
	{
		// Rules for form validation
		rules:
		{
			nome: {
				required: true
			},
			telefone:
			{
				required: true
			},
			email:
			{
				required: true,
				verificarEmail: true
			},
			dataNascimento:
			{
				required: true
			}
		},
		messages : {
			nome: {
				required: "Campo obrigatório"
			},
			telefone:
			{
				required: "Campo obrigatório"
			},
			dataNascimento:
			{
				required: "Campo obrigatório"
			},
			email:
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
