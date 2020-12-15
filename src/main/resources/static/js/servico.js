$(document).ready(function ()
{

	console.log("river");
	$(".app-menu__item").removeClass('active')
	$(".app-menu__item.servicos").addClass('active')

	 $('.modal-loading').modal('hide');
	 
	$("#tempo").mask('00:00');
	
	montarDataTable();
	

	var tabelaBody = $("#table-servicos > tbody");

	iniciarEdicao(tabelaBody);

	inciarExclusao(tabelaBody);
	

    cadastrarPromocao(tabelaBody);
	
	
	validarForm();
	
	$(".btn-cancelar").on("click",function(){
		$(".servico-form").slideUp('slow');
		$('.listagem').slideDown('slow');
		$('#form-servico').validate().resetForm();
		$("#form-servico").find('.is-valid').removeClass("is-valid");
	});
	
	$(".btn-cancelar").on("click",function(){
		$(".promocao-form").slideUp('slow');
		$('.listagem').slideDown('slow');
		$('#form-servico').validate().resetForm();
		$("#form-servico").find('.is-valid').removeClass("is-valid");
	});
	
	
	
});

function enviarFormPromocao(acao, id) {

	var data = {
			id: id,
			dataInicio: $("#dataInicio").val(),
			dataFim: $("#dataFim").val(),
			descricao: $("#descricaoPromocao").val(),
			valor: $("#valorPromocao").val().replace(",", "."),
			idServico: $(".btn-salvar-promocao").attr("data-id-servico")
		}
	
	
var verbo;
	
	if(acao=="cadastrar"){
		var verbo = "POST";
	}else{
		var verbo = "PUT";
	}

	console.log(data)
	waitingDialog.show('Carregando ...');
	$.ajax(
	{
		type: verbo,
		url: `api/promocao`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data),
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			waitingDialog.hide();
			if(data.status == 400){
				lancarToastr("error",`${data.responseJSON.message}`);
			}else{
				lancarToastr("error","ERRO AO CADASTRAR PROMOÇÃO");
			}

		},
		//dataType: 'json',
		success: function success(data)
		{
           
			lancarToastr("success",`Promoção ${acao == "cadastrar" ? "cadastrada" : "editado"} com sucesso.`,true);
			

		}
	});
		
	
}


function enviarForm(acao, id)
{
	
	


	
	var data = {
		id: id,
		descricao: $("#descricao").val(),
		valor: $("#valor").val().replace(",", "."),
		tempo: $("#tempo").val(),
		idBarbearia: getIdBarbearia(getToken())
	}
	
	
var verbo;
	
	if(acao=="cadastrar"){
		var verbo = "POST";
	}else{
		var verbo = "PUT";
	}
	waitingDialog.show('Carregando ...');
	$.ajax(
	{
		type: verbo,
		url: `api/servicos`,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data),
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
		error: function error(data)
		{
			waitingDialog.hide();
			console.log(data);
			if(data.status == 400){
				lancarToastr("error",`${data.responseJSON.titulo}`);
			}else{
				lancarToastr("error",`${data.responseJSON.error_description}`);
			}

		},
		//dataType: 'json',
		success: function success(data)
		{
           
			lancarToastr("success",`Serviço ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`,true);
			

		}
	});
}



function alterarStatusPromocao(idPromocao, status, elemento) {



	swal({
  		title: "Deseja alterar o status da promoção?",
  		//text: "You will not be able to recover this imaginary file!",
  		type: "warning",
  		showCancelButton: true,
  		confirmButtonText: "Sim",
  		cancelButtonText: "Não",
  		closeOnConfirm: false,
  		closeOnCancel: false
  	}, function(isConfirm) {
  		if (isConfirm) {
  		   swal.close();
  			$.ajax(
  					{
  						type: 'PUT',
  						url: `api/promocao/alterar-status/${idPromocao}/${status}`,
  						contentType: "application/json; charset=utf-8",
  						beforeSend: function (request) {
  							request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
  					    },
  						error: function error(data)
  						{
  							waitingDialog.hide();
  							console.log(data);
  							if(data.status == 400){
  								lancarToastr("error",`${data.responseJSON.titulo}`);
  							}else{
  								lancarToastr("error",`${data.responseJSON.error_description}`);
  							}

  						},
  						//dataType: 'json',
  						success: function success(data)
  						{
  				           $(elemento).prop('checked',status);
  						}
  					});
  			
  		} else {
  		   swal.close();
  			$(elemento).prop('checked',!status);
  		
  	       
  		}
  	});

	
}

