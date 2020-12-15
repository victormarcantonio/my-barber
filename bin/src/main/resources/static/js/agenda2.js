$(document).ready(function() {


	var diasGlobal = []; // horários de atendimento do barbeiro
	
	var agendamentosDia = []; // agendamento do dia
	var idEventoClick = null; // para tirar o agendamento da validação quando
								// for editar, fora isso sempre tenq ser null
	
	
	
	$('#data').datepicker({
		format : "dd/mm/yyyy",
		autoclose : true,
		todayHighlight : true,
		 dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
		
	}).datepicker('setDate', 'today');
	 var diaGlobal = moment(); // recebe o dia do select ou clickEnven do fullCalendar receber o dia quando alterar o dataPicker
	console.log(diaGlobal);
	 var now = new Date();
     $('#horarioInicio').val(moment(now).format('HH:mm'))
	
	
	
	 $('#servicos').select2();
	 
	 $(".btn-salvar").attr("acao", "cadastrar");
	 
	 listarBarbeiros();
	 listarServicos();
	 autoCompleteCliente();
	 validarForm();
	 btns();
	 eventoData();
	 
});

function eventoData(){
	
	 $('#data').on('change',function(){
		 
		 let dia = $(this).val();
		 var dateObject = moment(dia, "DD/MM/YYYY")
		 
		 diaGlobal = dateObject;
		 pegarAgendamentosDia(moment(diaGlobal).format('YYYY-MM-DD'));
			
	});
}



function pegarDiaGlobal(){
	
	
	let dateObject = moment($('#data').val(), "DD/MM/YYYY")
	 
	diaGlobal = dateObject;
	
}

function listarBarbeiros() {
    $.ajax({
        type: "GET",
        url: "funcionarios/listarBarbeiros",
        cache: false,
        error: function error(data) {
        	lancarToastr('error','Sem barbearia na sessão.')
        },
        success: function(data) {

            for (var i in data) {
                if (i == 0) {
                    $(".nav-underline").append(`<a class="nav-link active" href="#" idBarbeiro=${data[i].id}> ${data[i].nome}</a>`);
                } else {
                    $(".nav-underline").append(`<a class="nav-link" href="#" idBarbeiro=${data[i].id}> ${data[i].nome} </a>`);
                }

            }
            clickBarbeiro();
            carregarHorarioAtendimento();
        }
    });
}

function carregarAgenda(dias){
	
	
	$('.modal-loading').modal('hide');
   var calendarEl = document.getElementById('calendar');
   let idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
   console.log(idBarbeiro)
   
   diasGlobal = dias;
   
   var calendar = new FullCalendar.Calendar(calendarEl, {
   	
       locale: 'pt-br',
       plugins: ['bootstrap', 'interaction', 'dayGrid', 'timeGrid'],
       themeSystem: "bootstrap",
       header: {
           left: 'prev,next today',
           center: 'title',
           right: 'dayGridMonth,timeGridWeek,timeGridDay'
       },
       defaultView: 'timeGridWeek',
       views: {
           week: { // name of view
               titleFormat: {
                   year: 'numeric',
                   month: '2-digit',
                   day: '2-digit'
               }
               // other view-specific options here
           }
       },
       navLinks: true,
       selectable: true,
       selectMirror: true,
       allDaySlot: false,
       selectConstraint: "businessHours",
       selectAllow: function(info) {
           const today = moment(new Date(), "YYYY-MM-DD", true)

           const click = moment(info.start)
           if (click.isBefore(today))
               return false;
           return true;
       },
       select: function(info) {
       	
           var dia = moment(info.start).format('YYYY-MM-DD');
       	
           pegarAgendamentosDia(dia);
            
           var horario = info.start;

           $('#horarioInicio').val(moment(horario).format("HH:mm"));
           $('#data').datepicker('setDate', moment(horario).format("DD/MM/YYYY")).focus();
           $(".btn-salvar").attr("acao", "cadastrar");
           
           idEventoClick = null;
           
           var diaClick = moment(info.start);
           
           diaGlobal = diaClick;
           console.log(diaGlobal);
       },
       eventLimit: true, // allow "more" link when too many events
       eventSources: [

           // your event source
           {
               url: `api/agendamento/listarFullCalendar/${idBarbeiro}`, // use
               // the
               // `url`
               // property
               textColor: 'black'
           }
           // any other sources...

       ],
       eventClick: function(info) {
       	
       	
       	var dia = moment(info.el.fcSeg.start).format('YYYY-MM-DD');
       	var diaClick = moment(info.el.fcSeg.start);
       	idEventoClick = info.event.id;
           
           diaGlobal = diaClick;
           pegarAgendamentosDia(dia);
           visualizarAgendamento(info);

       },
       businessHours: dias ? dias : {
           // days of week. an array of zero-based day of week integers
			// (0=Sunday)
           daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Monday - Thursday

           startTime: '00:00', // a start time (10am in this example)
           endTime: '23:59', // an end time (6pm in this example)
       }
   });

   calendar.render();
   
   //eventoData();

}



