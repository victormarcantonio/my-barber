$(document).ready(function() {
	$(".app-menu__item").removeClass('active')
	$(".app-menu__item.agenda").addClass('active')

	var diasGlobal = []; // horários de atendimento do barbeiro

	var idEventoClick = null; // para tirar o agendamento da validação quando
								// for editar, fora isso sempre tenq ser null
	
	
	
	
	 var diaGlobal = moment(new Date()); // recebe o dia do select ou clickEnven do fullCalendar receber o dia quando alterar o dataPicker
	 
	
	

	   $('#data').datepicker({
			format : "dd/mm/yyyy",
			autoclose : true,
			todayHighlight : true,
			 dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
			
		}).datepicker();
	 $('#servicos').select2({
		 
		 language: {
	            noResults: function () {
	                 return "Nenhum serviço cadastrado";
	            }
	        }
	 });
	 
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
		 
		 let dia = formataStringData($(this).val());
		 var dateObject = moment(dia)
		 diaGlobal = dateObject;
		 $('#form-agendamento').validate().element("#horarioTermino");
	     $('#form-agendamento').validate().element("#horarioInicio");
			
	});
}



function pegarDiaGlobal(){
	
	
	let dateObject = moment(formataStringData($('#data').val()))
	diaGlobal = dateObject;
	
}

function listarBarbeiros() {
	

	
    $.ajax({
        type: "GET",
        url: `api/funcionarios/listarPorCargo/BARBEIRO/${getIdBarbearia(getToken())}`,
        cache: false,
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
        	lancarToastr('error','Sem barbearia na sessão.')
        },
        success: function(data) {
        	console.log(data)
            for (var i in data) {
                
                /*if(data[i].usuario.ativo){*/
                
                if (i == 0) {
                    $(".nav-underline").append(`<a class="nav-link active" href="#" idBarbeiro=${data[i].id}> ${data[i].nome}</a>`);
                } else {
                    $(".nav-underline").append(`<a class="nav-link" href="#" idBarbeiro=${data[i].id}> ${data[i].nome} </a>`);
                }
                
               /* } */
                
            }
            clickBarbeiro();
            carregarHorarioAtendimento();
        }
    });
}

function carregarAgenda(dias){
	

   var calendarEl = document.getElementById('calendar');
   let idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
   
  
   
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
           const today = moment(new Date())
           
           const click = moment(info.start)
           if (click.isBefore(today))
               return false;
           return true;
       },
       select: function(info) {
       	
           var dia = moment(info.start).format('YYYY-MM-DD');
       	
            
           var horario = info.start;

           $(".btn-salvar").attr("acao", "cadastrar");
           $('#horarioInicio').val(moment(horario).format("HH:mm"));
           $('#data').datepicker('setDate', moment(horario).format("DD/MM/YYYY")).focus();
          
           
           idEventoClick = null;
           
           var diaClick = moment(info.start);
           
           diaGlobal = diaClick;
           calcularTermino();
       },
       eventLimit: true, // allow "more" link when too many events
       eventSources: [

    	   
           // your event source
           {
               url: `api/agendamentos/listarFullCalendar/${idBarbeiro}`,
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
        visualizarAgendamento(info);

       },
       businessHours: dias ? dias : {
           // days of week. an array of zero-based day of week integers
			// (0=Sunday)
           daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Monday - Thursday

           startTime: '00:00', // a start time (10am in this example)
           endTime: '23:59', // an end time (6pm in this example)
           
           //se não tiver o horário de atendimento, deixar tudo disponivel 
       }
   });

   calendar.render();
   
   waitingDialog.hide();
   //eventoData();

}




