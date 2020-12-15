$(document).ready(function() {

	
	
	var diasGlobal = [];
	var diaGlobal;
	var agendamentosDiaClick = [];
	var idEventoClick = null;

    listarBarbeiros();
    listarServicos(false);
    listarServicos(true);
    autoCompleteCliente();
    validarForm();
    btns();
    $('#form-editar-agendamento #servicos').selectpicker();
    
   
    
});

function abrirHorarioAtendimento() {

    $('#modalHorarioAtendimento').modal('show');
    var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
    $.ajax({
        type: "GET",
        url: `funcionarios/buscarHorarioAtendimento/${idBarbeiro}`,
        cache: false,
        error: function error(data) {
            console.log(data);
        },
        success: function(data) {
        	
            function diaIntParaString(dia) {
                var dias = {

                    0: "domingo",
                    1: "segunda",
                    2: "terca",
                    3: "quarta",
                    4: "quinta",
                    5: "sexta",
                    6: "sabado"

                };
                return (dias[dia] || console.log(dia + 'inválido'));
            }

            if (data.length > 0) {
                data.forEach(function(element) {
                	
                    if (element.aberto) {

                        $(`#${diaIntParaString(element.dia)}Switch`).prop('checked', true);
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioInicioEspecial")
                            .val(moment(getDateFromHours(element.inicio)).format('HH:mm'));
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioInicioEspecial").prop("disabled", false);
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioTerminoEspecial")
                            .val(moment(getDateFromHours(element.fim)).format('HH:mm'));
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").prop("disabled", false);
                    } else {

                        $(`#${diaIntParaString(element.dia)}Switch`).prop('checked', false);
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioInicioEspecial").val('');
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioInicioEspecial").prop("disabled", true);
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").val('');
                        $(`#${diaIntParaString(element.dia)}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").prop("disabled", true);
                    }

                });
            } else {
                var dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

                dias.forEach(function(element) {
                    $(`#${element}Switch`).prop('checked', false);
                    $(`#${element}Switch`).parent().parent().parent().find(".horarioInicioEspecial").val('');
                    $(`#${element}Switch`).parent().parent().parent().find(".horarioInicioEspecial").prop("disabled", true);
                    $(`#${element}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").val('');
                    $(`#${element}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").prop("disabled", true);

                });
            }
        }
    });
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

function carregarAgenda(dias) {
	
	 $('.modal-loading').modal('hide');
    var calendarEl = document.getElementById('calendar');
    let idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
    
    var calendar = new FullCalendar.Calendar(calendarEl, {
    	
        locale: 'pt-br',
        plugins: ['bootstrap', 'interaction', 'dayGrid', 'timeGrid', 'list'],
        themeSystem: "bootstrap",
        customButtons: {
            horarioAtendimento: {
                bootstrapFontAwesome: 'far fa-clock',
                click: function() {
                    abrirHorarioAtendimento();
                }
            }
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,horarioAtendimento'
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
        // defaultDate: '2020-02-12', //data para inciar
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectMirror: true,
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
        	
       var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
        	
       $.ajax({
        type: "GET",
        url: `api/agendamento/buscarPorData/${dia}/${idBarbeiro}`,
        cache: false,
        error: function error(data) {
            console.log(data);
        },
        success: function(data) {

        	agendamentosDiaClick = data;
        }
    });
        	
        	
            $('#cadastrar').modal('show');
            $('#servicos').selectpicker();

            var horario = info.start;

            $('#horarioInicio').val(moment(horario).format("HH:mm"));
            $(".btn-salvar").attr("acao", "cadastrar");
            
            idEventoClick = null;
            
            var diaClick = moment(info.start);
            diasGlobal = dias;
            diaGlobal = diaClick;

        },
        dateClick: function(info) {

        	console.log(moment(info.date).format('DD/MM/YYYY'))
            $('#exampleModalLabel').html(`Novo agendameto ${moment(info.date).format('DD/MM/YYYY')}`);
        	console.log($('#exampleModalLabel'))
            $('#exampleModalLabel').attr('dia', info.dayEl.dataset.date);

        },
        eventLimit: true, // allow "more" link when too many events
        events: [

            {
                start: '2020-05-21T15:00:00',
                end: '2020-05-21T16:00:00',
                rendering: 'background'
              }

          ],
          
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
        	var idBarbeiro = $(".nav-underline").find(".active").attr('idBarbeiro');
        	idEventoClick = info.event.id;
        	 var dia = moment(info.el.fcSeg.start).format('YYYY-MM-DD');
        	var diaClick = moment(info.el.fcSeg.start);
            diasGlobal = dias;
            diaGlobal = diaClick;
            
            $.ajax({
                type: "GET",
                url: `api/agendamento/buscarPorData/${dia}/${idBarbeiro}`,
                cache: false,
                error: function error(data) {
                    console.log(data);
                },
                success: function(data) {

                	agendamentosDiaClick = data;
                }
            });
            visualizarAgendamento(info);

        },
        businessHours: dias ? dias : {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Monday - Thursday

            startTime: '00:00', // a start time (10am in this example)
            endTime: '23:59', // an end time (6pm in this example)
        }
    });

    calendar.render();
}

function listarServicos(editar) {
	
    $.ajax({
        type: "GET",
        url: "api/servicos/listar",
        cache: false,
        error: function error(data) {

        	lancarToastr('error','Sem barbearia na sessão.');

        },
        success: function(data) {

            if (!editar) {

                for (var i in data) {
                    $("#servicos").append(`<option value='${data[i].id}' preco='${data[i].valor}' tempo='${data[i].tempo}' >${data[i].descricao}</option>`).selectpicker('refresh');

                   
                }

                calcularValor(false);
                calcularTermino(false);
            } else {
                for (var i in data) {
                    $("#form-editar-agendamento #servicos").append(`<option value='${data[i].id}'
                     preco='${data[i].valor}' tempo='${data[i].tempo}' >${data[i].descricao}</option>`).selectpicker('refresh');
                    
                   // $("#form-editar-agendamento #servicos").append('<option value=' +data[i].id + '>' + data[i].descricao +'</option>').selectpicker('refresh');
                    
                    // $("#servicos").append('<option value=' +
                    // data[i].id + '>' + data[i].descricao +
                    // '</option>').selectpicker('refresh');
                }

                calcularValor(true);
                calcularTermino(true);
            }

        }
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
            if (ui.item == null) {
                $(e.target)
                    .siblings(".invalid")
                    .remove();
                $(e.target)
                    .parent()
                    .addClass("state-error")
                    .append('<em class="invalid">Nome inválido</em>');
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
        
        carregarHorarioAtendimento();

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
                carregarAlert('#alert-click-invalido','Barbeiro sem horário de atendimento definido',true);
            }else{
            	carregarAlert('#alert-click-invalido','Barbeiro sem horário de atendimento definido',true);
            }

            if (dias.length < 1) {
                lancarToastr('error', );
                dias = null;
            }
        }
    });
    
    $('.modal-loading').modal('show');
    setTimeout(function() {
        carregarAgenda(dias);
    }, 1000);
}


function validarForm() {
	
	 
	
	jQuery.validator.setDefaults({
		errorElement: 'div',
	    errorPlacement: function (error, element) {
	        error.addClass('invalid-feedback');
	        $(element.parent().children()[1]).text(error[0].innerText);
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
                validarHorarioComercial : ['inicio','cadastrar'],
                validarHorarioAgendamentos : ['inicio','cadastrar']
            },
            horarioTermino :{
            	required: true,
            	validarHorarioComercial : ['termino','cadastrar'],
                validarHorarioAgendamentos : ['termino','cadastrar'],
                validarHorarioTermino :  ['#form-agendamento']
            }
        },
        messages: {
        	cliente: {
                required: "Nome do cliente obrigatório."
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

        	enviarForm($(".btn-salvar").attr("acao"));
        	
        }
    });

    $("#form-editar-agendamento").validate({

    	 rules: {
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
                 validarHorarioComercial : ['inicio','editar'],
                 validarHorarioAgendamentos : ['inicio','editar']
             },
             horarioTermino :{
             	required: true,
             	validarHorarioComercial : ['termino','editar'],
                 validarHorarioAgendamentos : ['termino','editar'],
                 validarHorarioTermino : ['#form-editar-agendamento']
             }
         },
         messages: {
         	cliente: {
                 required: "Nome do cliente obrigatório."
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
            enviarForm('editar', $(".btn-salvar-edicao").attr("idAgendamento"));

        }

    });
    var dias = [{
        segunda: 1
    }, {
        terca: 2
    }, {
        quarta: 3
    }, {
        quinta: 4
    }, {
        sexta: 5
    }, {
        sabado: 6
    }, {
        domingo: 0
    }];
    $("#form-horario-atendimento").validate({

        // Rules for form validation
        rules: validarHorario(dias),
        submitHandler: function submitHandler() {
            var horarioAtendimento = [];

            dias.forEach(function(element) {
                if ($(`#${Object.keys(element)}Switch`).is(":checked")) {


                    horarioAtendimento.push({
                        dia: Object.values(element)[0],
                        aberto: true,
                        inicio: $(`#${Object.keys(element)}Switch`).parent().parent().parent().find(".horarioInicioEspecial").val(),
                        fim: $(`#${Object.keys(element)}Switch`).parent().parent().parent().find(".horarioTerminoEspecial").val(),
                        idFuncionario: $(".nav-underline").find(".active").attr('idBarbeiro')
                    });

                } else {

                    horarioAtendimento.push({
                        dia: Object.values(element)[0],
                        aberto: false,
                        idFuncionario: $(".nav-underline").find(".active").attr('idBarbeiro')
                    });
                }

            });


            console.log(horarioAtendimento)

            $.ajax({
                type: 'POST',
                url: `funcionarios/horarioAtendimento`,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(horarioAtendimento),
                error: function error(data) {


                    lancarToastr("error", data.responseJSON)

                },
                // dataType: 'json',
                success: function success(data) {


                    lancarToastr("success", "Horários de atendimento salvo.")

                }
            });


        }



    });

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



function enviarForm(acao, id) {

	
    if (id) {
    	
    	var servicoSelect = $('#form-editar-agendamento #servicos').val();
    	var servicos = [];
    	servicoSelect.forEach(function(e){
    		servicos.push({id:e});
    	});
    	
    	
        var sendInfo = {
            id: id,
            cliente: {id:$("#form-editar-agendamento #cliente").attr('idCliente'),nome:$("#form-editar-agendamento #cliente").val()},
            idFuncionario: $(".nav-underline").find(".active").attr('idBarbeiro'),
            servicos: servicos,
            dataHorarioInicio: $("#tituloModalDetalhes").attr('dia') + ' ' + $("#form-editar-agendamento #horarioInicio").val(),
            dataHorarioFim: $("#tituloModalDetalhes").attr('dia') + ' ' + $("#form-editar-agendamento #horarioTermino").val(),
            valor: $('#form-editar-agendamento #valor').val().replace(",","."),
            observacao: $("#form-editar-agendamento #obs").val()
        }
        var verbo = 'PUT'
    } else {

    	var servicoSelect = $('#servicos').val();
    	var servicos = [];
    	servicoSelect.forEach(function(e){
    		servicos.push({id:e});
    	});
    	
        var sendInfo = {
            cliente: {id:$("#cliente").attr('idCliente'),nome:$("#cliente").val()},
            idFuncionario: $(".nav-underline").find(".active").attr('idBarbeiro'),
            servicos:servicos,
            dataHorarioInicio: $("#exampleModalLabel").attr('dia') + ' ' + $("#horarioInicio").val(),
            dataHorarioFim: $("#exampleModalLabel").attr('dia') + ' ' + $("#horarioTermino").val(),
            valor: $('#valor').val().replace(",","."),
            observacao: $("#obs").val()
        }

        var verbo = 'POST'
    }
 


    $.ajax({
        type: verbo,
        url: `/api/agendamento/${acao}`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendInfo),
        error: function error(data) {
        	fecharModalLoading();
            console.log(data)
            lancarToastr("error", data.responseJSON);

        },
        // dataType: 'json',
        success: function success(data) {
            $('#modal-servico').modal('hide');
            lancarToastr("success", `Agendamento ${acao == "cadastrar" ? "salvo" : "editado"} com sucesso.`);

            $('#form-agendamento')[0].reset();

        }
    });
}


function calcularValor(editar) {

    if (!editar) {
        $('#servicos').on("change", function() {


        var total = 0;
        	
       	 $('option:selected', this).each(function(e,i){
       		 let preco = $(this).attr('preco');
       		 total = total + parseInt(preco) ;
       	});

            $('#valor').val(total);

        });
    } else {
        $('#form-editar-agendamento #servicos').on("change", function() {

        	var total = 0;
        	
        	 $('option:selected', this).each(function(e,i){
        		 let preco = $(this).attr('preco');
        		 total = total + parseInt(preco) ;
        	});
             
             
        	 $('#form-agendamento #valor').val(total);
            $('#form-editar-agendamento #valor').val(total);
        });
    }
}

function calcularTermino(editar) {

    if (!editar) {
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
    } else {
        $('#form-editar-agendamento #servicos').on("change", function() {

        	
              var durations  = [];
        	 
        	 let inicio = $("#form-editar-agendamento #horarioInicio").val();
        	 
        	 durations.push(inicio);
        	 
        	 
           	 $('option:selected', this).each(function(e,i){
           		 let tempo = $(this).attr('tempo');
           		durations.push(tempo);
           	});
           	 
            
            const totalDurations = durations.slice(1)
                .reduce((prev, cur) => moment.duration(cur).add(prev),
                    moment.duration(durations[0]))

            $("#form-editar-agendamento #horarioTermino").val(moment.utc(totalDurations.asMilliseconds()).format("HH:mm"));

        });
    }


}




function visualizarAgendamento(info) {


    $('#tituloModalDetalhes').attr('dia', moment(info.event.start).format("YYYY-MM-DD"));
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
}

function montarLabelServicos(element, index, array) {

    if (array.length > 1) $("#tituloServico").html('Serviços : ')
    if (index > 0) {
        $("#labelServicos").append(` - ${element.descricao}`);
    } else {
        $("#labelServicos").text(`${element.descricao}`);
    }

}

function btns() {


    $(".btn-editar").on('click', function() {

        $("#visualizarDetalhes").slideUp();
        $("#form-editar-agendamento").slideToggle();
        $(".btn-cancelar").show();
        $(".btn-salvar-edicao").show();
        $(this).hide();
        iniciarEdicao($(".btn-editar").attr('idAgendamento'));
    });

    $(".btn-cancelar").on('click', function() {

        $("#form-editar-agendamento").slideUp();
        $("#visualizarDetalhes").slideToggle();
        $(".btn-editar").show();
        $(".btn-salvar-edicao").hide();
        $(this).hide();
    });

    $(".btn-fechar-modal").on('click', function() {

        if ($("#form-editar-agendamento").is(':visible')) {
            $("#form-editar-agendamento")[0].reset();
            $(".btn-editar").show();
            $(".btn-salvar-edicao").hide();
            $('.btn-cancelar').hide();
            $("#form-editar-agendamento").slideUp();
            $("#visualizarDetalhes").slideToggle();
        } else {
            $("#form-editar-agendamento")[0].reset();
            $(".btn-editar").show();
            $(".btn-salvar-edicao").hide();
            $('.btn-cancelar').hide();
        }

    });

    $(".btn-fechar").on('click', function() {

        if ($("#form-editar-agendamento").is(':visible')) {
            $("#form-editar-agendamento")[0].reset();
            $(".btn-editar").show();
            $(".btn-salvar-edicao").hide();
            $('.btn-cancelar').hide();
            $("#form-editar-agendamento").slideUp();
            $("#visualizarDetalhes").slideToggle();
        } else {
            $("#form-editar-agendamento")[0].reset();
            $(".btn-editar").show();
            $(".btn-salvar-edicao").hide();
            $('.btn-cancelar').hide();
        }

    });

    $('.btn-cancelar-agendamento').on('click', function() {

        alterarStatus($(this).attr('idAgendamento'), 'CANCELADO');

    });

    $('.btn-concluido').on('click', function() {

        alterarStatus($(this).attr('idAgendamento'), 'CONCLUIDO');

    });

    $(".horario-comercial").on('change', function() {
        if ($(this).is(":checked")) {
            $(this).parent().parent().parent().find(".horarioInicioEspecial").prop("disabled", false);
            $(this).parent().parent().parent().find(".horarioTerminoEspecial").prop("disabled", false);
        } else {
            $(this).parent().parent().parent().find(".horarioInicioEspecial").prop("disabled", true);
            $(this).parent().parent().parent().find(".horarioInicioEspecial").val('')
            $(this).parent().parent().parent().find(".horarioTerminoEspecial").prop("disabled", true);
            $(this).parent().parent().parent().find(".horarioTerminoEspecial").val('')
        }
    });
    
    $("#cli-nao-cadastrado").on("change",function(){
    	
    	if($(this).is(":checked")){
    		console.log('show')
    		$("#cliente").removeAttr('idCliente');
    		$("#cliente").autocomplete("destroy");
    		$("#cliente").val('');
    		$("#cliente").removeAttr('idCliente');
    		$('#cliente')
            .parent()
            .removeClass("state-error");
        $('#cliente')
            .siblings(".invalid")
            .remove();
    		
    	}else{
    		autoCompleteCliente();
    		
    	}
    	
    });
    
    
    $('#cadastrar').on('hidden.bs.modal', function(e) {
    	 $("#form-agendamento")[0].reset();
    	 
    	 $('#servicos option').each(function(index, option) {
    		    console.log(option);
    		});
      })
    

}

function iniciarEdicao(id) {
    console.log(id)
    $.ajax({
        type: "PATCH",
        url: `api/agendamento/buscarPorId/${id}`,
        cache: false,
        error: function error(data) {

            console.log(data)

        },
        success: function(data) {
            console.log(data)
            $("#form-editar-agendamento #cliente").val(data.cliente.nome);
            $("#form-editar-agendamento #cliente").attr('idCliente', data.cliente.id);
            var servicos = [];
            data.servicos.forEach(function(e){
            	 servicos.push(e.id);
            });
            
            $('#form-editar-agendamento #servicos').selectpicker('val', servicos);
            $("#form-editar-agendamento #valor").val(data.valor);
            $("#form-editar-agendamento #horarioInicio").val(pegarHorario(data).inicio);
            $("#form-editar-agendamento #horarioTermino").val(pegarHorario(data).fim);
            $("#form-editar-agendamento #obs").val(data.observacao);
            $(".btn-salvar-edicao").attr('idAgendamento', data.id);

        }
    });
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

function carregarAlert(id,msg,fechar){
	
	 $(id).slideDown();
	  
	  $(`${id} > strong`).html(msg);
	 
	 if(fechar){
		 setTimeout(function(){ $(id).slideUp(); }, 3000);
	 }
     
	
}



function verificarHorarioComercial(parametros){
	
    const agora = moment(new Date(), "YYYY-MM-DD", true);
	
	let horarioComercial = pegarHorarioComercial();
	let diaClick = diaGlobal.date();
	let resposta = [];
	
	
	let inicioHorarioComercial = moment(getDateFromHours(horarioComercial.startTime,diaClick),"YYYY-MM-DD", true);
	let fimHorarioComercial = moment(getDateFromHours(horarioComercial.endTime,diaClick),"YYYY-MM-DD", true);
	
	var formulario ; 

	if(parametros[0]=='inicio'){
		
		let horarioInicio = moment(getDateFromHours($(`#horarioInicio`).val(),diaClick),"YYYY-MM-DD", true);
		
		

		//se for antes de agora
		if(horarioInicio.isBefore(agora)){
			 resposta.push(false);
			 resposta.push(`Você não pode marcar um horário passado`);
			 
		 }else if (horarioInicio.isAfter(fimHorarioComercial)){
			 //depois do horario comercial de determinado dia 
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else if(horarioInicio.isBefore(inicioHorarioComercial)){
			//antes do horario comercial de determinado dia 
			 resposta.push(false);
			 resposta.push(`Horário atendimento dia ${horarioInicio.format('DD/MM/YY')}
					  das ${moment(getDateFromHours(horarioComercial.startTime)).format('HH:mm')}
					 ás ${moment(getDateFromHours(horarioComercial.endTime)).format('HH:mm')}`);
		 }else{
			 
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


function verficarAgendamentos(parametros){
	
	
	
	let diaClick = diaGlobal.date();
	let resposta = [];
	let format = 'hh:mm'
	
	
	agendamentosDiaClick;
	
   if(parametros[1]=='cadastrar'){
		
		formulario = "#form-agendamento";
		
	}else if(parametros[1]=='editar'){
		
		formulario = "#form-editar-agendamento";
		
		agendamentosDiaClick.forEach(function(element,i,array){
			
			if(element.id == idEventoClick){
				delete array[i]
			}
			
		});
	}

	
	if(parametros[0] =='inicio'){
		
		let horarioInicio = moment(getDateFromHours($(`${formulario} #horarioInicio`).val(),diaClick),"YYYY-MM-DD", true);
		
		
		agendamentosDiaClick.forEach(function(element){
			
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
		   let horarioTérmino = moment(getDateFromHours($(`${formulario} #horarioTermino`).val(),diaClick),"YYYY-MM-DD", true);
		
           agendamentosDiaClick.forEach(function(element){
			
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
	
	let horarioComercial;
	
	diasGlobal.forEach(function(e){
  	
  	if(e.daysOfWeek[0]==getNumeroDia(diaGlobal.format("ddd"))){
  		horarioComercial = e ;
  	}
  })   
  
  return horarioComercial;
}


