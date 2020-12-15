$(document).ready(function() {
	
	listarBarbeiros();
	btns();
	validarForm();
	
	$(".nav-link").on("click",function(){
		
		$('.list-barbeiros').find(".active").removeClass("active");
		$(this).addClass('active');
		
		buscarHorarioAtendimento();
	});
	
	
});

function listarBarbeiros() {

	
    $.ajax({
        type: "GET",
        url: `api/funcionarios/listarPorCargo/BARBEIRO/${getIdBarbearia(getToken())}`,
        cache: false,
	    async: false,
        beforeSend: function (request) {
			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
	    },
        error: function error(data) {
        	lancarToastr('error','Sem barbearia na sessão.')
        },
        success: function(data) {
        	console.log(data)
        	data.forEach(function(e,i){
        		 if (i == 0) {
        			 $(".list-barbeiros").append(`<li class="nav-item"><a class="nav-link active" idBarbeiro=${e.id} data-toggle="tab">${e.nome}</a></li>`);
        			 $("#nome-barbeiro").text(e.nome)
                 } else {
                	 $(".list-barbeiros").append(`<li class="nav-item"><a class="nav-link" idBarbeiro=${e.id} data-toggle="tab">${e.nome}</a></li>`);  
                	 }

        	});
        	
        	buscarHorarioAtendimento();
        }
    });
    
    
}

function buscarHorarioAtendimento(){
	
	$("#nome-barbeiro").text($(".nav-link.active").text());
	let idBarbeiro = $(".nav-link.active").attr('idBarbeiro');
	
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
        	
        	$("#form-horario-atendimento")[0].reset();
        	$(`.aberto`).prop("checked", false);
        	$(`.entrada`).prop("disabled", true);
        	$(`.saida`).prop("disabled", true);
        	$(`.entrada-almoco`).prop("disabled", true);
        	$(`.saida-almoco`).prop("disabled", true);
        	$(`.almoco`).prop("disabled", true);
        	
        	
        	if(data.length < 1 )
        	{
        		
        		lancarToastr("warning", 'Barbeiro sem horário de atendimento definido');
        		return;
        		
        	}
        	
        	function diaIntParaString(dia) {
                var dias = {

                    7: "domingo",
                    1: "segunda",
                    2: "terca",
                    3: "quarta",
                    4: "quinta",
                    5: "sexta",
                    6: "sabado"

                };
                return (dias[dia] || console.log(dia + 'inválido'));
            }
        	
        	data.forEach(function(e){
        		
        		$(`.${diaIntParaString(e.dia)}`).find(".aberto").prop('checked', false);
        		$(`.${diaIntParaString(e.dia)}`).find(".entrada").val('').prop("disabled", true);
        		$(`.${diaIntParaString(e.dia)}`).find(".saida").val('').prop("disabled", true);
        		$(`.${diaIntParaString(e.dia)}`).find(".almoco").prop('checked', false).prop("disabled", true);
        		$(`.${diaIntParaString(e.dia)}`).find(".saida-almoco").val('').prop("disabled", true);
        		$(`.${diaIntParaString(e.dia)}`).find(".entrada-almoco").val('').prop("disabled", true);
        		
        		if(e.aberto){
        			$(`.${diaIntParaString(e.dia)}`).find(".aberto").prop('checked', true);
            		$(`.${diaIntParaString(e.dia)}`).find(".entrada").val(moment(getDateFromHours(e.entrada)).format('HH:mm')).prop("disabled", false);
            		$(`.${diaIntParaString(e.dia)}`).find(".saida").val(moment(getDateFromHours(e.saida)).format('HH:mm')).prop("disabled", false);
            		
            		if(e.almoco){
            			$(`.${diaIntParaString(e.dia)}`).find(".almoco").prop('checked', true).prop("disabled", false);
            			$(`.${diaIntParaString(e.dia)}`).find(".saida-almoco").val(moment(getDateFromHours(e.saidaAlmoco)).format('HH:mm')).prop("disabled", false);
                		$(`.${diaIntParaString(e.dia)}`).find(".entrada-almoco").val(moment(getDateFromHours(e.entradaAlmoco)).format('HH:mm')).prop("disabled", false);
            		}else{
            			$(`.${diaIntParaString(e.dia)}`).find(".almoco").prop('checked', false).prop("disabled", false);
            			$(`.${diaIntParaString(e.dia)}`).find(".saida-almoco").val('').prop("disabled", true);
                		$(`.${diaIntParaString(e.dia)}`).find(".entrada-almoco").val('').prop("disabled", true);
            		}
        		}else{
        			
        			$(`.${diaIntParaString(e.dia)}`).find(".aberto").prop('checked', false);
            		$(`.${diaIntParaString(e.dia)}`).find(".entrada").val('').prop("disabled", true);
            		$(`.${diaIntParaString(e.dia)}`).find(".saida").val('').prop("disabled", true);
            		$(`.${diaIntParaString(e.dia)}`).find(".almoco").prop('checked', false).prop("disabled", true);
            		$(`.${diaIntParaString(e.dia)}`).find(".saida-almoco").val('').prop("disabled", true);
            		$(`.${diaIntParaString(e.dia)}`).find(".entrada-almoco").val('').prop("disabled", true);
        		}
        	});
        	
        	
        }
    });
	waitingDialog.hide();
}