function listarServicos(){
	
	 $.ajax({
	        type: "GET",
	        url: `api/servicos/${getIdBarbearia(getToken())}`,
	        cache: false,
	        beforeSend: function (request) {
				request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
	        error: function error(data) {
	        	lancarToastr('error','Sem barbearia na sessão.');

	        },
	        success: function(data) {
	        	console.log(data)
	        	data.forEach(function(e){
	        		
	        		let valor = e.valor;
	        		if(e.promocao && e.promocao.status){
	        			
	        			valor = e.promocao.valor 
	        		}
	        		console.log(valor)
	        		  $("#servicos")
	        		  .append(`<option value='${e.id}' preco='${valor}' tempo='${e.tempo}' >${e.descricao} (R$${valor.toFixed(2)})  </option>`);
	        	})
	        	   
	                for (var i in data) {
	                	
	                  
	                }
	                
	        }
	    });
}

function calcularValor(){
	
	var total = 0;
    
    
  	 $('option:selected', '#servicos').each(function(e,i){
  		
  		 let preco = $(this).attr('preco');
  		 total = total + parseInt(preco) ;
  	});
  	 
     $('#valor').val(total);
	
	
}

function calcularTermino(){
	
	var durations  = [];
  	 
  	 let inicio = $("#horarioInicio").val();
  	 
  	 durations.push(inicio);
  	 
  	 
     	 $('option:selected', '#servicos').each(function(e,i){
     		 let tempo = $(this).attr('tempo');
     		durations.push(tempo);
     	});
     	 

      const totalDurations = durations.slice(1)
          .reduce((prev, cur) => moment.duration(cur).add(prev),
              moment.duration(durations[0]))

       
      $("#horarioTermino").val(moment.utc(totalDurations.asMilliseconds()).format("HH:mm"));
      
       $('#form-agendamento').validate().element("#horarioTermino");
       $('#form-agendamento').validate().element("#horarioInicio");
	
}

function autoCompleteCliente(){
	

    $("#cliente").autocomplete({
        minLength: 0,
        source: function(request, response) {
        	let nome = $("#cliente").val();
        	console.log(nome)
            $.ajax({
                type: "GET",
                url: `api/clientes/autocomplete/${nome}`,
                dataType: "json",
                beforeSend: function (request) {
        			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
        	    },
                error: function error(data) {
                    console.log(data);
                },
                success: function success(data) {
                	console.log(data)
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
        	
           if (ui.item == null) {
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

	
    $(".nav-link").on("click", function() {
        $(".nav-underline").find(".active").removeClass("active");
        $(this).addClass("active");

        $('#calendar').html('');
        $("#form-agendamento")[0].reset();
    	$(".erro-agendamento").hide();
        
        carregarHorarioAtendimento()
        //carregarAgenda(dias);

    });
}


function carregarHorarioAtendimento() {

    var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
    var inicioAtendimento;
    var finalAtendimento;
    var dias = new Array();
    var result = new Array();

    waitingDialog.show('Carregando...');
    $.ajax({
        type: "GET",
        url: `api/funcionarios/buscarHorarioAtendimento/${idBarbeiro}`,
        cache: false,
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
            console.log(data)
            lancarToastr('error', data.responseJSON.message);
        },
        success: function(data) {
            console.log(data)
        	diasGlobal = data;
            if (data.length > 0) {
                data.forEach(function(element) {

                	
                    if (element.aberto) {
                    	
                    	if(element.almoco){
                    		
                    		dias.push({
                                daysOfWeek: [element.dia]==7?[0]:[element.dia],
                                startTime: element.entrada,
                                endTime: element.saidaAlmoco,
                                almoco : element.almoco
                            });
                    		
                    		dias.push({
                                daysOfWeek: [element.dia]==7?[0]:[element.dia],
                                startTime: element.entradaAlmoco,
                                endTime: element.saida,
                                almoco : element.almoco
                            });
                    		
                    	}else{
                    		console.log(element)
                    		dias.push({
                                daysOfWeek: [element.dia]==7?[0]:[element.dia],
                                startTime: element.entrada,
                                endTime: element.saida,
                                almoco : element.almoco
                            });
                    		
                    	}
                    	
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
    setTimeout(function() {
        carregarAgenda(dias);
    }, 1000);
}

function validarForm(){
	
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
	
	

	
	jQuery.validator.addMethod("validarHorarioComercial", function(value, element,parametros) {
		if(diasGlobal.length<1) return true;
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
		
		let horarioInicio = moment($(`${parametros[0]} #horarioInicio`).val(),'h:mm');
		let horarioTermino = moment($(`${parametros[0]} #horarioTermino`).val(),'h:mm');
		
	
		return horarioTermino.isAfter(horarioInicio);
		
	},'Horário termino não pode ser antes ou igual ao horário de inicio.');
	
     jQuery.validator.addMethod("validarAgora", function(value, element,parametros) {
    	 
    	 
    	 let agora = moment(new Date());
    	 
    	 var dataEscolhida = moment(formataStringData($('#data').val()));

    	 var month = dataEscolhida.format('M');
    	 var day   = dataEscolhida.format('D');
    	 var year  = dataEscolhida.format('YYYY');
    	 
    	 $(`#horarioInicio`).trigger('change');
    			let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),day,month,year));
 
    			if(horarioInicio.isBefore(agora)){
    				 return false;
    				
    			 }else{
    				 return true;
    			 }
		
	},'Horário inicio não pode ser antes ou igual agora.');
	
	
	
	

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
                validarAgora : true,
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
 
    
    waitingDialog.show('Salvando agendamento ...');
    $.ajax({
        type: verbo,
        url: `/api/agendamentos`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendInfo),
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
        	fecharModalLoading();
        	
        	
            if(data.status == 400){
            	$(".erro-agendamento").show();
            	$(".erro-agendamento > div > strong").text(data.responseJSON.message).focus();
            }else{
            	lancarToastr("error", "Erro ao salvar agendamento");
            }
            

        },
        // dataType: 'json',
        success: function success(data) {
        	lancarToastr("success", `Agendamento ${acao == "cadastrar" ? "salvo" :  "editado"} com sucesso.`,true);
        }
    });

   
}

function visualizarAgendamento(info) {


    
    $('#detalhes').modal('show');
    $.ajax({
        type: "PATCH",
        url: `api/agendamentos/${info.event.id}`,
        cache: false,
	    async: false,
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
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

            console.log(data.status)
            if (data.status == 'AGENDADO') {
                $(".btn-cancelar-agendamento").attr('idAgendamento', data.id);
                $(".btn-cancelar-agendamento").show();
                $(".btn-concluido").attr('idAgendamento', data.id);
                $(".btn-concluido").show();
                $(".btn-editar").show();
                $(".btn-editar").attr('idAgendamento', data.id);

                if(moment(data.dataHorarioInicio).isAfter(moment())){
                    console.log("to aqui")
                    $(".btn-concluido").removeAttr('idAgendamento');
                    $(".btn-concluido").hide();
                    
                }else{
                    console.log("to aqui")
                    $(".btn-concluido").attr('idAgendamento', data.id);
                    $(".btn-concluido").show();
                }
            } else {
            	$(".btn-cancelar-agendamento").removeAttr('idAgendamento');
            	$(".btn-cancelar-agendamento").hide();
            	$(".btn-concluido").removeAttr('idAgendamento');
            	$(".btn-concluido").hide();
            	$(".btn-editar").removeAttr('idAgendamento');
            	$(".btn-editar").hide();
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
	
	$('#servicos').on("change", function(e) {

        var Elem = e.target;
		
	    calcularValor();
	    calcularTermino();
	       
		

    });
	
	$('#horarioInicio').on("blur", function(e) {

		calcularTermino();
		
		/*var Elem = e.target;

		if (Elem.nodeName=='td'){
			console.log('aqui')
			 calcularTermino();
	       }*/
		
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
    		$("#cliente").removeAttr('idCliente');
    		$("#cliente").autocomplete("destroy");
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
        url: `api/agendamentos/${id}`,
        cache: false,
	    async: false,
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
        	fecharModalLoading();
        	lancarToastr('error',data)
            console.log(data)

        },
        success: function(data) {
        	var dia = new Date(data.dataHorarioInicio);
        	$(".btn-salvar").attr('acao', 'editar');
            $("#horarioInicio").val(pegarHorario(data).inicio);
            $("#horarioTermino").val(pegarHorario(data).fim);
        	$('#data').datepicker('setDate', moment(diaGlobal).format("DD/MM/YYYY"))
        	$('.form-titulo').html('Editar agendamento');
        	$('.form-agendamento').addClass('form-select-agendamento');
        	$('#detalhes').modal('hide');
            $("#cliente").val(data.cliente.nome);
            $("#cliente").attr('idCliente', data.cliente.id);
            var servicos = [];
            data.servicos.forEach(function(e){
            	 
            	 servicos.push(e.id);
            });
            $('#servicos').val(servicos).trigger('change');
            $("#valor").val(data.valor);
            
            $('#data').val(moment(dia).format('DD/MM/YYYY'));
            $("#obs").val(data.observacao);
            $(".btn-salvar").attr('idAgendamento', data.id);
            
            
   		    
   		   
        }
    });
}

function alterarStatus(id, status) {

	
    var sendInfo = {
        id: id,
        status: status
    }
    
    $('#detalhes').modal('hide');
    waitingDialog.show('Carregando...');
    $.ajax({
        type: 'POST',
        url: `/api/agendamentos/alterarStatus`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendInfo),
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
        	fecharModalLoading();
            console.log(data)
            lancarToastr("error", data.responseJSON.message);

        },
        // dataType: 'json',
        success: function success(data) {
            $('#modal-servico').modal('hide');
            lancarToastr("success", "Status alterado com sucesso.",true);


        }
    });
}



function verificarHorarioComercial(parametros){
	
	let resposta = [];
	
    const agora = moment(new Date());
	
	let horarioComercial = pegarHorarioComercial();//pega os horarios do dia que está no input de data 

	pegarDiaGlobal();
	
	
    if(!horarioComercial.aberto){
    	resposta.push(false);
		resposta.push(`Dia ${moment(diaGlobal).format('DD/MM/YYYY')} está fechado.`);
		return resposta;
	}
	
    
    var dataEscolhida = moment(formataStringData($('#data').val()));

	
    
    var month = dataEscolhida.format('M');
    var day   = dataEscolhida.format('D');
    var year  = dataEscolhida.format('YYYY');
    
    let entrada =  moment(getDateFromHours(horarioComercial.entrada,day,month,year));
    let saida = moment(getDateFromHours(horarioComercial.saida,day,month,year));
    
    
	
	if(horarioComercial.almoco){	
	
    
    let entradaAlmoco = moment(getDateFromHours(horarioComercial.entradaAlmoco,day,month,year));
    let saidaAlmoco = moment(getDateFromHours(horarioComercial.saidaAlmoco,day,month,year));
    
    var saidaAlmocoAux = getDateFromHours(horarioComercial.saidaAlmoco,day,month,year)
    var milliseconds = Date.parse(saidaAlmocoAux)
    milliseconds = milliseconds - (1 * 60 * 1000)
    saidaAlmocoAux = new Date(milliseconds)
    
    var entradaAlmocoAux = getDateFromHours(horarioComercial.entradaAlmoco,day,month,year)
    var milliseconds = Date.parse(entradaAlmocoAux)
    milliseconds = milliseconds + (1 * 60 * 1000)
    entradaAlmocoAux = new Date(milliseconds)
    
 
	if(parametros[0]=='inicio'){
		
		
		$(`#horarioInicio`).trigger('change');
		let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),day,month,year));
		
		// se for antes de agora
		if(horarioInicio.isBefore(agora)){
			 resposta.push(false);
			 resposta.push(`Você não pode marcar um horário passado`);
			
		 }else if (horarioInicio.isBefore(entrada) || horarioInicio.isAfter(saida)){
			 // depois do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${entrada.format('HH:mm')} ás ${moment(saidaAlmocoAux).format('HH:mm')} e ${moment(entradaAlmocoAux).format('HH:mm')}
					 ás ${saida.format('HH:mm')}`);
		 }else if(!horarioInicio.isBefore(saidaAlmoco) && !horarioInicio.isAfter(entradaAlmoco)){
			// antes do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${entrada.format('HH:mm')} ás ${moment(saidaAlmocoAux).format('HH:mm')} e ${moment(entradaAlmocoAux).format('HH:mm')}
					 ás ${saida.format('HH:mm')}`);
		 }else{
			 
			 resposta.push(true);
		 }
	}else{
		
		let horarioTermino = moment(getDateFromHours($(`#horarioTermino`).val(),day,month,year));
		
		
		
		if(horarioTermino.isBefore(agora)){
			 resposta.push(false);
			 resposta.push(`Você não pode marcar um horário passado`);
			
		 }else if (horarioTermino.isBefore(entrada) || horarioTermino.isAfter(saida)){
			 // depois do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioTermino.format('DD/MM/YY')}
					  das ${entrada.format('HH:mm')} ás ${moment(saidaAlmocoAux).format('HH:mm')} e ${moment(entradaAlmocoAux).format('HH:mm')}
					 ás ${saida.format('HH:mm')}`);
		 }else if(!horarioTermino.isBefore(saidaAlmoco) && !horarioTermino.isAfter(entradaAlmoco)){
			// antes do horario comercial de determinado dia
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioTermino.format('DD/MM/YY')}
					  das ${entrada.format('HH:mm')} ás ${moment(saidaAlmocoAux).format('HH:mm')} e ${moment(entradaAlmocoAux).format('HH:mm')}
					 ás ${saida.format('HH:mm')}`);
		 }else{
			 
			 resposta.push(true);
		 }
	}
	
	return resposta;
	
	}else{
		
	    
		if(parametros[0]=='inicio'){
			
			
			let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),day,month,year));
			
			
			// se for antes de agora
			if(horarioInicio.isBefore(agora)){
				 resposta.push(false);
				 resposta.push(`Você não pode marcar um horário passado`);
				
			 }else if (horarioInicio.isBefore(entrada) || horarioInicio.isAfter(saida)){
				 // depois do horario comercial de determinado dia
				 resposta.push(false);
				 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
						  das ${entrada.format('HH:mm')} ás ${saida.format('HH:mm')}`);
			 }else{
				 
				 resposta.push(true);
			 }
		}else{
			
			let horarioTermino = moment(getDateFromHours($(`#horarioTermino`).val(),day,month,year));
			
			
			if(horarioTermino.isBefore(agora)){
				 resposta.push(false);
				 resposta.push(`Você não pode marcar um horário passado`);
				
			 }else if (horarioTermino.isBefore(entrada) || horarioTermino.isAfter(saida)){
				 // depois do horario comercial de determinado dia
				 resposta.push(false);
				 resposta.push(`Horário atendimento dia ${horarioTermino.format('DD/MM/YY')}
				  das ${entrada.format('HH:mm')} ás ${saida.format('HH:mm')}`);
			 }else{
				 
				 resposta.push(true);
			 }
		}
		
		return resposta;

	}
	
}


function verficarAgendamentos(parametros){
	
    var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
    
    var agendamentosDia = [];
    pegarDiaGlobal();
    console.log(diaGlobal);
    
	$.ajax({
	       type: "GET",
	       url: `api/agendamentos/buscarPorData/${diaGlobal.format('YYYY-MM-DD')}/${idBarbeiro}`,
	       cache: false,
	       async: false,
	       beforeSend: function (request) {
				request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
		    },
	       error: function error(data) {
	           console.log(data);
	       },
	       success: function(data) {
	       	agendamentosDia = data;
	       }
	     });
	
	let resposta = [];
	
	if(agendamentosDia.length<1) resposta.push(true);
	
	let diaClick = diaGlobal.date();
	
	let format = 'hh:mm'
		
    var dataEscolhida = moment(formataStringData($('#data').val()));
	console.log(dataEscolhida)
    var month = dataEscolhida.format('M');
    var day   = dataEscolhida.format('D');
    var year  = dataEscolhida.format('YYYY');

   if($('.btn-salvar').attr('acao')=="editar"){
		
		
		agendamentosDia.forEach(function(element,i,array){
			
			if(element.id == idEventoClick){
				delete array[i]
			}
			
		});
	}

	
	if(parametros[0] =='inicio'){
		
		let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),day,month,year));
		
		agendamentosDia.forEach(function(element){
			
			let inicioAgendamento = moment(getDateFromHours(moment(element.dataHorarioInicio).format('HH:mm'),day,month,year));
			
			let terminoAgendamento =  moment(getDateFromHours(moment(element.dataHorarioFim).format('HH:mm'),day,month,year));

			
			if(horarioInicio.isBetween(tirar1Minuto(inicioAgendamento),add1Minuto(terminoAgendamento))){
				resposta.push(false);
				resposta.push(`Dia ${diaGlobal.format('DD/MM/YYYY')} já tem um agendamento marcado de ${add1Minuto(inicioAgendamento).format('HH:mm')} ás ${tirar1Minuto(terminoAgendamento).format('HH:mm')}.`);
				return;
			}
			
		});
		
		resposta.push(true);
	}else if(parametros[0] =='termino'){
		
		   let horarioTérmino = moment(getDateFromHours($(`#horarioTermino`).val(),day,month,year));
		
           agendamentosDia.forEach(function(element){
			
			let inicioAgendamento = moment(getDateFromHours(moment(element.dataHorarioInicio).format('HH:mm'),day,month,year));
			
			let terminoAgendamento =  moment(getDateFromHours(moment(element.dataHorarioFim).format('HH:mm'),day,month,year));

			
			if(horarioTérmino.isBetween(tirar1Minuto(inicioAgendamento),add1Minuto(terminoAgendamento))){
				resposta.push(false);
				resposta.push(`Dia ${diaGlobal.format('DD/MM/YYYY')} já tem um agendamento marcado de ${add1Minuto(inicioAgendamento).format('HH:mm')} ás ${tirar1Minuto(terminoAgendamento).format('HH:mm')}.`);
				return;
			}
			
		});
           
       resposta.push(true);
		
	}
	
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
	     'Sun' : 7,
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
	
	if(diasGlobal){
		diasGlobal.forEach(function(e){
			
	  	if(e.dia == getNumeroDia(diaGlobal.format("ddd"))){
	  		
	  		horarioComercial = e;
	  	}
	  });
	}
	
	
  return horarioComercial;
 
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

