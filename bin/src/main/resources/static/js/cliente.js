$(document).ready(function ()
{
	$(function () {
		  $('[data-toggle="popover"]').popover()
		})

	montarDataTable();

	var tabelaBody = $("#table-cliente > tbody");

	iniciarEdicao(tabelaBody);

	inciarExclusao(tabelaBody);

	//excluir(tabelaBody);

	iniciarNovoServico();

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
			email : $("#email").val(),
			dataNascimento: $("#dataNascimento").val(),
			endereco : null,
			usuario:null
			
	}
	
	
	let verbo;
	if(acao == "editar"){
		verbo = 'PUT';
	}else{
		verbo= 'POST';
	}

	console.log(sendInfo)
	$.ajax(
	{
		type : verbo,
		url: `api/clientes/${acao}`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(sendInfo),
		error: function error(data)
		{
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
				"hideMethod": "fadeOut",
				"onHidden": function ()
				{
					window.location.reload();
				}
			}
			toastr["success"](`Cliente ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`)


			$('#form-cliente')[0].reset();

		}
	});
}

function montarDataTable()
{

	var table = $('#table-cliente').DataTable(
	{

		responsive: true,
		lengthChange: false,
		"processing": true,
		"ajax":
		{
			"url": "api/clientes/listar",
			dataSrc: ''
		},
		"columns": [
		{
			"data" : "nome"
	    }, {
	        "data" : "email"
	    }, {
	        "data" : "telefone"
	    },
		{
			'mRender': function (data, type, row)
			{
				console.log(row)
				return `<a type="button" class="btn btn-secondary btn-editar btn-sm " data-id="${row.id}" data-toggle="modal" ><i class="fa fa-edit"></i></a>
            <a type="button" class="btn btn-danger btn-excluir  btn-sm" data-toggle="modal" href="#modal-excluir" data-id="${row.id}" ><i class="fa fa-lg fa-trash"></i></a>`
			},
		}],
		
		buttons: [ {
            text: 'Novo',
            className: 'btn-primary btn-novo',
            title: 'Clique para cadastrar um novo cliente',
            action: function ( e, dt, node, config ) {
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
		
		initComplete : function(){
			table.buttons().container().appendTo( '#table-cliente_wrapper .col-md-6:eq(0)' );
			$('.btn-novo').removeClass('btn-secondary');
		}

	});
}

function iniciarEdicao(tabelaBody)
{
	console.log(tabelaBody)
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
					url: "api/clientes/editar/" + $(this).attr('data-id'),
					cache: false,
					error: function error(data)
					{						toastr.options = {
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
						toastr["error"](`${data.responseText}`);
						console.log(data)

					},
					success: function (data)
					{
						
						$("#nome").val(data.nome);
						$("#telefone").val(data.telefone);
						$("#email").val(data.email);
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
	
		$(".spiner-carregando").modal('show');
		
		$.ajax(
		{
			type: "DELETE",
			url: "api/clientes/deletar/" + id,
			cache: false,
			error: function error(data)
			{
				console.log(data)
				lancarToastr("error",data)

			},
			success: function ()
			{
				$('#modal-excluir').modal('hide');
				$('.modal-loading').modal('show');
				lancarToastr("success",`Cliente excluido com sucesso.`);

			}
		});
	
}


function iniciarNovoServico()
{

	$(".btn-novo-cliente").on("click", function (e)
	{
		$("#form-cliente").slideToggle("slow");
		$('#form-cliente')[0].reset();
		$(".btn-salvar").removeAttr('data-id');
		$(".btn-salvar").attr("acao", "cadastrar");
		
	});
}

function validarForm()
{

	jQuery.validator.setDefaults({
	    errorPlacement: function (error, element) {
	        error.addClass('invalid-feedback');
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
	
	
	var u_form = $("#form-cliente").validate(
	{
		// Rules for form validation
		rules:
		{
			descricao:
			{
				required: true
			},
			valor:
			{
				required: true
			},
			tempo:
			{
				required: true
			}
		},
		submitHandler: function submitHandler(form)
		{

			enviarForm($(".btn-salvar").attr("acao"), $(".btn-salvar").attr("data-id"))

		}
	});
}