function btns(){
	
	$(".aberto").on("change",function(){
		
		if($(this).is(":checked")){
			$(this).parent().parent().parent().parent().find(".entrada").prop("disabled", false);
			$(this).parent().parent().parent().parent().find(".saida").prop("disabled", false);
			$(this).parent().parent().parent().parent().find(".almoco").prop("disabled", false);
		}else{
			
			$(this).parent().parent().parent().parent().find(".almoco").prop('checked', false).prop("disabled", true);
			$(this).parent().parent().parent().parent().find(".saida-almoco").prop("disabled", true);
			$(this).parent().parent().parent().parent().find(".entrada-almoco").prop("disabled", true);
			$(this).parent().parent().parent().parent().find(".entrada").prop("disabled", true);
			$(this).parent().parent().parent().parent().find(".saida").prop("disabled", true);
		}
		
	});
	

	
   $(".almoco").on("change",function(){
	   
	   if($(this).is(":checked")){
			$(this).parent().parent().parent().parent().find(".saida-almoco").prop("disabled", false);
			$(this).parent().parent().parent().parent().find(".entrada-almoco").prop("disabled", false);
		}else{
			$(this).parent().parent().parent().parent().find(".saida-almoco").prop("disabled", true);
			$(this).parent().parent().parent().parent().find(".entrada-almoco").prop("disabled", true);
		}
		
	});
	
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
	
	
	$("#form-horario-atendimento").validate(
			{
			 
				// Rules for form validation
				rules:
				{
					/*descricao:
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
					}*/
				},
				messages:
				{
					/*descricao:
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
					}*/
				},
				submitHandler: function submitHandler(form)
				{
					
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
					        domingo: 7
					    }];
					
					 var horarioAtendimento = [];

			            dias.forEach(function(element) {
			            	
			            	
			            	
			                if ($(`.${Object.keys(element)}`).find(".aberto").is(":checked")) {


			                    
			                    
			                    if($(`.${Object.keys(element)}`).find(".almoco").is(":checked")){
			                    	horarioAtendimento.push({
				                        dia: Object.keys(element)[0].toUpperCase(),
				                        aberto: true,
				                        almoco : true,
				                        saidaAlmoco : $(`.${Object.keys(element)}`).find(".saida-almoco").val() ,
				                        entradaAlmoco : $(`.${Object.keys(element)}`).find(".entrada-almoco").val() ,
				                        entrada: $(`.${Object.keys(element)}`).find(".entrada").val(),
				                        saida: $(`.${Object.keys(element)}`).find(".saida").val(),
				                        idFuncionario: $(".nav-link.active").attr('idBarbeiro')
				                    });
			                    }else{
			                    	horarioAtendimento.push({
				                        dia: Object.keys(element)[0].toUpperCase(),
				                        aberto: true,
				                        almoco : false,
				                        entrada: $(`.${Object.keys(element)}`).find(".entrada").val(),
				                        saida: $(`.${Object.keys(element)}`).find(".saida").val(),
				                        idFuncionario: $(".nav-link.active").attr('idBarbeiro')
				                    });
			                    }

			                } else {

			                    horarioAtendimento.push({
			                        dia: Object.keys(element)[0].toUpperCase(),
			                        aberto: false,
			                        almoco : false,
			                        idFuncionario:$(".nav-link.active").attr('idBarbeiro')
			                    });
			                }

			            });

			            waitingDialog.show('Salvando horários...');
			            $.ajax({
			                type: 'POST',
			                url: `api/funcionarios/horario-atendimento`,
			                contentType: "application/json; charset=utf-8",
			                data: JSON.stringify(horarioAtendimento),
			                beforeSend: function (request) {
			        			request.setRequestHeader("Authorization", `Bearer ${getToken()}`);
			        	    },
			                error: function error(data) {
			                	waitingDialog.hide();
			                    lancarToastr("error", data.message)

			                },
			                // dataType: 'json',
			                success: function success(data) {

			                    lancarToastr("success", "Horários de atendimento salvo.",true)

			                }
			            });

				}

			});
	
	
}