function montarDataTable()
{
	
	

	waitingDialog.show('Carregando ...');
	
	var table = $('#table-servicos').DataTable(
	{

		responsive: true,
	    lengthChange: false,
		"processing": true,
		"ajax":
		{
			"url": `api/servicos/${getIdBarbearia(getToken())}`,
			'beforeSend': function (request) {
		        request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },

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
				
				//return data;
                return moment(getDateFromHours(data)).format('HH:mm')
            }
		},
		   {
			'mRender': function (data, type, row)
			{
				 if (row.promocao) {
					console.log(row.promocao)
					let dataInicio =  formataStringDataUSParaBR(row.promocao.dataInicio);
					let dataFim = formataStringDataUSParaBR(row.promocao.dataFim);
					 if(row.promocao.status){
						 return `ATIVA - ${dataInicio} até ${dataFim}`
					 }else {
						 return `INATIVA - ${dataInicio} até ${dataFim}`
					 }
				 } else {
					 return 'SEM PROMOÇÃO'
				 }  
			},
	    },
	    {
			'mRender': function (data, type, row)
			{
				
				 if (row.promocao) {
					return row.promocao.valor.toFixed(2);
				 } else {
					 return '-'
				 }  
			},
	    },
		{
			'mRender': function (data, type, row)
			{
				return `<a  type="button" class="btn btn-secondary btn-sm btn-editar" title="Editar serviço" data-id="${row.id}" data-toggle="modal" ><i class="fa fa-lg fa-edit"></i></a>
            <a  type="button" class="btn btn-danger btn-sm btn-excluir" data-toggle="modal" href="#modal-excluir" title="Excluir serviço" data-id="${row.id}" ><i class="fa fa-lg fa-trash"></i></a>
             <a type="button" class="btn btn-primary btn-sm btn-promocao" data-toggle="modal" href="#modal-excluir" title="${row.promocao ? "Editar promoção": "Cadastrar promoção"}" data-id="${row.promocao ? row.promocao.id : 0}" data-id-servico="${row.id}" ><i class="fa fa-lg fa-percent"></i></a>`
			},
		}],
		buttons: [ {
            text: 'Novo',
            className: 'btn-primary btn-novo',
            title: 'Clique para cadastrar um novo serviço',
            action: function ( e, dt, node, config ) {
            	
            	$(".titulo-form-servico").text("Novo serviço");
                $('.servico-form').slideDown('slow');
                $(".listagem").slideUp('slow');
                $(".btn-salvar").removeAttr('data-id');
        		$(".btn-salvar").attr("acao", "cadastrar");
            }
        },
        ],
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
			$(".status-promocao").on("change",function(e, x) {
				e.preventDefault();
				let id = $(this).attr('data-id');
				if(!$(this).is(":checked")){
					alterarStatusPromocao(id, false, $(this));
				}else {
					alterarStatusPromocao(id, true, $(this));
				}
				
			})
			
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
		$(".titulo-form-servico").text("Editar serviço");
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


function buscarPromocao(id) {
	
	var data;
	
	   $.ajax({
		url: 'api/promocao/' + id,
		'beforeSend': function (request) {
	        request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
	    async: false,

		type: 'GET',
		success: function(data) {

			console.log(data.dataInicio)
			$('.promocao-form').slideDown('slow');
			$(".titulo-form-promocao").text("Editar promoção");
			$(".listagem").slideUp('slow');
			$("#dataInicio").val(data.dataInicio);
			$("#dataFim").val(data.dataFim);
			$("#descricaoPromocao").val(data.descricao);
			$("#valorPromocao").val(data.valor.toFixed(2));
			$(".btn-salvar-promocao").attr("acao", "editar");
			$(".btn-salvar-promocao").attr("data-id-promocao", data.id);
			$(".btn-salvar-promocao").attr("data-id-servico", data.id);
		},
		error: function(error){
            lancarToastr("error","Erro ao buscar promoção");
        }
	});
	   
	   return data;
}



function cadastrarPromocao(tabelaBody) {
	tabelaBody.on("click", "a.btn-promocao", function (e) {
		
		
		let id = $(this).attr('data-id');
		$(".btn-salvar-promocao").attr("data-id-servico", $(this).attr('data-id-servico'));
		
		if(id!=0){
			buscarPromocao(id)
		}else{
			$('.promocao-form').slideDown('slow');
			$(".titulo-form-promocao").text("Nova promoção");
			 $(".listagem").slideUp('slow');
			 $('#form-promocao')[0].reset();
			 $("#dataInicio").val($(this).closest("tr").find('td:eq(0)').text());
			 $("#dataFim").val($(this).closest("tr").find('td:eq(1)').text());
			 $("#descricao").val($(this).closest("tr").find('td:eq(1)').text());
			 $("#valor").val($(this).closest("tr").find('td:eq(1)').text());
			 $(".btn-salvar-promocao").attr("acao", "cadastrar");
			 $(".btn-salvar-promocao").removeAttr("data-id-promocao");
		}
		 
	})
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
	
        waitingDialog.show('Carregando ...');
		
		$.ajax(
		{
			type: "PUT",
			url: "api/servicos/desativar/" + id,
			cache: false,
			beforeSend: function (request) {
				request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
			error: function error(data)
			{
				console.log(data)
				lancarToastr("error",data)

			},
			success: function ()
			{
				$('#modal-excluir').modal('hide');

				lancarToastr("success",`Serviço excluido com sucesso.`, true);

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
	
	$("#form-promocao").validate({
		// Rules for form validation
		rules:
		{
			dataInicio: {
				required: true
			},
			dataFim: {
				required: true
			},
			valor: {
				required: true,
				minlength: 4
			}
		},
		messages:
		{
			dataInicio:
			{
				required: 'Data início é obrigatória.'
			},
			dataFim: 
			{
				required: 'Data Final é obrigatória'
			},
			valor:
			{
				required: 'Campo obrigatório'
			},
		},
		submitHandler: function submitHandler(form)
		{

			enviarFormPromocao($(".btn-salvar-promocao").attr("acao"), $(".btn-salvar-promocao").attr("data-id-promocao"))

		}

	})
	
}