function pegarAgendamentosDia(dia){
	
	var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
	
	$.ajax({
	       type: "GET",
	       url: `api/agendamento/buscarPorData/${dia}/${idBarbeiro}`,
	       cache: false,
	       error: function error(data) {
	           console.log(data);
	       },
	       success: function(data) {

	    	console.log(data);
	       	agendamentosDia = data;
	       }
	     });
}


function listarServicos(){
	
	 $.ajax({
	        type: "GET",
	        url: "api/servicos/listar",
	        cache: false,
	        error: function error(data) {

	        	lancarToastr('error','Sem barbearia na sessão.');

	        },
	        success: function(data) {

	                for (var i in data) {
	                    $("#servicos").append(`<option value='${data[i].id}' preco='${data[i].valor}' tempo='${data[i].tempo}' >${data[i].descricao}</option>`);
	                }

	                calcularValor();
	                calcularTermino();

	        }
	    });
}

function calcularValor(){
	
	$('#servicos').on("change", function() {


        var total = 0;
        	
       	 $('option:selected', this).each(function(e,i){
       		 let preco = $(this).attr('preco');
       		 total = total + parseInt(preco) ;
       	});

            $('#valor').val(total);

        });
}

function calcularTermino(){
	
	$('#servicos').on("change", function() {

    	
   	 var durations  = [];
   	 
   	 let inicio = $("#horarioInicio").val();
   	 
   	 durations.push(inicio);
   	 
   	 
      	 $('option:selected', this).each(function(e,i){
      		 let tempo = $(this).attr('tempo');
      		durations.push(tempo);
      	});
      	 

       const totalDurations = durations.slice(1)
           .reduce((prev, cur) => moment.duration(cur).add(prev),
               moment.duration(durations[0]))

       $("#horarioTermino").val(moment.utc(totalDurations.asMilliseconds()).format("HH:mm"));
       
       $('#form-agendamento').validate().element("#horarioTermino");
       $('#form-agendamento').validate().element("#horarioInicio");
	});
}

function autoCompleteCliente(){
	
    $("#cliente").autocomplete({
        minLength: 0,
        source: function(request, response) {
            $.ajax({
                type: "GET",
                url: `api/clientes/listar`,
                dataType: "json",
                error: function error(data) {
                    console.log(data);
                },
                success: function success(data) {
                    var clientes = [];
                    data.forEach(function(d, i) {
                        clientes.push({
                            value: d.nome,
                            id: data[i].id,
                            index: i
                        });
                    });
                    response(clientes);
                }
            });
        },
        change: function change(e, ui) {
        	
        	/*
        	jQuery.validator.setDefaults({
        		errorElement: 'div',
        	    errorPlacement: function (error, element) {
        	    	error.addClass('invalid-feedback');
        	    	console.log(error);
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
        	});*/
        	
        	
            if (ui.item == null) {
            	console.log(e.target)
                $(e.target).siblings(".invalid").remove();
                $(e.target).addClass("state-error").after('<div class="invalid">Nome inválido</div	>');
                $('#cliente').val("").focus();
                $('#cliente').removeAttr('idCliente');
            } else {
                $(e.target)
                    .parent()
                    .removeClass("state-error");
                $(e.target)
                    .siblings(".invalid")
                    .remove();
                $('#cliente').attr('idCliente', ui.item.id);
            }
        }
    });

}

