$(document).ready(function ()
{

	 $('.modal-loading').modal('hide');
	 
	$("#tempo").mask('00:00');
	
	montarDataTable();
	

	var tabelaBody = $("#table-servicos > tbody");

	iniciarEdicao(tabelaBody);

	inciarExclusao(tabelaBody);

	
	
	validarForm();
	
	$(".btn-cancelar").on("click",function(){
		$(".servico-form").slideUp('slow');
		$('.listagem').slideDown('slow');
		$('#form-servico').validate().resetForm();
		$("#form-servico").find('.is-valid').removeClass("is-valid");
	});
	
	
});


function enviarForm(acao, id)
{

	var verbo;
	if(!id){
		verbo = 'POST';
	}else{
		verbo = 'PUT';
	}
	
	var data = {
		id: id,
		descricao: $("#descricao").val(),
		valor: $("#valor").val(),
		tempo: $("#tempo").val()
	}

	console.log(data)
	$.ajax(
	{
		type: verbo,
		url: `/api/servicos/${acao}`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data),
		error: function error(data)
		{
			console.log(data)
			lancarToastr("error",data);

		},
		//dataType: 'json',
		success: function success(data)
		{
			$('.modal-loading').modal('show');
			$('#modal-servico').modal('hide');
           
			lancarToastr("success",`Serviço ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`);
			

		}
	});
}

function montarDataTable()
{
	
	
	
	    
	
	var table = $('#table-servicos').DataTable(
	{

		responsive: true,
	    lengthChange: false,
		"processing": true,
		"ajax":
		{
			"url": "api/servicos/listar",
			dataSrc: ''
		},
		"columns": [
		{
			"data": "descricao"
		},
		{
			"data": "valor",render: function (data, type, row) {
                return data.toFixed(2);
                }
		},
		{
			"data": "tempo",render: function (data, type, row) {
				
                return moment(getDateFromHours(data)).format('HH:mm')
            }
		},
		{
			'mRender': function (data, type, row)
			{
				return `<a sec:authorize="hasRole('EDITAR_SERVICO')" type="button" class="btn btn-secondary btn-sm btn-editar" title="Editar serviço" data-id="${row.id}" data-toggle="modal" ><i class="fa fa-lg fa-edit"></i></a>
            <a sec:authorize="hasRole('EXCLUIR_SERVICO')" type="button" class="btn btn-danger btn-sm btn-excluir" data-toggle="modal" href="#modal-excluir" title="Excluir serviço" data-id="${row.id}" ><i class="fa fa-lg fa-trash"></i></a>`
			},
		}],
		buttons: [ {
            text: 'Novo',
            className: 'btn-primary btn-novo',
            title: 'Clique para cadastrar um novo serviço',
            action: function ( e, dt, node, config ) {
                $('.servico-form').slideDown('slow');
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
			table.buttons().container().appendTo( '#table-servicos_wrapper .col-md-6:eq(0)' );
			$('.btn-novo').removeClass('btn-secondary');
		}

	});
	
	
}

function iniciarEdicao(tabelaBody)
{
	tabelaBody.on("click", "a.btn-editar", function (e)
	{
		$('.servico-form').slideDown('slow');
        $(".listagem").slideUp('slow');
		$('#form-servico')[0].reset();;
		$(".btn-salvar").attr("acao", "editar");
		$("#descricao").val($(this).closest("tr").find('td:eq(0)').text());
		$("#valor").val($(this).closest("tr").find('td:eq(1)').text());
		$("#tempo").val($(this).closest("tr").find('td:eq(2)').text());
		$(".btn-salvar").attr("data-id", $(this).attr('data-id'));
	});
}

function inciarExclusao(tabelaBody)
{
	

	tabelaBody.on("click", "a.btn-excluir", function (e)
	{
		let id = $(this).attr('data-id');
		
		swal({
      		title: "Deseja confirmar a exclusão do serviço: " + $(this).closest("tr").find('td:eq(0)').text() + "?",
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
      			swal("Cancelado", "O serviço não será excluido :)", "error");
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
			url: "api/servicos/deletar/" + id,
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
				lancarToastr("success",`Serviço excluido com sucesso.`);

			}
		});
	
}


function validarForm()
{
	jQuery.validator.setDefaults({
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
	
	
	

	$("#form-servico").validate(
	{
	 
		// Rules for form validation
		rules:
		{
			descricao:
			{
				required: true,
				minlength: 3
			},
			valor:
			{
				required: true,
				minlength: 4
			},
			tempo:
			{
				required: true,
				minlength: 5
			}
		},
		messages:
		{
			descricao:
			{
				required: 'Descrição é obrigatório.',
				minlength: 'Minimo 3 caracteres.'
			},
			valor:
			{
				required: 'Campo obrigatório'
			},
			tempo:
			{
				required: 'Campo obrigatório'
			}
		},
		submitHandler: function submitHandler(form)
		{

			enviarForm($(".btn-salvar").attr("acao"), $(".btn-salvar").attr("data-id"))

		}

	});
}