function clickBarbeiro() {

    // toda vez que trocar de barbeiro
    $(".nav-link").on("click", function() {
        $(".nav-underline").find(".active").removeClass("active");
        $(this).addClass("active");

        $('#calendar').html('');
        
        carregarAgenda(dias);

    });
}


function carregarHorarioAtendimento() {

    var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
    var inicioAtendimento;
    var finalAtendimento;
    var dias = new Array();
    var result = new Array();

    $.ajax({
        type: "GET",
        url: `funcionarios/buscarHorarioAtendimento/${idBarbeiro}`,
        cache: false,
        error: function error(data) {
            console.log(data)
            lancarToastr('error', data.responseJSON.message);
        },
        success: function(data) {

            if (data.length > 0) {
                data.forEach(function(element) {

                    if (element.aberto) {
                        dias.push({
                            daysOfWeek: [element.dia],
                            startTime: element.inicio,
                            endTime: element.fim
                        })
                    }

                });
            } else if (dias.length <1) {
            	lancarToastr("warning", 'Barbeiro sem horário de atendimento definido');
            	dias = null;
            }else{
            	
            	lancarToastr("warning", 'Barbeiro sem horário de atendimento definido');
            }
        }
    });
    
    console.log(dias)
    $('.modal-loading').modal('show');
    setTimeout(function() {
        carregarAgenda(dias);
    }, 1000);
}

function validarForm(){
	
	jQuery.validator.setDefaults({
		errorElement: 'div',
	    errorPlacement: function (error, element) {
	    	error.addClass('invalid-feedback');
	    	console.log(error);
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
	
	
	jQuery.validator.addMethod("validarHorarioComercial", function(value, element,parametros) {
		
		var resposta = verificarHorarioComercial(parametros);
		return resposta[0];
	},function(parametros){
		var resposta = verificarHorarioComercial(parametros);
		return resposta[1];
	});
	
	
	jQuery.validator.addMethod("validarHorarioAgendamentos", function(value, element,parametros) {
		var resposta = verficarAgendamentos(parametros);
		return resposta[0];
	},function(parametros){
		var resposta = verficarAgendamentos(parametros);
		return resposta[1];
	});
	
	jQuery.validator.addMethod("validarHorarioTermino", function(value, element,parametros) {
		console.log(`${parametros[0]}#horarioInicio`)
		let diaClick = diaGlobal.date();
		let horarioInicio = moment(getDateFromHours($(`${parametros[0]} #horarioInicio`).val(),diaClick),"YYYY-MM-DD", true);
		let horarioTermino = moment(getDateFromHours($(`${parametros[0]} #horarioTermino`).val(),diaClick),"YYYY-MM-DD", true);
		return horarioTermino.isAfter(horarioInicio);
		
	},'Horário termino não pode ser antes ou igual ao horário de inicio.');
	
	

$("#form-agendamento").validate({
        rules: {
        	data: {
                required: true
            },
        	cliente: {
                required: true
            },
            servicos: {
                required: true
            },
            valor: {
                required: true
            },
            horarioInicio: {
                required: true,
                validarHorarioComercial : ['inicio'],
                validarHorarioAgendamentos : ['inicio']
            },
            horarioTermino :{
            	required: true,
            	  validarHorarioComercial : ['termino'],
                  validarHorarioAgendamentos : ['termino'],
                  validarHorarioTermino : ['#form-agendamento']
            }
        },
        messages: {
        	data: {
                required: "Campo obrigatório."
            },
        	cliente: {
                required: "Campo obrigatório."
            },
            servicos: {
            	required: "Selecione no mínimo um serviço."
            },
            valor: {
                required: "Campo obrigatório."
            },
            horarioInicio: {
            	required: "Campo obrigatório."
            },
            horarioTermino :{
            	required: "Campo obrigatório."
            }
        },
        submitHandler: function submitHandler() {

        	enviarForm($(".btn-salvar").attr("acao"),$(".btn-salvar").attr("idAgendamento"));
        	
        }
    });
	
	
	
}


function enviarForm(acao, id) {

	
	var servicoSelect = $('#servicos').val();
	var servicos = [];
	servicoSelect.forEach(function(e){
		servicos.push({id:e});
	});
	
	var data = moment($("#data").val(), "DD/MM/YYYY");
	data = data.format("YYYY-MM-DD");
	
    var sendInfo = {
        id: id,
        cliente: {id:$("#cliente").attr('idCliente'),nome:$("#cliente").val()},
        idFuncionario: $(".nav-underline").find(".active").attr('idBarbeiro'),
        servicos: servicos,
        dataHorarioInicio: data + ' ' + $("#horarioInicio").val(),
        dataHorarioFim: data + ' ' + $("#horarioTermino").val(),
        valor: $('#valor').val().replace(",","."),
        observacao: $("#obs").val()
    }
	
    if (id) {
        var verbo = 'PUT'
    } else {
        var verbo = 'POST'
    }
 
    console.log(sendInfo)
    
    
    $.ajax({
        type: verbo,
        url: `/api/agendamento/${acao}`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendInfo),
        error: function error(data) {
            console.log(data)
            lancarToastr("error", data.responseJSON);

        },
        // dataType: 'json',
        success: function success(data) {
        	lancarToastr("success", `Agendamento ${acao == "cadastrar" ? "salvo" :  "editado"} com sucesso.`);
        	$('#form-agendamento')[0].reset();


        }
    });

   
}

function visualizarAgendamento(info) {


    
    $('#detalhes').modal('show');
    $.ajax({
        type: "PATCH",
        url: `api/agendamento/buscarPorId/${info.event.id}`,
        cache: false,
        error: function error(data) {

            console.log(data)

        },
        success: function(data) {
        	
        	
            var horarios = pegarHorario(data);

            
            $("#labelNomeCliente").text(data.cliente.nome);
            data.servicos.forEach(montarLabelServicos);
            $("#labelValor").text(data.valor);
            $("#labelInicio").text(pegarHorario(data).inicio);
            $("#labelTermino").text(pegarHorario(data).fim);
            $("#labelObs").text(data.observacao);
            $("#labelSituacao").text(data.status);


            if (data.status == 'AGENDADO') {
                $(".btn-cancelar-agendamento").attr('idAgendamento', data.id);
                $(".btn-cancelar-agendamento").show();
                $(".btn-concluido").attr('idAgendamento', data.id);
                $(".btn-concluido").show();
                $(".btn-editar").attr('idAgendamento', data.id);
            } else {
            	$(".btn-cancelar-agendamento").removeAttr('idAgendamento');
            	$(".btn-cancelar-agendamento").hide();
            	$(".btn-concluido").removeAttr('idAgendamento');
            	$(".btn-concluido").hide();
            	$(".btn-editar").removeAttr('idAgendamento');
            	$(".btn-editar").hide();
            }
            
            if(moment(data.dataHorarioInicio).isAfter(moment())){
                $(".btn-concluido").removeAttr('idAgendamento');
                $(".btn-concluido").hide();
            	
            }else{
            	$(".btn-concluido").attr('idAgendamento', data.id);
                $(".btn-concluido").show();
            }
        }
    });


    info.el.style.borderColor = 'red';
    
    function montarLabelServicos(element, index, array) {

        if (array.length > 1) $("#tituloServico").html('Serviços : ')
        if (index > 0) {
            $("#labelServicos").append(` - ${element.descricao}`);
        } else {
            $("#labelServicos").text(`${element.descricao}`);
        }

    }
}

function pegarHorario(data) {

    var inicio;
    var fim;

    inicio = new Date(data.dataHorarioInicio);
    inicio = moment(inicio).format("HH:mm");

    fim = new Date(data.dataHorarioFim);
    fim = moment(fim).format("HH:mm");

    return {
        inicio: inicio,
        fim: fim
    };

}

function btns(){
	
	$(".btn-editar").on('click', function() {
		
		
        iniciarEdicao($(".btn-editar").attr('idAgendamento'));
    });
	
    $(".form-btn-cancelar").on('click', function() {
		
    	
    	
    	$('.').html('Novo agendamento');
    	$('.form-agendamento').removeClass('form-select-agendamento');
    	$('#cliente').removeAttr('idCliente');
    	$("#servicos").val("");
    	$("#servicos").trigger("change");
    	$('.btn-salvar').attr('acao','cadastrar');
    });
    
    $('.btn-cancelar-agendamento').on('click', function() {

        alterarStatus($(this).attr('idAgendamento'), 'CANCELADO');

    });

    $('.btn-concluido').on('click', function() {

        alterarStatus($(this).attr('idAgendamento'), 'CONCLUIDO');

    });
    
  $("#cli-nao-cadastrado").on("change",function(){
    	
    	if($(this).is(":checked")){
    		console.log('sim')
    		$("#cliente").removeAttr('idCliente');
    		$("#cliente").autocomplete("destroy");
    		$("#cliente").val('');
    		$("#cliente").removeAttr('idCliente');
    		$('#cliente').parent().removeClass("state-error");
            $('#cliente').siblings(".invalid").remove();
    		
    	}else{
    		$("#cliente").val('');
    		autoCompleteCliente();
    		
    	}
    	
    });
}

function iniciarEdicao(id) {
    
    $.ajax({
        type: "PATCH",
        url: `api/agendamento/buscarPorId/${id}`,
        cache: false,
        error: function error(data) {

        	lancarToastr('error',data)
            console.log(data)

        },
        success: function(data) {
        	$('.form-titulo').html('Editar agendamento');
        	$('.form-agendamento').addClass('form-select-agendamento');
        	$('#detalhes').modal('hide');
            $("#cliente").val(data.cliente.nome);
            $("#cliente").attr('idCliente', data.cliente.id);
            var servicos = [];
            data.servicos.forEach(function(e){
            	 
            	 servicos.push(e.id);
            });
            console.log(servicos);
            $('#servicos').val(servicos).trigger('change');
            $("#valor").val(data.valor);
            var dia = new Date(data.dataHorarioInicio);
            $('#data').val(moment(dia).format('DD/MM/YYYY'));
            $("#horarioInicio").val(pegarHorario(data).inicio);
            $("#horarioTermino").val(pegarHorario(data).fim);
            $("#obs").val(data.observacao);
            $(".btn-salvar").attr('idAgendamento', data.id);
            $(".btn-salvar").attr('acao', 'editar');
        }
    });
}

function alterarStatus(id, status) {

    var sendInfo = {
        id: id,
        status: status
    }

    $.ajax({
        type: 'POST',
        url: `/api/agendamento/alterarStatus`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendInfo),
        error: function error(data) {
            console.log(data)
            lancarToastr("error", data.responseJSON);

        },
        // dataType: 'json',
        success: function success(data) {
            $('#modal-servico').modal('hide');
            lancarToastr("success", "Status alterado com sucesso.");


        }
    });
}



function verificarHorarioComercial(parametros){
	
    const agora = moment(new Date(), "YYYY-MM-DD", true);
	
	let horarioComercial = pegarHorarioComercial();

	

	pegarDiaGlobal();
	let diaClick = diaGlobal.date();
	let resposta = [];
	
    if(!horarioComercial){
    	console.log('kk')
    	resposta.push(false);
		resposta.push(`Dia ${moment(diaGlobal).format('DD/MM/YYYY')} está fechado.`);
		return resposta;
	}else{
		
	
	
	
	let inicioHorarioComercial = moment(getDateFromHours(horarioComercial.startTime,diaClick),"YYYY-MM-DD", true);
	let fimHorarioComercial = moment(getDateFromHours(horarioComercial.endTime,diaClick),"YYYY-MM-DD", true);

	
	
	
	
	if(parametros[0]=='inicio'){
		
		let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),diaClick),"YYYY-MM-DD", true);
		console.log(horarioInicio);
		console.log(fimHorarioComercial);
		console.log(horarioInicio.isAfter(fimHorarioComercial));
		

		// se for antes de agora
		if(horarioInicio.isBefore(agora)){
			 resposta.push(false);
			 resposta.push(`Você não pode marcar um horário passado`);
			 
		 }else if (horarioInicio.isAfter(fimHorarioComercial)){
			 // depois do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else if(horarioInicio.isBefore(inicioHorarioComercial)){
			// antes do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else{
			 console.log('aqui')
			 resposta.push(true);
		 }
	}else{
		
		let horarioTermino = moment(getDateFromHours($(`#horarioTermino`).val(),diaClick),"YYYY-MM-DD", true);
		
		 if (horarioTermino.isAfter(fimHorarioComercial)){
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioTermino.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else if(horarioTermino.isBefore(inicioHorarioComercial)){
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioTermino.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else{
			 resposta.push(true);
			 
		 }
	}
	
	
	return resposta;
	
	}
	
}


function verficarAgendamentos(parametros){
	
	
	
	let diaClick = diaGlobal.date();
	let resposta = [];
	let format = 'hh:mm'
	
	
	agendamentosDia;
	
   if($('.btn-salvar').attr('acao')=="editar"){
		
	   console.log('é')
		
		agendamentosDia.forEach(function(element,i,array){
			
			if(element.id == idEventoClick){
				delete array[i]
			}
			
		});
	}

	
	if(parametros[0] =='inicio'){
		
		let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),diaClick),"YYYY-MM-DD", true);
		console.log(horarioInicio);
		
		agendamentosDia.forEach(function(element){
			
			let inicioAgendamento = moment(getDateFromHours(moment(element.dataHorarioInicio).format('HH:mm'),diaClick),"YYYY-MM-DD", true);
			
			let terminoAgendamento =  moment(getDateFromHours(moment(element.dataHorarioFim).format('HH:mm'),diaClick),"YYYY-MM-DD", true);

			
			if(horarioInicio.isBetween(tirar1Minuto(inicioAgendamento),add1Minuto(terminoAgendamento))){
				resposta.push(false);
				resposta.push(`Já tem um agendamento marcado de ${add1Minuto(inicioAgendamento).format('HH:mm')} ás ${tirar1Minuto(terminoAgendamento).format('HH:mm')}.`);
				return;
			}
			
		});
		
		resposta.push(true);
	}else if(parametros[0] =='termino'){
		
		   console.log('entro aqui')
		   let horarioTérmino = moment(getDateFromHours($(`#horarioTermino`).val(),diaClick),"YYYY-MM-DD", true);
		
           agendamentosDia.forEach(function(element){
			
			let inicioAgendamento = moment(getDateFromHours(moment(element.dataHorarioInicio).format('HH:mm'),diaClick),"YYYY-MM-DD", true);
			
			let terminoAgendamento =  moment(getDateFromHours(moment(element.dataHorarioFim).format('HH:mm'),diaClick),"YYYY-MM-DD", true);

			
			if(horarioTérmino.isBetween(tirar1Minuto(inicioAgendamento),add1Minuto(terminoAgendamento))){
				resposta.push(false);
				resposta.push(`Já tem um agendamento marcado de ${add1Minuto(inicioAgendamento).format('HH:mm')} ás ${tirar1Minuto(terminoAgendamento).format('HH:mm')}.`);
				return;
			}
			
		});
           
       resposta.push(true);
		
	}
	
	console.log(resposta)
	return resposta;
	
}


function tirar1Minuto(tempo){
	
	return tempo.subtract(60, 'seconds');
}

function add1Minuto(tempo){
	
	return tempo.add(60, 'seconds');
}

function getNumeroDia(dia) {
	  var dias = {
	     'Sun' : 0,
	    'Mon': 1,
	    'Tue': 2,
	    'Wed': 3,
	    'Thu': 4,
	    'Fri': 5,
	    'Sat': 6,
	    
	  };
	  return dias[dia];
	}
 

function pegarHorarioComercial(){
	
	// pegar o horário da comercial do dia
     
	let horarioComercial;
	
	pegarDiaGlobal();	
	
	console.log(diaGlobal.format("ddd"));
	console.log(diasGlobal);
	
	diasGlobal.forEach(function(e){
  	
  	if(e.daysOfWeek[0]==getNumeroDia(diaGlobal.format("ddd"))){
  		horarioComercial = e ;
  	}
  });
	
  return horarioComercial;
  console.log(horarioComercial);
}

function validarHorario(dias) {


    validacoes = {
        descricao: {
            required: true
        },
        valor: {
            required: true
        },
        tempo: {
            required: true
        }
    }

    return validacoes;

}

